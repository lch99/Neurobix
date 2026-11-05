'use strict';

const { Assessment, AssessmentQuestion, AssessmentAttempt, Lesson, Class, Schedule, User } = require('../db/models');
const {
  readableClassIds, canEditClass, isLearnerView, effectiveLessonStatus, readableStudentIds,
} = require('../lib/access');
const { scoreAttempt } = require('../lib/scoring');

const QUESTION_TYPES = ['mcq', 'true_false', 'fill_in', 'image', 'match'];

const LESSON_INCLUDE = {
  model: Lesson,
  as: 'lesson',
  attributes: ['id', 'class_id', 'title', 'status'],
  include: [
    { model: Class, as: 'class', attributes: ['id', 'name', 'subject', 'teacher_id'] },
    { model: Schedule, as: 'schedule', attributes: ['id', 'publish_at'] },
  ],
};

const ASSESSMENT_INCLUDE = [LESSON_INCLUDE, { model: AssessmentQuestion, as: 'questions' }];

function serializeQuestion(q) {
  return {
    id: q.id,
    assessmentId: q.assessment_id,
    type: q.type,
    text: q.question_text,
    imageUrl: q.question_image_url,
    options: q.options,
    answer: q.correct_answer,
    points: q.points,
    sequenceOrder: q.sequence_order,
  };
}

function sortedQuestions(assessment) {
  return (assessment.questions || []).slice().sort((a, b) => a.sequence_order - b.sequence_order || a.id - b.id);
}

function serializeAssessment(assessment) {
  return {
    id: assessment.id,
    lessonId: assessment.lesson_id,
    title: assessment.lesson?.title || assessment.title,
    classId: assessment.lesson?.class_id || null,
    className: assessment.lesson?.class?.name || null,
    subject: assessment.lesson?.class?.subject || null,
    status: assessment.lesson ? effectiveLessonStatus(assessment.lesson) : 'draft',
    passMark: assessment.pass_mark,
    leaderboard: assessment.leaderboard_enabled,
    rewardPoints: assessment.reward_points,
    isPastYearPaper: assessment.is_past_year_paper,
    questions: sortedQuestions(assessment).map(serializeQuestion),
  };
}

function serializeAttempt(attempt, { includeAnswers = true } = {}) {
  return {
    id: attempt.id,
    assessmentId: attempt.assessment_id,
    studentId: attempt.student_id,
    studentName: attempt.student?.name || null,
    score: attempt.score,
    totalPoints: attempt.total_points,
    ...(includeAnswers ? { answers: attempt.answers } : {}),
    completedAt: attempt.completed_at || attempt.created_at,
  };
}

// Students/parents only see published assessments, and never past-year papers (those stay
// hidden until the AI exam or a teacher assigns them — Phase 3).
function learnerCanSee(assessment) {
  return effectiveLessonStatus(assessment.lesson) === 'published' && !assessment.is_past_year_paper;
}

async function canRead(assessment, user) {
  const classIds = await readableClassIds(user);
  if (classIds && !classIds.includes(assessment.lesson.class_id)) return false;
  if (isLearnerView(user) && !learnerCanSee(assessment)) return false;
  return true;
}

async function loadAssessment(where, user, { edit = false } = {}) {
  const assessment = await Assessment.findOne({ where, include: ASSESSMENT_INCLUDE });
  if (!assessment) return { error: 404 };
  if (edit) {
    if (!canEditClass(user, assessment.lesson.class)) return { error: 403 };
  } else if (!(await canRead(assessment, user))) {
    // Hidden content looks the same as missing content to learners.
    return { error: isLearnerView(user) ? 404 : 403 };
  }
  return { assessment };
}

function sendError(res, error, what = 'Assessment') {
  return res.status(error).json({ message: error === 404 ? `${what} not found` : 'Forbidden' });
}

async function listAssessments(req, res) {
  const lessonWhere = {};
  const classIds = await readableClassIds(req.user);
  if (classIds) lessonWhere.class_id = classIds;
  if (req.query.classId) {
    const requested = Number(req.query.classId);
    lessonWhere.class_id = classIds ? classIds.filter((id) => id === requested) : requested;
  }

  const assessments = await Assessment.findAll({
    include: [{ ...LESSON_INCLUDE, where: lessonWhere, required: true }, { model: AssessmentQuestion, as: 'questions' }],
    order: [['id', 'ASC']],
  });

  const visible = isLearnerView(req.user) ? assessments.filter(learnerCanSee) : assessments;
  return res.json(visible.map(serializeAssessment));
}

async function getAssessment(req, res) {
  const { assessment, error } = await loadAssessment({ id: req.params.id }, req.user);
  if (error) return sendError(res, error);
  return res.json(serializeAssessment(assessment));
}

async function getAssessmentByLesson(req, res) {
  const { assessment, error } = await loadAssessment({ lesson_id: req.params.lessonId }, req.user);
  if (error) return sendError(res, error, 'Assessment for this lesson');
  return res.json(serializeAssessment(assessment));
}

// Creates the Assessment row for an existing lesson (type must be 'assessment'), or returns the
// one that already exists — the teacher UI calls this idempotently when opening a lesson's editor.
async function createAssessment(req, res) {
  const { lessonId } = req.body || {};
  if (!lessonId) {
    return res.status(400).json({ message: 'lessonId is required' });
  }

  const lesson = await Lesson.findByPk(lessonId, { include: [{ model: Class, as: 'class' }] });
  if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
  if (lesson.type !== 'assessment') return res.status(400).json({ message: 'Lesson type must be "assessment"' });
  if (!canEditClass(req.user, lesson.class)) return res.status(403).json({ message: 'Forbidden' });

  const [assessment, created] = await Assessment.findOrCreate({
    where: { lesson_id: lessonId },
    defaults: { lesson_id: lessonId, title: lesson.title },
  });

  const full = await Assessment.findByPk(assessment.id, { include: ASSESSMENT_INCLUDE });
  return res.status(created ? 201 : 200).json(serializeAssessment(full));
}

async function updateAssessment(req, res) {
  const { assessment, error } = await loadAssessment({ id: req.params.id }, req.user, { edit: true });
  if (error) return sendError(res, error);

  const { passMark, leaderboard, rewardPoints, isPastYearPaper } = req.body || {};

  await assessment.update({
    pass_mark: passMark ?? assessment.pass_mark,
    leaderboard_enabled: leaderboard ?? assessment.leaderboard_enabled,
    reward_points: rewardPoints ?? assessment.reward_points,
    is_past_year_paper: isPastYearPaper ?? assessment.is_past_year_paper,
  });

  const updated = await Assessment.findByPk(assessment.id, { include: ASSESSMENT_INCLUDE });
  return res.json(serializeAssessment(updated));
}

async function deleteAssessment(req, res) {
  const { assessment, error } = await loadAssessment({ id: req.params.id }, req.user, { edit: true });
  if (error) return sendError(res, error);

  await AssessmentQuestion.destroy({ where: { assessment_id: assessment.id } });
  await assessment.destroy();

  return res.status(204).send();
}

async function createQuestion(req, res) {
  const { assessment, error } = await loadAssessment({ id: req.params.id }, req.user, { edit: true });
  if (error) return sendError(res, error);

  const { type, text, imageUrl, options, answer, points } = req.body || {};
  if (!QUESTION_TYPES.includes(type)) return res.status(400).json({ message: `type must be one of: ${QUESTION_TYPES.join(', ')}` });

  const count = await AssessmentQuestion.count({ where: { assessment_id: assessment.id } });

  const question = await AssessmentQuestion.create({
    assessment_id: assessment.id,
    type,
    question_text: text || '',
    question_image_url: imageUrl || null,
    options: options ?? null,
    correct_answer: answer ?? null,
    points: points || 1,
    sequence_order: count,
  });

  return res.status(201).json(serializeQuestion(question));
}

async function getQuestionForEdit(questionId, user) {
  const question = await AssessmentQuestion.findByPk(questionId, {
    include: [{ model: Assessment, as: 'assessment', include: [{ model: Lesson, as: 'lesson', include: [{ model: Class, as: 'class' }] }] }],
  });
  if (!question) return { error: 404 };
  if (!canEditClass(user, question.assessment.lesson.class)) return { error: 403 };
  return { question };
}

async function updateQuestion(req, res) {
  const { question, error } = await getQuestionForEdit(req.params.id, req.user);
  if (error) return sendError(res, error, 'Question');

  const { type, text, imageUrl, options, answer, points, sequenceOrder } = req.body || {};
  if (type !== undefined && !QUESTION_TYPES.includes(type)) {
    return res.status(400).json({ message: `type must be one of: ${QUESTION_TYPES.join(', ')}` });
  }

  await question.update({
    type: type ?? question.type,
    question_text: text ?? question.question_text,
    question_image_url: imageUrl !== undefined ? (imageUrl || null) : question.question_image_url,
    options: options !== undefined ? options : question.options,
    correct_answer: answer !== undefined ? answer : question.correct_answer,
    points: points ?? question.points,
    sequence_order: sequenceOrder ?? question.sequence_order,
  });

  return res.json(serializeQuestion(question));
}

async function deleteQuestion(req, res) {
  const { question, error } = await getQuestionForEdit(req.params.id, req.user);
  if (error) return sendError(res, error, 'Question');

  await question.destroy();
  return res.status(204).send();
}

// Attempts power results views and the (optional) leaderboard.
//   staff   → every attempt on assessments they can see
//   student → their own attempts, plus everyone's scores when the leaderboard is on
//   parent  → their children's attempts
async function listAttempts(req, res) {
  const { assessment, error } = await loadAssessment({ id: req.params.id }, req.user);
  if (error) return sendError(res, error);

  const studentIds = await readableStudentIds(req.user);
  const where = { assessment_id: assessment.id };
  const showEveryone = req.user.role === 'student' && assessment.leaderboard_enabled;
  if (studentIds && !showEveryone) where.student_id = studentIds;

  const attempts = await AssessmentAttempt.findAll({
    where,
    include: [{ model: User, as: 'student', attributes: ['id', 'name'] }],
    order: [['score', 'DESC'], ['completed_at', 'ASC'], ['id', 'ASC']],
  });

  return res.json(attempts.map((a) => serializeAttempt(a, {
    includeAnswers: !studentIds || studentIds.includes(a.student_id),
  })));
}

// Scores a submission from the stored answers. Only students' attempts are recorded; staff
// previewing an assessment get their score back without touching results or the leaderboard.
async function submitAttempt(req, res) {
  const { assessment, error } = await loadAssessment({ id: req.params.id }, req.user);
  if (error) return sendError(res, error);
  if (req.user.role === 'parent') return res.status(403).json({ message: 'Parents cannot submit assessments' });

  const answers = req.body?.answers && typeof req.body.answers === 'object' ? req.body.answers : {};
  const questions = sortedQuestions(assessment).map(serializeQuestion);
  const { score, totalPoints } = scoreAttempt(questions, answers);
  const completedAt = new Date();

  if (req.user.role !== 'student') {
    return res.json({
      id: null, assessmentId: assessment.id, studentId: req.user.id, studentName: req.user.name,
      score, totalPoints, answers, completedAt, preview: true,
    });
  }

  const attempt = await AssessmentAttempt.create({
    assessment_id: assessment.id,
    student_id: req.user.id,
    score,
    total_points: totalPoints,
    answers,
    completed_at: completedAt,
  });
  attempt.student = { name: req.user.name };

  return res.status(201).json(serializeAttempt(attempt));
}

module.exports = {
  listAssessments,
  getAssessment,
  getAssessmentByLesson,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  listAttempts,
  submitAttempt,
};
