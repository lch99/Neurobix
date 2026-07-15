'use strict';

const { Lesson, Class, Flashcard, Assessment } = require('../db/models');

function serializeLesson(lesson) {
  return {
    id: lesson.id,
    classId: lesson.class_id,
    className: lesson.class?.name || null,
    subject: lesson.class?.subject || null,
    title: lesson.title,
    type: lesson.type,
    sequenceOrder: lesson.sequence_order,
    weekNumber: lesson.week_number,
    difficulty: lesson.difficulty,
    durationMinutes: lesson.duration_minutes,
    description: lesson.description,
    status: lesson.status,
    cardCount: lesson.flashcards ? lesson.flashcards.length : undefined,
  };
}

const LESSON_INCLUDE = [
  { model: Class, as: 'class', attributes: ['id', 'name', 'subject', 'teacher_id'] },
  { model: Flashcard, as: 'flashcards', attributes: ['id'] },
];

async function getOwnedClassIds(teacherId) {
  const classes = await Class.findAll({ where: { teacher_id: teacherId }, attributes: ['id'] });
  return classes.map((c) => c.id);
}

async function listLessons(req, res) {
  let where = {};

  if (req.user.role === 'teacher') {
    const classIds = await getOwnedClassIds(req.user.id);
    where.class_id = classIds;
  }
  if (req.query.classId) {
    where.class_id = req.query.classId;
  }

  const lessons = await Lesson.findAll({
    where,
    include: LESSON_INCLUDE,
    order: [['class_id', 'ASC'], ['sequence_order', 'ASC']],
  });

  return res.json(lessons.map(serializeLesson));
}

async function createLesson(req, res) {
  const { classId, title, type, difficulty, durationMinutes, description, status, weekNumber } = req.body;

  if (!classId || !title || !type) {
    return res.status(400).json({ message: 'classId, title and type are required' });
  }

  const cls = await Class.findByPk(classId);
  if (!cls) return res.status(404).json({ message: 'Class not found' });
  if (req.user.role === 'teacher' && cls.teacher_id !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const count = await Lesson.count({ where: { class_id: classId } });

  const lesson = await Lesson.create({
    class_id: classId,
    title,
    type,
    sequence_order: count,
    week_number: weekNumber || null,
    difficulty: difficulty || null,
    duration_minutes: durationMinutes || null,
    description: description || null,
    status: status === 'published' ? 'published' : 'draft',
  });

  if (lesson.type === 'assessment') {
    await Assessment.create({
      lesson_id: lesson.id,
      title: lesson.title,
      pass_mark: 70,
      leaderboard_enabled: false,
      reward_points: 10,
    });
  }

  const created = await Lesson.findByPk(lesson.id, { include: LESSON_INCLUDE });
  return res.status(201).json(serializeLesson(created));
}

async function getLessonForUser(lessonId, user) {
  const lesson = await Lesson.findByPk(lessonId, { include: LESSON_INCLUDE });
  if (!lesson) return { error: 404 };
  if (user.role === 'teacher' && lesson.class.teacher_id !== user.id) return { error: 403 };
  return { lesson };
}

async function updateLesson(req, res) {
  const { lesson, error } = await getLessonForUser(req.params.id, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Lesson not found' : 'Forbidden' });

  const { title, type, difficulty, durationMinutes, description, status, sequenceOrder, weekNumber } = req.body;

  await lesson.update({
    title: title ?? lesson.title,
    type: type ?? lesson.type,
    difficulty: difficulty ?? lesson.difficulty,
    duration_minutes: durationMinutes ?? lesson.duration_minutes,
    description: description ?? lesson.description,
    status: status ?? lesson.status,
    sequence_order: sequenceOrder ?? lesson.sequence_order,
    week_number: weekNumber !== undefined ? weekNumber : lesson.week_number,
  });

  const updated = await Lesson.findByPk(lesson.id, { include: LESSON_INCLUDE });
  return res.json(serializeLesson(updated));
}

async function deleteLesson(req, res) {
  const { lesson, error } = await getLessonForUser(req.params.id, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Lesson not found' : 'Forbidden' });

  await lesson.destroy();
  return res.status(204).send();
}

module.exports = { listLessons, createLesson, updateLesson, deleteLesson };
