'use strict';

const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const {
  listAssessments,
  getAssessment,
  getAssessmentByLesson,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/assessments.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', listAssessments);
router.post('/', createAssessment);
router.get('/by-lesson/:lessonId', getAssessmentByLesson);
router.get('/:id', getAssessment);
router.put('/:id', updateAssessment);
router.delete('/:id', deleteAssessment);

router.post('/:id/questions', createQuestion);

module.exports = router;
