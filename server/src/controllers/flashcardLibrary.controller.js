'use strict';

const { FlashcardLibraryEntry, Flashcard } = require('../db/models');

// Each student's personal "saved cards" library. It is private: only the student reads or
// changes it (studentId in the query/body must be the signed-in student).

const LIBRARY_CAP = 1000; // matches LIBRARY_CAP in client StudentDashboard

function serializeEntry(e) {
  return {
    id: e.id,
    studentId: e.student_id,
    flashcardId: e.flashcard_id,
    subject: e.subject,
    front: e.front_text,
    back: e.back_text,
    hint: e.hint,
    savedAt: e.created_at,
  };
}

function ownStudentId(req, raw) {
  if (req.user.role !== 'student') return { error: 403 };
  if (raw !== undefined && raw !== null && Number(raw) !== req.user.id) return { error: 403 };
  return { studentId: req.user.id };
}

async function listLibrary(req, res) {
  const { studentId, error } = ownStudentId(req, req.query.studentId);
  if (error) return res.status(error).json({ message: 'Forbidden' });

  const entries = await FlashcardLibraryEntry.findAll({ where: { student_id: studentId }, order: [['id', 'ASC']] });
  return res.json(entries.map(serializeEntry));
}

async function addToLibrary(req, res) {
  const { studentId, error } = ownStudentId(req, req.body?.studentId);
  if (error) return res.status(error).json({ message: 'Forbidden' });

  const { flashcardId, subject, front, back, hint } = req.body || {};

  if (flashcardId) {
    const existing = await FlashcardLibraryEntry.findOne({ where: { student_id: studentId, flashcard_id: flashcardId } });
    if (existing) return res.json(serializeEntry(existing));
  }

  const count = await FlashcardLibraryEntry.count({ where: { student_id: studentId } });
  if (count >= LIBRARY_CAP) return res.status(400).json({ message: `Your library is full (${LIBRARY_CAP} cards).` });

  // Prefer the source card's text over whatever the client sent.
  const source = flashcardId ? await Flashcard.findByPk(flashcardId) : null;
  if (flashcardId && !source) return res.status(404).json({ message: 'Flashcard not found' });

  const entry = await FlashcardLibraryEntry.create({
    student_id: studentId,
    flashcard_id: source?.id || null,
    subject: subject || null,
    front_text: source ? source.front_text : (front || ''),
    back_text: source ? source.back_text : (back || ''),
    hint: source ? source.hint : (hint || ''),
  });
  return res.status(201).json(serializeEntry(entry));
}

async function removeFromLibrary(req, res) {
  const { studentId, error } = ownStudentId(req);
  if (error) return res.status(error).json({ message: 'Forbidden' });

  const entry = await FlashcardLibraryEntry.findByPk(req.params.id);
  if (!entry || entry.student_id !== studentId) return res.status(404).json({ message: 'Library card not found' });

  await entry.destroy();
  return res.status(204).send();
}

module.exports = { listLibrary, addToLibrary, removeFromLibrary };
