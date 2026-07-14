'use strict';

const jwt = require('jsonwebtoken');
const { User } = require('../db/models');

const IDLE_TIMEOUT_MS = 10 * 60 * 1000;

async function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  const user = await User.findByPk(payload.id);
  if (!user || user.status !== 'active') {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (user.session_token !== payload.sid) {
    return res.status(401).json({ code: 'SESSION_REPLACED', message: 'Logged in from another device' });
  }

  if (user.role !== 'student' && user.last_activity_at) {
    const idleFor = Date.now() - new Date(user.last_activity_at).getTime();
    if (idleFor > IDLE_TIMEOUT_MS) {
      await user.update({ session_token: null });
      return res.status(401).json({ code: 'SESSION_IDLE_TIMEOUT', message: 'Logged out due to inactivity' });
    }
  }

  await user.update({ last_activity_at: new Date() });

  req.user = { id: user.id, role: user.role, name: user.name };
  next();
}

module.exports = { authenticate, IDLE_TIMEOUT_MS };
