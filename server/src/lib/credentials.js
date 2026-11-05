'use strict';

const crypto = require('crypto');

// Students sign in with a username + 4-digit PIN; everyone else uses email + password.
function validateCredential(role, value) {
  if (typeof value !== 'string' || !value) return role === 'student' ? 'PIN is required' : 'Password is required';
  if (role === 'student') {
    return /^\d{4}$/.test(value) ? null : 'PIN needs to be 4 digits';
  }
  return value.length >= 6 ? null : 'Password needs at least 6 characters';
}

// Short, readable temp password (no ambiguous characters) — same feel as the client demo's.
function generateTempPassword() {
  const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < 8; i++) out += alphabet[crypto.randomInt(alphabet.length)];
  return out;
}

module.exports = { validateCredential, generateTempPassword };
