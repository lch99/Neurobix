'use strict';

const { Flashcard, Lesson, Class, Schedule } = require('../db/models');
const { readableClassIds, canEditClass, isLearnerView, effectiveLessonStatus } = require('../lib/access');

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

const LESSON_INCLUDE = [{ model: Class, as: 'class' }, { model: Schedule, as: 'schedule' }];

async function getReadableLesson(lessonId, user) {
  const lesson = await Lesson.findByPk(lessonId, { include: LESSON_INCLUDE });
  if (!lesson) return { error: 404 };
  const classIds = await readableClassIds(user);
  if (classIds && !classIds.includes(lesson.class_id)) return { error: 403 };
  if (isLearnerView(user) && effectiveLessonStatus(lesson) !== 'published') return { error: 404 };
  return { lesson };
}

async function getEditableLesson(lessonId, user) {
  const lesson = await Lesson.findByPk(lessonId, { include: LESSON_INCLUDE });
  if (!lesson) return { error: 404 };
  if (!canEditClass(user, lesson.class)) return { error: 403 };
  return { lesson };
}

async function listFlashcards(req, res) {
  const { lessonId } = req.query;
  if (!lessonId) return res.status(400).json({ message: 'lessonId is required' });

  const { lesson, error } = await getReadableLesson(lessonId, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Lesson not found' : 'Forbidden' });

  const cards = await Flashcard.findAll({
    where: { lesson_id: lesson.id },
    order: [['sequence_order', 'ASC'], ['id', 'ASC']],
  });

  return res.json(cards.map(serializeCard));
}

async function createFlashcard(req, res) {
  const { lessonId, front, back, hint } = req.body || {};
  if (!lessonId) return res.status(400).json({ message: 'lessonId is required' });

  const { lesson, error } = await getEditableLesson(lessonId, req.user);
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

async function getCardForEdit(cardId, user) {
  const card = await Flashcard.findByPk(cardId, { include: [{ model: Lesson, as: 'lesson', include: [{ model: Class, as: 'class' }] }] });
  if (!card || !card.lesson) return { error: 404 };
  if (!canEditClass(user, card.lesson.class)) return { error: 403 };
  return { card };
}

async function updateFlashcard(req, res) {
  const { card, error } = await getCardForEdit(req.params.id, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Flashcard not found' : 'Forbidden' });

  const { front, back, hint, sequenceOrder } = req.body || {};

  await card.update({
    front_text: front ?? card.front_text,
    back_text: back ?? card.back_text,
    hint: hint ?? card.hint,
    sequence_order: sequenceOrder ?? card.sequence_order,
  });

  return res.json(serializeCard(card));
}

async function deleteFlashcard(req, res) {
  const { card, error } = await getCardForEdit(req.params.id, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Flashcard not found' : 'Forbidden' });

  await card.destroy();
  return res.status(204).send();
}

module.exports = { listFlashcards, createFlashcard, updateFlashcard, deleteFlashcard };
