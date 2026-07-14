'use strict';

const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const {
  listClasses,
  createClass,
  getClass,
  updateClass,
  deleteClass,
} = require('../controllers/classes.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', listClasses);
router.post('/', createClass);
router.get('/:id', getClass);
router.put('/:id', updateClass);
router.delete('/:id', deleteClass);

module.exports = router;
