'use strict';

const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const {
  listClasses,
  createClass,
  getClass,
  updateClass,
  deleteClass,
} = require('../controllers/classes.controller');

const router = express.Router();
const staff = requireRole('admin', 'teacher');

router.use(authenticate);

router.get('/', listClasses);
router.post('/', staff, createClass);
router.get('/:id', getClass);
router.put('/:id', staff, updateClass);
router.patch('/:id', staff, updateClass);
router.delete('/:id', staff, deleteClass);

module.exports = router;
