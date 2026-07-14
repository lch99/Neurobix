'use strict';

const { Lesson, Class, Schedule } = require('../db/models');

const LESSON_INCLUDE = [
  { model: Class, as: 'class', attributes: ['id', 'name', 'subject', 'teacher_id'] },
  { model: Schedule, as: 'schedule' },
];

function serializeLesson(lesson) {
  const schedule = lesson.schedule;
  const publishAt = schedule?.publish_at || null;
  const deadlineAt = schedule?.deadline_at || null;

  let status = 'draft';
  if (lesson.status === 'published') {
    status = 'published';
  } else if (publishAt && new Date(publishAt) > new Date()) {
    status = 'scheduled';
  }

  return {
    id: lesson.id,
    title: lesson.title,
    classId: lesson.class_id,
    className: lesson.class?.name || null,
    subject: lesson.class?.subject || null,
    status,
    releaseDate: publishAt,
    deadline: deadlineAt,
    notifyEmail: schedule ? schedule.notify_email : true,
    completionRate: 0,
  };
}

async function getOwnedClassIds(teacherId) {
  const classes = await Class.findAll({ where: { teacher_id: teacherId }, attributes: ['id'] });
  return classes.map((c) => c.id);
}

async function listSchedules(req, res) {
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

async function getLessonForUser(lessonId, user) {
  const lesson = await Lesson.findByPk(lessonId, { include: LESSON_INCLUDE });
  if (!lesson) return { error: 404 };
  if (user.role === 'teacher' && lesson.class.teacher_id !== user.id) return { error: 403 };
  return { lesson };
}

async function updateSchedule(req, res) {
  const { lesson, error } = await getLessonForUser(req.params.lessonId, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Lesson not found' : 'Forbidden' });

  const { publishAt, deadlineAt, notifyEmail } = req.body;

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

  const isImmediate = !publishAt || new Date(publishAt) <= new Date();
  await lesson.update({ status: isImmediate ? 'published' : 'draft' });

  const updated = await Lesson.findByPk(lesson.id, { include: LESSON_INCLUDE });
  return res.json(serializeLesson(updated));
}

async function deleteSchedule(req, res) {
  const { lesson, error } = await getLessonForUser(req.params.lessonId, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Lesson not found' : 'Forbidden' });

  if (lesson.schedule) {
    await lesson.schedule.destroy();
  }
  await lesson.update({ status: 'draft' });

  const updated = await Lesson.findByPk(lesson.id, { include: LESSON_INCLUDE });
  return res.json(serializeLesson(updated));
}

module.exports = { listSchedules, updateSchedule, deleteSchedule };
