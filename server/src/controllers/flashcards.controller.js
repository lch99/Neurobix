'use strict';

const { Flashcard, Lesson, Class } = require('../db/models');

function serializeCard(card) {
  return {
    id: card.id,
    lessonId: card.lesson_id,
    front: card.front_text,
    back: card.back_text,
    hint: card.hint,
    sequenceOrder: card.sequence_order,
  };
}

async function getLessonForUser(lessonId, user) {
  const lesson = await Lesson.findByPk(lessonId, { include: [{ model: Class, as: 'class' }] });
  if (!lesson) return { error: 404 };
  if (user.role === 'teacher' && lesson.class.teacher_id !== user.id) return { error: 403 };
  return { lesson };
}

async function listFlashcards(req, res) {
  const { lessonId } = req.query;
  if (!lessonId) return res.status(400).json({ message: 'lessonId is required' });

  const { lesson, error } = await getLessonForUser(lessonId, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Lesson not found' : 'Forbidden' });

  const cards = await Flashcard.findAll({
    where: { lesson_id: lesson.id },
    order: [['sequence_order', 'ASC']],
  });

  return res.json(cards.map(serializeCard));
}

async function createFlashcard(req, res) {
  const { lessonId, front, back, hint } = req.body;
  if (!lessonId) return res.status(400).json({ message: 'lessonId is required' });

  const { lesson, error } = await getLessonForUser(lessonId, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Lesson not found' : 'Forbidden' });

  const count = await Flashcard.count({ where: { lesson_id: lesson.id } });

  const card = await Flashcard.create({
    lesson_id: lesson.id,
    front_text: front || '',
    back_text: back || '',
    hint: hint || '',
    sequence_order: count,
  });

  return res.status(201).json(serializeCard(card));
}

async function getCardForUser(cardId, user) {
  const card = await Flashcard.findByPk(cardId, { include: [{ model: Lesson, as: 'lesson', include: [{ model: Class, as: 'class' }] }] });
  if (!card) return { error: 404 };
  if (user.role === 'teacher' && card.lesson.class.teacher_id !== user.id) return { error: 403 };
  return { card };
}

async function updateFlashcard(req, res) {
  const { card, error } = await getCardForUser(req.params.id, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Flashcard not found' : 'Forbidden' });

  const { front, back, hint, sequenceOrder } = req.body;

  await card.update({
    front_text: front ?? card.front_text,
    back_text: back ?? card.back_text,
    hint: hint ?? card.hint,
    sequence_order: sequenceOrder ?? card.sequence_order,
  });

  return res.json(serializeCard(card));
}

async function deleteFlashcard(req, res) {
  const { card, error } = await getCardForUser(req.params.id, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Flashcard not found' : 'Forbidden' });

  await card.destroy();
  return res.status(204).send();
}

module.exports = { listFlashcards, createFlashcard, updateFlashcard, deleteFlashcard };
