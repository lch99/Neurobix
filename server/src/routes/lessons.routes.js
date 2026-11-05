'use strict';

const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const { listLessons, getLesson, createLesson, updateLesson, deleteLesson } = require('../controllers/lessons.controller');

const router = express.Router();
const staff = requireRole('admin', 'teacher');

router.use(authenticate);

router.get('/', listLessons);
router.get('/:id', getLesson);
router.post('/', staff, createLesson);
router.put('/:id', staff, updateLesson);
router.delete('/:id', staff, deleteLesson);

module.exports = router;
