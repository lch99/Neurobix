'use strict';

const { Class, ClassEnrollment, User } = require('../db/models');

function serializeEnrollment(e) {
  return {
    enrollmentId: e.id,
    studentId: e.student_id,
    name: e.student?.name || null,
    email: e.student?.email || null,
    level: e.student?.level || null,
    classId: e.class_id,
    className: e.class?.name || null,
    subject: e.class?.subject || null,
    status: e.status,
    enrolledAt: e.enrolled_at,
  };
}

async function listStudents(req, res) {
  const classWhere = {};
  if (req.user.role === 'teacher') {
    classWhere.teacher_id = req.user.id;
  }
  if (req.query.classId) {
    classWhere.id = req.query.classId;
  }

  const enrollments = await ClassEnrollment.findAll({
    where: { status: 'active' },
    include: [
      { model: User, as: 'student', attributes: ['id', 'name', 'email', 'level', 'status'] },
      { model: Class, as: 'class', where: classWhere, attributes: ['id', 'name', 'subject', 'teacher_id'] },
    ],
    order: [['enrolled_at', 'DESC']],
  });

  return res.json(enrollments.map(serializeEnrollment));
}

async function removeStudent(req, res) {
  const enrollment = await ClassEnrollment.findByPk(req.params.id, {
    include: [{ model: Class, as: 'class' }],
  });
  if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

  if (req.user.role === 'teacher' && enrollment.class.teacher_id !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await enrollment.update({ status: 'dropped' });
  return res.status(204).send();
}

module.exports = { listStudents, removeStudent };
