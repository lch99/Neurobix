'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { User } = require('../db/models');
const { sendMail } = require('../lib/mailer');
const { validateCredential, generateTempPassword } = require('../lib/credentials');

const RESET_TTL_MS = 60 * 60 * 1000;

function serializeUser(user) {
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    username: user.username,
    level: user.level,
    mustChangeCredential: !!user.must_change_credential,
  };
}

async function login(req, res) {
  const { identifier, password } = req.body || {};

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

  let usedTempPassword = false;
  let valid = await bcrypt.compare(password, user.password_hash);
  // A "forgot password" temp password works alongside the real one until it expires, so a
  // stranger requesting a reset can never lock the real owner out of their account.
  if (!valid && user.reset_password_hash && user.reset_expires_at && new Date(user.reset_expires_at) > new Date()) {
    valid = await bcrypt.compare(password, user.reset_password_hash);
    usedTempPassword = valid;
  }
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const sessionToken = crypto.randomBytes(32).toString('hex');
  const updates = { session_token: sessionToken, last_activity_at: new Date() };
  if (usedTempPassword) {
    Object.assign(updates, {
      password_hash: user.reset_password_hash,
      reset_password_hash: null,
      reset_expires_at: null,
      must_change_credential: true,
    });
  }
  await user.update(updates);

  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name, sid: sessionToken },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({ token, user: serializeUser(user) });
}

async function logout(req, res) {
  await User.update({ session_token: null }, { where: { id: req.user.id } });
  return res.json({ message: 'Logged out' });
}

async function me(req, res) {
  const user = await User.findByPk(req.user.id);
  return res.json(serializeUser(user));
}

// Used by the forced first-login screen (and any later "change my password/PIN").
async function changeCredential(req, res) {
  const { newCredential } = req.body || {};
  const user = await User.findByPk(req.user.id);

  const problem = validateCredential(user.role, newCredential);
  if (problem) return res.status(400).json({ message: problem });

  await user.update({
    password_hash: await bcrypt.hash(newCredential, 10),
    must_change_credential: false,
    reset_password_hash: null,
    reset_expires_at: null,
  });

  return res.json({ user: serializeUser(user) });
}

// Staff/parent "forgot password". Always answers the same way so it can't be used to find
// out which emails have accounts. Students reset their PIN through a parent or admin.
async function forgotPassword(req, res) {
  const email = String(req.body?.email || '').trim();
  const generic = { message: 'If an account exists for that email, a password reset is on its way.' };
  if (!email) return res.json(generic);

  const user = await User.findOne({ where: { email } });
  if (!user || user.status !== 'active' || user.role === 'student') return res.json(generic);

  const tempPassword = generateTempPassword();
  await user.update({
    reset_password_hash: await bcrypt.hash(tempPassword, 10),
    reset_expires_at: new Date(Date.now() + RESET_TTL_MS),
  });

  await sendMail({
    to: user.email,
    subject: 'Your Neurobix temporary password',
    text: `Hi ${user.name},\n\nUse this temporary password to sign in within the next hour: ${tempPassword}\nYou'll be asked to set a new password straight after.\n\nIf you didn't ask for this, you can ignore this email — your current password still works.`,
  });

  return res.json(generic);
}

module.exports = { login, logout, me, changeCredential, forgotPassword, serializeUser };
