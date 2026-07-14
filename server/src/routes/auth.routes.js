'use strict';

const express = require('express');
const { login, logout } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/login', login);
router.post('/logout', authenticate, logout);

module.exports = router;
