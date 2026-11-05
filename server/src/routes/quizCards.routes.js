'use strict';

const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const { listQuizCards, createQuizCard, updateQuizCard, deleteQuizCard } = require('../controllers/quizzes.controller');

const router = express.Router();
const staff = requireRole('admin', 'teacher');

router.use(authenticate);

router.get('/', listQuizCards);
router.post('/', staff, createQuizCard);
router.put('/:id', staff, updateQuizCard);
router.delete('/:id', staff, deleteQuizCard);

module.exports = router;
