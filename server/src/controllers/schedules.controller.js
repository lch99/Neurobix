'use strict';

const { Lesson, Class, Schedule } = require('../db/models');
const { readableClassIds, canEditClass, effectiveLessonStatus } = require('../lib/access');

const LESSON_INCLUDE = [
  { model: Class, as: 'class', attributes: ['id', 'name', 'subject', 'teacher_id'] },
  { model: Schedule, as: 'schedule' },
];

function serializeLesson(lesson) {
  const schedule = lesson.schedule;
  const publishAt = schedule?.publish_at || null;
  const deadlineAt = schedule?.deadline_at || null;

  return {
    id: lesson.id,
    title: lesson.title,
    type: lesson.type,
    weekNumber: lesson.week_number,
    classId: lesson.class_id,
    className: lesson.class?.name || null,
    subject: lesson.class?.subject || null,
    status: effectiveLessonStatus(lesson),
    releaseDate: publishAt,
    deadline: deadlineAt,
    // Same values under the names the lessons API uses.
    publishAt,
    deadlineAt,
    notifyEmail: schedule ? schedule.notify_email : true,
    completionRate: 0,
  };
}

async function listSchedules(req, res) {
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

  return res.json(lessons.map(serializeLesson));
}

async function getEditableLesson(lessonId, user) {
  const lesson = await Lesson.findByPk(lessonId, { include: LESSON_INCLUDE });
  if (!lesson) return { error: 404 };
  if (!canEditClass(user, lesson.class)) return { error: 403 };
  return { lesson };
}

async function updateSchedule(req, res) {
  const { lesson, error } = await getEditableLesson(req.params.lessonId, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Lesson not found' : 'Forbidden' });

  const { publishAt, deadlineAt, notifyEmail } = req.body || {};
  if (publishAt && Number.isNaN(new Date(publishAt).getTime())) return res.status(400).json({ message: 'Invalid publishAt' });
  if (deadlineAt && Number.isNaN(new Date(deadlineAt).getTime())) return res.status(400).json({ message: 'Invalid deadlineAt' });

  let schedule = lesson.schedule;
  if (!schedule) {
    schedule = await Schedule.create({
      lesson_id: lesson.id,
      class_id: lesson.class_id,
      publish_at: publishAt || null,
      deadline_at: deadlineAt || null,
      notify_email: notifyEmail ?? true,
    });
  } else {
    await schedule.update({
      publish_at: publishAt || null,
      deadline_at: deadlineAt || null,
      notify_email: notifyEmail ?? schedule.notify_email,
    });
  }

  // No publish time (or one in the past) publishes now; a future one keeps it a draft
  // that shows as "scheduled" until the time passes.
  const isImmediate = !publishAt || new Date(publishAt) <= new Date();
  await lesson.update({ status: isImmediate ? 'published' : 'draft' });

  const updated = await Lesson.findByPk(lesson.id, { include: LESSON_INCLUDE });
  return res.json(serializeLesson(updated));
}

async function deleteSchedule(req, res) {
  const { lesson, error } = await getEditableLesson(req.params.lessonId, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Lesson not found' : 'Forbidden' });

  if (lesson.schedule) {
    await lesson.schedule.destroy();
  }
  await lesson.update({ status: 'draft' });

  const updated = await Lesson.findByPk(lesson.id, { include: LESSON_INCLUDE });
  return res.json(serializeLesson(updated));
}

module.exports = { listSchedules, updateSchedule, deleteSchedule };
