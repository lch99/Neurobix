'use strict';

const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { listProgress, upsertProgress } = require('../controllers/flashcardProgress.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', listProgress);
router.post('/', upsertProgress);

module.exports = router;
