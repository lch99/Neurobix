'use strict';

const { Lesson, Class, Flashcard, Assessment, Schedule, User, sequelize } = require('../db/models');
const { readableClassIds, canEditClass, isLearnerView, effectiveLessonStatus } = require('../lib/access');

const TYPES = ['video', 'flashcard', 'assessment', 'reading', 'activity'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const LESSON_INCLUDE = [
  {
    model: Class,
    as: 'class',
    attributes: ['id', 'name', 'subject', 'teacher_id'],
    include: [{ model: User, as: 'teacher', attributes: ['id', 'name'] }],
  },
  { model: Flashcard, as: 'flashcards', attributes: ['id'] },
  { model: Schedule, as: 'schedule' },
];

function serializeLesson(lesson) {
  const schedule = lesson.schedule;
  return {
    id: lesson.id,
    classId: lesson.class_id,
    className: lesson.class?.name || null,
    subject: lesson.class?.subject || null,
    title: lesson.title,
    type: lesson.type,
    status: effectiveLessonStatus(lesson),
    sequenceOrder: lesson.sequence_order,
    weekNumber: lesson.week_number,
    difficulty: lesson.difficulty,
    durationMinutes: lesson.duration_minutes,
    description: lesson.description,
    videoUrl: lesson.video_url,
    objectives: lesson.objectives || null,
    memoryTip: lesson.memory_tip,
    readingSections: lesson.reading_sections || null,
    cardCount: lesson.flashcards ? lesson.flashcards.length : 0,
    publishAt: schedule?.publish_at || null,
    deadlineAt: schedule?.deadline_at || null,
    notifyEmail: schedule ? schedule.notify_email : false,
  };
}

// Non-assessment lessons have no authored reward value yet, so points are derived from the
// lesson itself (same rule as the client's mock data layer).
function computeLessonPoints(lesson, assessmentRewardPoints) {
  if (lesson.type === 'assessment') return assessmentRewardPoints ?? 30;
  if (lesson.type === 'flashcard') return Math.max(20, (lesson.flashcards?.length || 0) * 8);
  return Math.max(20, (lesson.duration_minutes || 10) * 2);
}

async function listLessons(req, res) {
  const where = {};
  const classIds = await readableClassIds(req.user);
  if (classIds) where.class_id = classIds;
  if (req.query.classId) {
    const requested = Number(req.query.classId);
    where.class_id = classIds ? classIds.filter((id) => id === requested) : requested;
  }

  const lessons = await Lesson.findAll({
    where,
    include: LESSON_INCLUDE,
    order: [['class_id', 'ASC'], ['sequence_order', 'ASC'], ['id', 'ASC']],
  });

  let rows = lessons.map(serializeLesson);
  if (isLearnerView(req.user)) rows = rows.filter((l) => l.status === 'published');
  return res.json(rows);
}

async function loadReadableLesson(id, user) {
  const lesson = await Lesson.findByPk(id, { include: LESSON_INCLUDE });
  if (!lesson) return null;
  const classIds = await readableClassIds(user);
  if (classIds && !classIds.includes(lesson.class_id)) return null;
  if (isLearnerView(user) && effectiveLessonStatus(lesson) !== 'published') return null;
  return lesson;
}

async function getLesson(req, res) {
  const lesson = await loadReadableLesson(req.params.id, req.user);
  if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

  const assessment = lesson.type === 'assessment'
    ? await Assessment.findOne({ where: { lesson_id: lesson.id }, attributes: ['reward_points'] })
    : null;

  return res.json({
    ...serializeLesson(lesson),
    teacherName: lesson.class?.teacher?.name || 'Teacher',
    points: computeLessonPoints(lesson, assessment?.reward_points),
  });
}

function validateLessonFields({ type, difficulty }) {
  if (type !== undefined && !TYPES.includes(type)) return `type must be one of: ${TYPES.join(', ')}`;
  if (difficulty !== undefined && difficulty !== null && difficulty !== '' && !DIFFICULTIES.includes(difficulty)) {
    return `difficulty must be one of: ${DIFFICULTIES.join(', ')}`;
  }
  return null;
}

function contentFields(body) {
  const out = {};
  if (body.videoUrl !== undefined) out.video_url = body.videoUrl || null;
  if (body.objectives !== undefined) out.objectives = Array.isArray(body.objectives) ? body.objectives : null;
  if (body.memoryTip !== undefined) out.memory_tip = body.memoryTip || null;
  if (body.readingSections !== undefined) out.reading_sections = Array.isArray(body.readingSections) ? body.readingSections : null;
  return out;
}

async function createLesson(req, res) {
  const body = req.body || {};
  const { classId, title, type, difficulty, durationMinutes, description, status, weekNumber, publishAt, deadlineAt, notifyEmail } = body;

  if (!classId || !title || !type) {
    return res.status(400).json({ message: 'classId, title and type are required' });
  }
  const invalid = validateLessonFields(body);
  if (invalid) return res.status(400).json({ message: invalid });

  const cls = await Class.findByPk(classId);
  if (!cls) return res.status(404).json({ message: 'Class not found' });
  if (!canEditClass(req.user, cls)) return res.status(403).json({ message: 'Forbidden' });

  const lessonId = await sequelize.transaction(async (transaction) => {
    const count = await Lesson.count({ where: { class_id: classId }, transaction });
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
      ...contentFields(body),
    }, { transaction });

    if (lesson.type === 'assessment') {
      await Assessment.create({ lesson_id: lesson.id, title: lesson.title }, { transaction });
    }
    if (publishAt || deadlineAt) {
      await Schedule.create({
        lesson_id: lesson.id,
        class_id: lesson.class_id,
        publish_at: publishAt || null,
        deadline_at: deadlineAt || null,
        notify_email: notifyEmail ?? true,
      }, { transaction });
    }
    return lesson.id;
  });

  const created = await Lesson.findByPk(lessonId, { include: LESSON_INCLUDE });
  return res.status(201).json(serializeLesson(created));
}

async function loadEditableLesson(id, user) {
  const lesson = await Lesson.findByPk(id, { include: LESSON_INCLUDE });
  if (!lesson) return { error: 404 };
  if (!canEditClass(user, lesson.class)) return { error: 403 };
  return { lesson };
}

async function updateLesson(req, res) {
  const { lesson, error } = await loadEditableLesson(req.params.id, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Lesson not found' : 'Forbidden' });

  const body = req.body || {};
  const invalid = validateLessonFields(body);
  if (invalid) return res.status(400).json({ message: invalid });

  const { classId, title, type, difficulty, durationMinutes, description, status, sequenceOrder, weekNumber } = body;

  if (classId !== undefined && Number(classId) !== lesson.class_id) {
    const target = await Class.findByPk(classId);
    if (!target) return res.status(404).json({ message: 'Class not found' });
    if (!canEditClass(req.user, target)) return res.status(403).json({ message: 'Forbidden' });
  }

  // "scheduled" is derived from the schedule, so it leaves the stored status alone.
  let nextStatus = lesson.status;
  if (status === 'published' || status === 'draft') nextStatus = status;

  await sequelize.transaction(async (transaction) => {
    await lesson.update({
      class_id: classId !== undefined ? Number(classId) : lesson.class_id,
      title: title ?? lesson.title,
      type: type ?? lesson.type,
      difficulty: difficulty !== undefined ? (difficulty || null) : lesson.difficulty,
      duration_minutes: durationMinutes !== undefined ? (durationMinutes || null) : lesson.duration_minutes,
      description: description ?? lesson.description,
      status: nextStatus,
      sequence_order: sequenceOrder ?? lesson.sequence_order,
      week_number: weekNumber !== undefined ? weekNumber : lesson.week_number,
      ...contentFields(body),
    }, { transaction });

    if (lesson.schedule && classId !== undefined) {
      await lesson.schedule.update({ class_id: lesson.class_id }, { transaction });
    }
    // Explicitly moving back to draft also cancels a publish time that has already passed,
    // otherwise the schedule would keep it counted as published.
    if (status === 'draft' && lesson.schedule?.publish_at && new Date(lesson.schedule.publish_at) <= new Date()) {
      await lesson.schedule.update({ publish_at: null }, { transaction });
    }
    if (lesson.type === 'assessment') {
      await Assessment.findOrCreate({
        where: { lesson_id: lesson.id },
        defaults: { lesson_id: lesson.id, title: lesson.title },
        transaction,
      });
    }
  });

  const updated = await Lesson.findByPk(lesson.id, { include: LESSON_INCLUDE });
  return res.json(serializeLesson(updated));
}

async function deleteLesson(req, res) {
  const { lesson, error } = await loadEditableLesson(req.params.id, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Lesson not found' : 'Forbidden' });

  await lesson.destroy();
  return res.status(204).send();
}

module.exports = { listLessons, getLesson, createLesson, updateLesson, deleteLesson, serializeLesson, LESSON_INCLUDE };
