'use strict';

const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { updateQuestion, deleteQuestion } = require('../controllers/quizzes.controller');

const router = express.Router();

router.use(authenticate);

router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

module.exports = router;
