'use strict';

const { Class, Lesson, ClassEnrollment, Term } = require('../db/models');

function serializeClass(cls) {
  const lessons = cls.lessons || [];
  const enrollments = (cls.enrollments || []).filter((e) => e.status === 'active');

  return {
    id: cls.id,
    name: cls.name,
    subject: cls.subject,
    level: cls.level,
    type: cls.type,
    description: cls.description,
    leaderboardEnabled: cls.leaderboard_enabled,
    status: cls.status,
    termId: cls.term_id,
    termName: cls.term?.name || null,
    students: enrollments.length,
    lessons: lessons.length,
  };
}

const INCLUDE = [
  { model: Lesson, as: 'lessons', attributes: ['id'] },
  { model: ClassEnrollment, as: 'enrollments', attributes: ['id', 'status'] },
  { model: Term, as: 'term', attributes: ['id', 'name', 'start_date', 'end_date'] },
];

async function listClasses(req, res) {
  const where = req.user.role === 'teacher' ? { teacher_id: req.user.id } : {};

  const classes = await Class.findAll({
    where,
    include: INCLUDE,
    order: [['created_at', 'DESC']],
  });

  return res.json(classes.map(serializeClass));
}

async function createClass(req, res) {
  const { name, subject, level, type, description, leaderboardEnabled, termId } = req.body;

  if (!name || !subject) {
    return res.status(400).json({ message: 'Name and subject are required' });
  }

  const cls = await Class.create({
    name,
    subject,
    level: level || null,
    type: type === 'extra' ? 'extra' : 'regular',
    description: description || null,
    leaderboard_enabled: !!leaderboardEnabled,
    teacher_id: req.user.role === 'teacher' ? req.user.id : (req.body.teacherId || null),
    term_id: termId || null,
  });

  const created = await Class.findByPk(cls.id, { include: INCLUDE });
  return res.status(201).json(serializeClass(created));
}

async function getClass(req, res) {
  const cls = await Class.findByPk(req.params.id, { include: INCLUDE });
  if (!cls) return res.status(404).json({ message: 'Class not found' });

  if (req.user.role === 'teacher' && cls.teacher_id !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  return res.json(serializeClass(cls));
}

async function updateClass(req, res) {
  const cls = await Class.findByPk(req.params.id, { include: INCLUDE });
  if (!cls) return res.status(404).json({ message: 'Class not found' });

  if (req.user.role === 'teacher' && cls.teacher_id !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { name, subject, level, type, description, leaderboardEnabled, status, termId } = req.body;

  await cls.update({
    name: name ?? cls.name,
    subject: subject ?? cls.subject,
    level: level ?? cls.level,
    type: type ?? cls.type,
    description: description ?? cls.description,
    leaderboard_enabled: leaderboardEnabled ?? cls.leaderboard_enabled,
    status: status ?? cls.status,
    term_id: termId !== undefined ? termId : cls.term_id,
  });

  const updated = await Class.findByPk(cls.id, { include: INCLUDE });
  return res.json(serializeClass(updated));
}

async function deleteClass(req, res) {
  const cls = await Class.findByPk(req.params.id);
  if (!cls) return res.status(404).json({ message: 'Class not found' });

  if (req.user.role === 'teacher' && cls.teacher_id !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await cls.destroy();
  return res.status(204).send();
}

module.exports = { listClasses, createClass, getClass, updateClass, deleteClass };
