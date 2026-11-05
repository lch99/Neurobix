'use strict';

const { Op } = require('sequelize');
const { Class, Lesson, ClassEnrollment, Term, User } = require('../db/models');
const { readableClassIds, canEditClass } = require('../lib/access');

function termIdsOf(cls) {
  if (Array.isArray(cls.term_ids) && cls.term_ids.length) return cls.term_ids;
  return cls.term_id ? [cls.term_id] : [];
}

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
    teacherId: cls.teacher_id,
    teacherName: cls.teacher?.name || null,
    termId: cls.term_id,
    termName: cls.term?.name || null,
    terms: termIdsOf(cls),
    slots: cls.slots,
    coTeachers: cls.co_teachers || [],
    forcedOpenTerm: cls.forced_open_term_id,
    students: enrollments.length,
    lessons: lessons.length,
  };
}

const INCLUDE = [
  { model: Lesson, as: 'lessons', attributes: ['id'] },
  { model: ClassEnrollment, as: 'enrollments', attributes: ['id', 'status'] },
  { model: Term, as: 'term', attributes: ['id', 'name', 'start_date', 'end_date'] },
  { model: User, as: 'teacher', attributes: ['id', 'name'] },
];

function normaliseTerms(terms, termId) {
  if (Array.isArray(terms)) return terms.map(Number).filter(Boolean);
  if (termId) return [Number(termId)];
  return undefined;
}

// Students can additionally browse open (extra) classes to self-enrol.
async function visibleClassWhere(user) {
  const ids = await readableClassIds(user);
  if (ids === null) return {};
  if (user.role === 'student') return { [Op.or]: [{ id: ids }, { type: 'extra', status: 'active' }] };
  return { id: ids };
}

async function listClasses(req, res) {
  const classes = await Class.findAll({
    where: await visibleClassWhere(req.user),
    include: INCLUDE,
    order: [['created_at', 'DESC'], ['id', 'DESC']],
  });

  return res.json(classes.map(serializeClass));
}

async function createClass(req, res) {
  const { name, subject, level, type, description, leaderboardEnabled, termId, terms, slots, coTeachers } = req.body || {};

  if (!name || !subject) {
    return res.status(400).json({ message: 'Name and subject are required' });
  }

  const termIds = normaliseTerms(terms, termId) || [];

  const cls = await Class.create({
    name,
    subject,
    level: level || null,
    type: type === 'extra' ? 'extra' : 'regular',
    description: description || null,
    leaderboard_enabled: !!leaderboardEnabled,
    teacher_id: req.user.role === 'teacher' ? req.user.id : (req.body.teacherId || null),
    term_id: termIds[0] || null,
    term_ids: termIds,
    slots: type === 'extra' ? (Number(slots) || null) : null,
    co_teachers: Array.isArray(coTeachers) ? coTeachers : [],
  });

  const created = await Class.findByPk(cls.id, { include: INCLUDE });
  return res.status(201).json(serializeClass(created));
}

async function getClass(req, res) {
  const cls = await Class.findOne({ where: { id: req.params.id, ...(await visibleClassWhere(req.user)) }, include: INCLUDE });
  if (!cls) return res.status(404).json({ message: 'Class not found' });
  return res.json(serializeClass(cls));
}

async function updateClass(req, res) {
  const cls = await Class.findByPk(req.params.id, { include: INCLUDE });
  if (!cls) return res.status(404).json({ message: 'Class not found' });
  if (!canEditClass(req.user, cls)) return res.status(403).json({ message: 'Forbidden' });

  const {
    name, subject, level, type, description, leaderboardEnabled, status, termId, terms, slots, coTeachers,
    forcedOpenTerm, teacherId,
  } = req.body || {};

  const termIds = normaliseTerms(terms, termId);
  const updates = {
    name: name ?? cls.name,
    subject: subject ?? cls.subject,
    level: level ?? cls.level,
    type: type ?? cls.type,
    description: description ?? cls.description,
    leaderboard_enabled: leaderboardEnabled ?? cls.leaderboard_enabled,
    status: status ?? cls.status,
    slots: slots !== undefined ? (Number(slots) || null) : cls.slots,
    co_teachers: Array.isArray(coTeachers) ? coTeachers : cls.co_teachers,
  };
  if (termIds) {
    updates.term_ids = termIds;
    updates.term_id = termIds[0] || null;
  }
  // Only Admin may force-open a term on an archived class or reassign the teacher.
  if (req.user.role === 'admin') {
    if (forcedOpenTerm !== undefined) updates.forced_open_term_id = forcedOpenTerm || null;
    if (teacherId !== undefined) updates.teacher_id = teacherId || null;
  } else if (forcedOpenTerm !== undefined || teacherId !== undefined) {
    return res.status(403).json({ message: 'Only an admin can change that' });
  }

  await cls.update(updates);

  const updated = await Class.findByPk(cls.id, { include: INCLUDE });
  return res.json(serializeClass(updated));
}

async function deleteClass(req, res) {
  const cls = await Class.findByPk(req.params.id);
  if (!cls) return res.status(404).json({ message: 'Class not found' });
  if (!canEditClass(req.user, cls)) return res.status(403).json({ message: 'Forbidden' });

  await cls.destroy();
  return res.status(204).send();
}

module.exports = { listClasses, createClass, getClass, updateClass, deleteClass, serializeClass };
