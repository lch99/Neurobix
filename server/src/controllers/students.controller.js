'use strict';

const { Class, ClassEnrollment, User } = require('../db/models');
const { readableStudentIds } = require('../lib/access');

function serializeEnrollment(e) {
  return {
    enrollmentId: e.id,
    studentId: e.student_id,
    name: e.student?.name || null,
    email: e.student?.email || null,
    username: e.student?.username || null,
    level: e.student?.level || null,
    classId: e.class_id,
    className: e.class?.name || null,
    subject: e.class?.subject || null,
    status: e.status,
    enrolledAt: e.enrolled_at,
  };
}

// Class enrollments. Teachers see their own classes' rosters, students only their own
// enrollments, parents their children's, admins everything.
async function listStudents(req, res) {
  const classWhere = {};
  const where = { status: 'active' };

  if (req.user.role === 'teacher') classWhere.teacher_id = req.user.id;
  const studentIds = await readableStudentIds(req.user);
  if (studentIds) where.student_id = studentIds;
  if (req.query.classId) classWhere.id = req.query.classId;

  const enrollments = await ClassEnrollment.findAll({
    where,
    include: [
      { model: User, as: 'student', attributes: ['id', 'name', 'email', 'username', 'level', 'status'] },
      { model: Class, as: 'class', where: classWhere, attributes: ['id', 'name', 'subject', 'teacher_id'] },
    ],
    order: [['class_id', 'ASC'], ['id', 'ASC']],
  });

  return res.json(enrollments.map(serializeEnrollment));
}

// Enrol a student in a class (teacher of that class or admin). Re-activates a dropped enrollment.
async function enrollStudent(req, res) {
  const { classId, studentId } = req.body || {};
  if (!classId || !studentId) return res.status(400).json({ message: 'classId and studentId are required' });

  const cls = await Class.findByPk(classId);
  if (!cls) return res.status(404).json({ message: 'Class not found' });
  if (req.user.role === 'teacher' && cls.teacher_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

  const student = await User.findByPk(studentId);
  if (!student || student.role !== 'student') return res.status(404).json({ message: 'Student not found' });

  const [enrollment, created] = await ClassEnrollment.findOrCreate({
    where: { class_id: cls.id, student_id: student.id },
    defaults: { class_id: cls.id, student_id: student.id, enrolled_by: 'admin', status: 'active' },
  });
  if (!created && enrollment.status !== 'active') await enrollment.update({ status: 'active', enrolled_at: new Date() });

  const full = await ClassEnrollment.findByPk(enrollment.id, {
    include: [
      { model: User, as: 'student', attributes: ['id', 'name', 'email', 'username', 'level'] },
      { model: Class, as: 'class', attributes: ['id', 'name', 'subject'] },
    ],
  });
  return res.status(created ? 201 : 200).json(serializeEnrollment(full));
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

module.exports = { listStudents, enrollStudent, removeStudent };
