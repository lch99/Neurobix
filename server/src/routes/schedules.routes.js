'use strict';

const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const { listSchedules, updateSchedule, deleteSchedule } = require('../controllers/schedules.controller');

const router = express.Router();

router.use(authenticate, requireRole('admin', 'teacher'));

router.get('/', listSchedules);
router.put('/:lessonId', updateSchedule);
router.delete('/:lessonId', deleteSchedule);

module.exports = router;
