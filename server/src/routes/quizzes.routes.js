'use strict';

const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const { listQuizzes, getQuiz, createQuiz, updateQuiz, deleteQuiz } = require('../controllers/quizzes.controller');

const router = express.Router();
const staff = requireRole('admin', 'teacher');

router.use(authenticate);

router.get('/', listQuizzes);
router.get('/:id', getQuiz);
router.post('/', staff, createQuiz);
router.put('/:id', staff, updateQuiz);
router.delete('/:id', staff, deleteQuiz);

module.exports = router;
