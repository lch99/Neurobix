'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../db/models');
const { Op } = require('sequelize');

async function login(req, res) {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Identifier and password are required' });
  }

  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: identifier }, { username: identifier }],
    },
  });

  if (!user || user.status !== 'active') {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const sessionToken = crypto.randomBytes(32).toString('hex');
  await user.update({ session_token: sessionToken, last_activity_at: new Date() });

  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name, sid: sessionToken },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      username: user.username,
      level: user.level,
    },
  });
}

async function logout(req, res) {
  await User.update({ session_token: null }, { where: { id: req.user.id } });
  return res.json({ message: 'Logged out' });
}

module.exports = { login, logout };
