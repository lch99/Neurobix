'use strict';

const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const { listUsers, createUser, resetUserCredential, updateUser } = require('../controllers/users.controller');

const router = express.Router();

router.use(authenticate, requireRole('admin'));

router.get('/', listUsers);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.post('/:id/reset-credential', resetUserCredential);

module.exports = router;
