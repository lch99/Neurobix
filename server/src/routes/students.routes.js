'use strict';

const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const { listStudents, enrollStudent, removeStudent } = require('../controllers/students.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', listStudents);
router.post('/', requireRole('admin', 'teacher'), enrollStudent);
router.delete('/:id', requireRole('admin', 'teacher'), removeStudent);

module.exports = router;
