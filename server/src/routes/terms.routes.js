'use strict';

const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { listTerms, createTerm, updateTerm, deleteTerm } = require('../controllers/terms.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', listTerms);
router.post('/', createTerm);
router.put('/:id', updateTerm);
router.delete('/:id', deleteTerm);

module.exports = router;
