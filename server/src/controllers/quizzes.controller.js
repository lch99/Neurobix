'use strict';

const { Quiz, QuizCard, Class, Lesson } = require('../db/models');
const { readableClassIds, canEditClass, isLearnerView } = require('../lib/access');

// Quizzes belong to a Class and sit "after" one of its lessons. They are ungraded practice
// (studied with the same Study Set as flash cards) — no points, leaderboard or certificates.

const QUIZ_INCLUDE = [
  { model: Class, as: 'class', attributes: ['id', 'name', 'subject', 'teacher_id'] },
  { model: Lesson, as: 'afterLesson', attributes: ['id', 'title'] },
  { model: QuizCard, as: 'cards' },
];

function serializeCard(card) {
  return {
    id: card.id,
    quizId: card.quiz_id,
    front: card.front_text,
    back: card.back_text,
    hint: card.hint,
    sequenceOrder: card.sequence_order,
  };
}

function serializeQuiz(quiz) {
  const cards = (quiz.cards || []).slice().sort((a, b) => a.sequence_order - b.sequence_order || a.id - b.id);
  return {
    id: quiz.id,
    classId: quiz.class_id,
    className: quiz.class?.name ?? null,
    subject: quiz.class?.subject ?? null,
    title: quiz.title,
    status: quiz.status,
    afterLessonId: quiz.after_lesson_id ?? null,
    afterLessonTitle: quiz.afterLesson?.title ?? null,
    cardCount: cards.length,
    cards: cards.map(serializeCard),
  };
}

async function loadQuiz(id, user, { edit = false } = {}) {
  const quiz = await Quiz.findByPk(id, { include: QUIZ_INCLUDE });
  if (!quiz) return { error: 404 };
  if (edit) {
    if (!canEditClass(user, quiz.class)) return { error: 403 };
    return { quiz };
  }
  const classIds = await readableClassIds(user);
  if (classIds && !classIds.includes(quiz.class_id)) return { error: isLearnerView(user) ? 404 : 403 };
  if (isLearnerView(user) && quiz.status !== 'published') return { error: 404 };
  return { quiz };
}

function sendError(res, error, what = 'Quiz') {
  return res.status(error).json({ message: error === 404 ? `${what} not found` : 'Forbidden' });
}

// after_lesson_id must point at a lesson in the same class.
async function validateAfterLesson(afterLessonId, classId) {
  if (!afterLessonId) return null;
  const lesson = await Lesson.findByPk(afterLessonId, { attributes: ['id', 'class_id'] });
  if (!lesson || lesson.class_id !== Number(classId)) return 'afterLessonId must be a lesson in the same class';
  return null;
}

async function listQuizzes(req, res) {
  const where = {};
  const classIds = await readableClassIds(req.user);
  if (classIds) where.class_id = classIds;
  if (req.query.classId) {
    const requested = Number(req.query.classId);
    where.class_id = classIds ? classIds.filter((id) => id === requested) : requested;
  }
  if (isLearnerView(req.user)) where.status = 'published';

  const quizzes = await Quiz.findAll({ where, include: QUIZ_INCLUDE, order: [['id', 'ASC']] });
  return res.json(quizzes.map(serializeQuiz));
}

async function getQuiz(req, res) {
  const { quiz, error } = await loadQuiz(req.params.id, req.user);
  if (error) return sendError(res, error);
  return res.json(serializeQuiz(quiz));
}

async function createQuiz(req, res) {
  const { classId, title, afterLessonId, status } = req.body || {};
  if (!classId || !title || !String(title).trim()) return res.status(400).json({ message: 'classId and title are required' });

  const cls = await Class.findByPk(classId);
  if (!cls) return res.status(404).json({ message: 'Class not found' });
  if (!canEditClass(req.user, cls)) return res.status(403).json({ message: 'Forbidden' });

  const invalid = await validateAfterLesson(afterLessonId, classId);
  if (invalid) return res.status(400).json({ message: invalid });

  const quiz = await Quiz.create({
    class_id: cls.id,
    title: String(title).trim(),
    status: status === 'published' ? 'published' : 'draft',
    after_lesson_id: afterLessonId || null,
  });

  const created = await Quiz.findByPk(quiz.id, { include: QUIZ_INCLUDE });
  return res.status(201).json(serializeQuiz(created));
}

async function updateQuiz(req, res) {
  const { quiz, error } = await loadQuiz(req.params.id, req.user, { edit: true });
  if (error) return sendError(res, error);

  const { classId, title, afterLessonId, status } = req.body || {};
  if (status !== undefined && !['draft', 'published'].includes(status)) {
    return res.status(400).json({ message: 'status must be draft or published' });
  }

  const nextClassId = classId !== undefined ? Number(classId) : quiz.class_id;
  if (nextClassId !== quiz.class_id) {
    const target = await Class.findByPk(nextClassId);
    if (!target) return res.status(404).json({ message: 'Class not found' });
    if (!canEditClass(req.user, target)) return res.status(403).json({ message: 'Forbidden' });
  }
  const nextAfter = afterLessonId !== undefined ? (afterLessonId || null) : quiz.after_lesson_id;
  const invalid = await validateAfterLesson(nextAfter, nextClassId);
  if (invalid) return res.status(400).json({ message: invalid });

  await quiz.update({
    class_id: nextClassId,
    title: title !== undefined ? String(title).trim() || quiz.title : quiz.title,
    status: status ?? quiz.status,
    after_lesson_id: nextAfter,
  });

  const updated = await Quiz.findByPk(quiz.id, { include: QUIZ_INCLUDE });
  return res.json(serializeQuiz(updated));
}

async function deleteQuiz(req, res) {
  const { quiz, error } = await loadQuiz(req.params.id, req.user, { edit: true });
  if (error) return sendError(res, error);

  await quiz.destroy();
  return res.status(204).send();
}

// ── Quiz cards ────────────────────────────────────────────────────────────────

async function listQuizCards(req, res) {
  const { quizId } = req.query;
  if (!quizId) return res.status(400).json({ message: 'quizId is required' });
  const { quiz, error } = await loadQuiz(quizId, req.user);
  if (error) return sendError(res, error);
  return res.json(serializeQuiz(quiz).cards);
}

async function createQuizCard(req, res) {
  const { quizId, front, back, hint } = req.body || {};
  if (!quizId) return res.status(400).json({ message: 'quizId is required' });
  const { quiz, error } = await loadQuiz(quizId, req.user, { edit: true });
  if (error) return sendError(res, error);

  const card = await QuizCard.create({
    quiz_id: quiz.id,
    front_text: front || '',
    back_text: back || '',
    hint: hint || '',
    sequence_order: quiz.cards.length,
  });
  return res.status(201).json(serializeCard(card));
}

async function loadCardForEdit(id, user) {
  const card = await QuizCard.findByPk(id, { include: [{ model: Quiz, as: 'quiz', include: [{ model: Class, as: 'class' }] }] });
  if (!card) return { error: 404 };
  if (!canEditClass(user, card.quiz.class)) return { error: 403 };
  return { card };
}

async function updateQuizCard(req, res) {
  const { card, error } = await loadCardForEdit(req.params.id, req.user);
  if (error) return sendError(res, error, 'Quiz card');

  const { front, back, hint, sequenceOrder } = req.body || {};
  await card.update({
    front_text: front ?? card.front_text,
    back_text: back ?? card.back_text,
    hint: hint ?? card.hint,
    sequence_order: sequenceOrder ?? card.sequence_order,
  });
  return res.json(serializeCard(card));
}

async function deleteQuizCard(req, res) {
  const { card, error } = await loadCardForEdit(req.params.id, req.user);
  if (error) return sendError(res, error, 'Quiz card');

  await card.destroy();
  return res.status(204).send();
}

module.exports = {
  listQuizzes, getQuiz, createQuiz, updateQuiz, deleteQuiz,
  listQuizCards, createQuizCard, updateQuizCard, deleteQuizCard,
};
