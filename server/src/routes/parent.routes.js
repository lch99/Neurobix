'use strict';

const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const { listChildren, addChild, resetChildPin } = require('../controllers/parent.controller');

const router = express.Router();

router.use(authenticate, requireRole('parent'));

router.get('/children', listChildren);
router.post('/children', addChild);
router.post('/children/reset-pin', resetChildPin);

module.exports = router;
