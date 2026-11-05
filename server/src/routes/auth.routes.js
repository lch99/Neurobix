'use strict';

const express = require('express');
const { login, logout, me, changeCredential, forgotPassword } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);
router.post('/change-credential', authenticate, changeCredential);

module.exports = router;
