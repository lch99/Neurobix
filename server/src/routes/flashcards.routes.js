'use strict';

const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const { listFlashcards, createFlashcard, updateFlashcard, deleteFlashcard } = require('../controllers/flashcards.controller');

const router = express.Router();
const staff = requireRole('admin', 'teacher');

router.use(authenticate);

router.get('/', listFlashcards);
router.post('/', staff, createFlashcard);
router.put('/:id', staff, updateFlashcard);
router.delete('/:id', staff, deleteFlashcard);

module.exports = router;
