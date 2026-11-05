'use strict';

// Who can see / change which classes. Every content controller (lessons, flashcards,
// assessments, quizzes, schedules, students) scopes its queries through these helpers so
// the role rules live in one place:
//   admin   → everything
//   teacher → classes they teach (classes.teacher_id)
//   student → classes they are actively enrolled in (+ browsing open/extra classes)
//   parent  → read-only view of their linked children's classes

const { Class, ClassEnrollment, ParentStudent } = require('../db/models');

const STAFF_ROLES = ['admin', 'teacher'];

function isStaff(user) {
  return STAFF_ROLES.includes(user.role);
}

// Students and parents only ever see published content.
function isLearnerView(user) {
  return user.role === 'student' || user.role === 'parent';
}

async function ownedClassIds(teacherId) {
  const rows = await Class.findAll({ where: { teacher_id: teacherId }, attributes: ['id'] });
  return rows.map((c) => c.id);
}

async function enrolledClassIds(studentIds) {
  const ids = Array.isArray(studentIds) ? studentIds : [studentIds];
  if (ids.length === 0) return [];
  const rows = await ClassEnrollment.findAll({
    where: { student_id: ids, status: 'active' },
    attributes: ['class_id'],
  });
  return [...new Set(rows.map((r) => r.class_id))];
}

async function childIds(parentId) {
  const rows = await ParentStudent.findAll({ where: { parent_id: parentId }, attributes: ['student_id'] });
  return rows.map((r) => r.student_id);
}

// Class ids whose content this user may read. `null` means unrestricted (admin).
async function readableClassIds(user) {
  switch (user.role) {
    case 'admin':
      return null;
    case 'teacher':
      return ownedClassIds(user.id);
    case 'student':
      return enrolledClassIds(user.id);
    case 'parent':
      return enrolledClassIds(await childIds(user.id));
    default:
      return [];
  }
}

async function canReadClass(user, classId) {
  const ids = await readableClassIds(user);
  return ids === null || ids.includes(Number(classId));
}

function canEditClass(user, cls) {
  if (!cls) return false;
  if (user.role === 'admin') return true;
  return user.role === 'teacher' && cls.teacher_id === user.id;
}

// Student ids whose personal data (attempts, library, progress) this user may read.
// `null` means unrestricted (admin/teacher — teachers are further limited per class).
async function readableStudentIds(user) {
  if (user.role === 'student') return [user.id];
  if (user.role === 'parent') return childIds(user.id);
  return null;
}

// Lessons are stored as draft/published; a schedule's publish_at turns a draft into
// "scheduled" until that time passes, after which it counts as published.
function effectiveLessonStatus(lesson, schedule = lesson.schedule) {
  if (lesson.status === 'published') return 'published';
  const publishAt = schedule?.publish_at;
  if (publishAt) return new Date(publishAt) > new Date() ? 'scheduled' : 'published';
  return 'draft';
}

module.exports = {
  STAFF_ROLES,
  isStaff,
  isLearnerView,
  ownedClassIds,
  enrolledClassIds,
  childIds,
  readableClassIds,
  canReadClass,
  canEditClass,
  readableStudentIds,
  effectiveLessonStatus,
};
