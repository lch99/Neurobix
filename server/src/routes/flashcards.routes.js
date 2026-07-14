'use strict';

const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { listFlashcards, createFlashcard, updateFlashcard, deleteFlashcard } = require('../controllers/flashcards.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', listFlashcards);
router.post('/', createFlashcard);
router.put('/:id', updateFlashcard);
router.delete('/:id', deleteFlashcard);

module.exports = router;
