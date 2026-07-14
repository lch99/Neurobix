'use strict';

const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { listSchedules, updateSchedule, deleteSchedule } = require('../controllers/schedules.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', listSchedules);
router.put('/:lessonId', updateSchedule);
router.delete('/:lessonId', deleteSchedule);

module.exports = router;
