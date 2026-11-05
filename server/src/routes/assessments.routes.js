'use strict';

const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const {
  listAssessments,
  getAssessment,
  getAssessmentByLesson,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  createQuestion,
  listAttempts,
  submitAttempt,
} = require('../controllers/assessments.controller');

const router = express.Router();
const staff = requireRole('admin', 'teacher');

router.use(authenticate);

router.get('/', listAssessments);
router.post('/', staff, createAssessment);
router.get('/by-lesson/:lessonId', getAssessmentByLesson);
router.get('/:id', getAssessment);
router.put('/:id', staff, updateAssessment);
router.delete('/:id', staff, deleteAssessment);

router.post('/:id/questions', staff, createQuestion);

router.get('/:id/attempts', listAttempts);
router.post('/:id/attempts', submitAttempt);

module.exports = router;
