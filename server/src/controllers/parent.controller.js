'use strict';

const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { User, ParentStudent, ClassEnrollment, Class, sequelize } = require('../db/models');
const { validateCredential } = require('../lib/credentials');

function serializeChild(student) {
  const active = (student.enrollments || []).filter((e) => e.status === 'active');
  return {
    id: student.id,
    name: student.name,
    username: student.username,
    level: student.level,
    status: student.status,
    classes: active.map((e) => ({ id: e.class_id, name: e.class?.name || null, subject: e.class?.subject || null })),
  };
}

async function findLinkedChild(parentId, where) {
  const parent = await User.findByPk(parentId, {
    include: [{
      model: User,
      as: 'children',
      where,
      required: true,
      include: [{ model: ClassEnrollment, as: 'enrollments', include: [{ model: Class, as: 'class', attributes: ['id', 'name', 'subject'] }] }],
    }],
  });
  return parent?.children?.[0] || null;
}

async function listChildren(req, res) {
  const parent = await User.findByPk(req.user.id, {
    include: [{
      model: User,
      as: 'children',
      include: [{ model: ClassEnrollment, as: 'enrollments', include: [{ model: Class, as: 'class', attributes: ['id', 'name', 'subject'] }] }],
    }],
    order: [[{ model: User, as: 'children' }, 'id', 'ASC']],
  });
  return res.json((parent?.children || []).map(serializeChild));
}

// Parent creates their child's student account (username + 4-digit PIN). Like admin-created
// accounts, the child is asked to pick their own PIN on first login.
async function addChild(req, res) {
  const { name, username, pin, level } = req.body || {};
  if (!name || !String(name).trim()) return res.status(400).json({ message: "Please enter your child's full name." });
  if (!username || !String(username).trim()) return res.status(400).json({ message: 'Please set a username.' });
  const problem = validateCredential('student', pin);
  if (problem) return res.status(400).json({ message: problem });

  const identifier = String(username).trim();
  const taken = await User.findOne({ where: { [Op.or]: [{ email: identifier }, { username: identifier }] } });
  if (taken) return res.status(409).json({ message: 'That username is already taken — try another.' });

  const child = await sequelize.transaction(async (transaction) => {
    const created = await User.create({
      role: 'student',
      name: String(name).trim(),
      username: identifier,
      level: level || null,
      password_hash: await bcrypt.hash(pin, 10),
      must_change_credential: true,
      created_by: req.user.id,
    }, { transaction });
    await ParentStudent.create({ parent_id: req.user.id, student_id: created.id }, { transaction });
    return created;
  });

  return res.status(201).json(serializeChild(child));
}

// Parent sets a new PIN for one of their own children (takes effect immediately).
async function resetChildPin(req, res) {
  const { username, pin } = req.body || {};
  const problem = validateCredential('student', pin);
  if (problem) return res.status(400).json({ message: problem });
  if (!username) return res.status(400).json({ message: 'username is required' });

  const child = await findLinkedChild(req.user.id, { username, role: 'student' });
  if (!child) return res.status(404).json({ message: 'Child not found' });

  await User.update(
    { password_hash: await bcrypt.hash(pin, 10), must_change_credential: false, session_token: null },
    { where: { id: child.id } }
  );
  return res.json(serializeChild(child));
}

module.exports = { listChildren, addChild, resetChildPin };
