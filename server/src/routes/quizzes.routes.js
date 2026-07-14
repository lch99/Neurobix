'use strict';

const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const {
  listQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/quizzes.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', listQuizzes);
router.post('/', createQuiz);
router.get('/:id', getQuiz);
router.put('/:id', updateQuiz);
router.delete('/:id', deleteQuiz);

router.post('/:id/questions', createQuestion);

module.exports = router;
