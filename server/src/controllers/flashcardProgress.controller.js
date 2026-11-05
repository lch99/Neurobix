'use strict';

const { FlashcardProgress } = require('../db/models');

// Study Set progress (known/learning status, correct streak, starred) per student per card.
// Card ids are scoped by deckKey ("lesson-18", "quiz-1", "library") because flash cards,
// quiz cards and library entries each have their own id sequence.

const STATUSES = ['new', 'learning', 'known', 'mastered'];

function serialize(p) {
  return {
    studentId: p.student_id,
    deckKey: p.deck_key || null,
    cardId: p.card_id,
    status: p.status,
    correctStreak: p.correct_streak,
    starred: p.starred,
    updatedAt: p.updated_at,
  };
}

async function listProgress(req, res) {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Forbidden' });
  if (req.query.studentId && Number(req.query.studentId) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

  const where = { student_id: req.user.id };
  if (req.query.deckKey) where.deck_key = String(req.query.deckKey);

  const rows = await FlashcardProgress.findAll({ where });
  return res.json(rows.map(serialize));
}

async function upsertProgress(req, res) {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Forbidden' });
  const { studentId, deckKey, cardId, status, correctStreak, starred } = req.body || {};
  if (studentId && Number(studentId) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  if (!cardId) return res.status(400).json({ message: 'cardId is required' });
  if (status !== undefined && !STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  const [row] = await FlashcardProgress.findOrCreate({
    where: { student_id: req.user.id, deck_key: deckKey ? String(deckKey) : '', card_id: Number(cardId) },
  });
  await row.update({
    status: status ?? row.status,
    correct_streak: correctStreak ?? row.correct_streak,
    starred: starred ?? row.starred,
  });
  return res.json(serialize(row));
}

module.exports = { listProgress, upsertProgress };
