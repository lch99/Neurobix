'use strict';

const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { User, ParentStudent, sequelize } = require('../db/models');
const { validateCredential } = require('../lib/credentials');

const ROLES = ['admin', 'teacher', 'student', 'parent'];

function serializeAdminUser(user, parentIdByStudent = {}) {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    status: user.status,
    email: user.email,
    username: user.username,
    level: user.level,
    joined: user.created_at ? new Date(user.created_at).toISOString().slice(0, 10) : null,
    mustChangeCredential: !!user.must_change_credential,
    parentId: user.role === 'student' ? (parentIdByStudent[user.id] ?? null) : null,
  };
}

async function listUsers(req, res) {
  const users = await User.findAll({ order: [['created_at', 'DESC'], ['id', 'DESC']] });
  const links = await ParentStudent.findAll();
  const parentIdByStudent = {};
  links.forEach((l) => { parentIdByStudent[l.student_id] ??= l.parent_id; });
  return res.json(users.map((u) => serializeAdminUser(u, parentIdByStudent)));
}

// Admin "Add User". Students get a username + temporary PIN, everyone else an email +
// temporary password; either way they must pick a new one on first login.
async function createUser(req, res) {
  const { name, role, email, username, password, pin, parentId, level } = req.body || {};
  const isStudent = role === 'student';

  if (!name || !String(name).trim()) return res.status(400).json({ message: 'Name is required' });
  if (!ROLES.includes(role)) return res.status(400).json({ message: 'Invalid role' });
  if (isStudent && !username) return res.status(400).json({ message: 'Username is required for students' });
  if (!isStudent && !email) return res.status(400).json({ message: 'Email is required' });

  const credential = isStudent ? pin : password;
  const problem = validateCredential(role, credential);
  if (problem) return res.status(400).json({ message: problem });

  const identifier = isStudent ? String(username).trim() : String(email).trim();
  const taken = await User.findOne({ where: { [Op.or]: [{ email: identifier }, { username: identifier }] } });
  if (taken) return res.status(409).json({ message: isStudent ? 'That username is already taken.' : 'That email is already registered.' });

  let parent = null;
  if (isStudent && parentId) {
    parent = await User.findByPk(parentId);
    if (!parent || parent.role !== 'parent') return res.status(400).json({ message: 'Linked parent not found' });
  }

  const user = await sequelize.transaction(async (transaction) => {
    const created = await User.create({
      role,
      name: String(name).trim(),
      email: isStudent ? null : identifier,
      username: isStudent ? identifier : null,
      level: level || null,
      password_hash: await bcrypt.hash(credential, 10),
      must_change_credential: true,
      created_by: req.user.id,
    }, { transaction });
    if (parent) {
      await ParentStudent.create({ parent_id: parent.id, student_id: created.id }, { transaction });
    }
    return created;
  });

  return res.status(201).json(serializeAdminUser(user, parent ? { [user.id]: parent.id } : {}));
}

// Admin sets a temporary password/PIN for someone; they must change it at next login.
async function resetUserCredential(req, res) {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { tempPassword } = req.body || {};
  const problem = validateCredential(user.role, tempPassword);
  if (problem) return res.status(400).json({ message: problem });

  await user.update({
    password_hash: await bcrypt.hash(tempPassword, 10),
    must_change_credential: true,
    reset_password_hash: null,
    reset_expires_at: null,
    session_token: null,
  });
  return res.json(serializeAdminUser(user));
}

async function updateUser(req, res) {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { name, status, level } = req.body || {};
  if (status && !['active', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  if (status === 'inactive' && user.id === req.user.id) {
    return res.status(400).json({ message: 'You cannot deactivate your own account' });
  }

  await user.update({
    name: name ?? user.name,
    status: status ?? user.status,
    level: level ?? user.level,
    // Deactivating signs the user out everywhere.
    ...(status === 'inactive' ? { session_token: null } : {}),
  });
  return res.json(serializeAdminUser(user));
}

module.exports = { listUsers, createUser, resetUserCredential, updateUser };
