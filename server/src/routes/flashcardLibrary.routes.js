'use strict';

const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { listLibrary, addToLibrary, removeFromLibrary } = require('../controllers/flashcardLibrary.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', listLibrary);
router.post('/', addToLibrary);
router.delete('/:id', removeFromLibrary);

module.exports = router;
