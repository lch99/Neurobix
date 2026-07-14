'use strict';

const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { listStudents, removeStudent } = require('../controllers/students.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', listStudents);
router.delete('/:id', removeStudent);

module.exports = router;
