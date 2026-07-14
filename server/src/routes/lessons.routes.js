'use strict';

const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { listLessons, createLesson, updateLesson, deleteLesson } = require('../controllers/lessons.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', listLessons);
router.post('/', createLesson);
router.put('/:id', updateLesson);
router.delete('/:id', deleteLesson);

module.exports = router;
