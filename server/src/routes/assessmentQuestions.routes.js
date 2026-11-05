'use strict';

const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const { updateQuestion, deleteQuestion } = require('../controllers/assessments.controller');

const router = express.Router();

router.use(authenticate, requireRole('admin', 'teacher'));

router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

module.exports = router;
