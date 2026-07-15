'use strict';

const { Assessment, AssessmentQuestion, Lesson, Class } = require('../db/models');

const ASSESSMENT_INCLUDE = [
  { model: Lesson, as: 'lesson', attributes: ['id', 'class_id', 'title', 'status'], include: [{ model: Class, as: 'class', attributes: ['id', 'name', 'subject', 'teacher_id'] }] },
  { model: AssessmentQuestion, as: 'questions' },
];

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

function serializeAssessment(assessment) {
  const questions = (assessment.questions || []).slice().sort((a, b) => a.sequence_order - b.sequence_order);
  return {
    id: assessment.id,
    lessonId: assessment.lesson_id,
    title: assessment.lesson?.title || assessment.title,
    classId: assessment.lesson?.class_id || null,
    className: assessment.lesson?.class?.name || null,
    subject: assessment.lesson?.class?.subject || null,
    status: assessment.lesson?.status || 'draft',
    passMark: assessment.pass_mark,
    leaderboard: assessment.leaderboard_enabled,
    rewardPoints: assessment.reward_points,
    isPastYearPaper: assessment.is_past_year_paper,
    questions: questions.map(serializeQuestion),
  };
}

async function getOwnedClassIds(teacherId) {
  const classes = await Class.findAll({ where: { teacher_id: teacherId }, attributes: ['id'] });
  return classes.map((c) => c.id);
}

async function getAssessmentForUser(assessmentId, user) {
  const assessment = await Assessment.findByPk(assessmentId, { include: ASSESSMENT_INCLUDE });
  if (!assessment) return { error: 404 };
  if (user.role === 'teacher' && assessment.lesson.class.teacher_id !== user.id) return { error: 403 };
  return { assessment };
}

async function listAssessments(req, res) {
  const lessonWhere = {};
  if (req.user.role === 'teacher') {
    const classIds = await getOwnedClassIds(req.user.id);
    lessonWhere.class_id = classIds;
  }
  if (req.query.classId) {
    lessonWhere.class_id = req.query.classId;
  }

  const assessments = await Assessment.findAll({
    include: [
      { model: Lesson, as: 'lesson', attributes: ['id', 'class_id', 'title', 'status'], where: lessonWhere, include: [{ model: Class, as: 'class', attributes: ['id', 'name', 'subject', 'teacher_id'] }] },
      { model: AssessmentQuestion, as: 'questions', attributes: ['id'] },
    ],
    order: [['id', 'ASC']],
  });

  return res.json(assessments.map(serializeAssessment));
}

async function getAssessment(req, res) {
  const { assessment, error } = await getAssessmentForUser(req.params.id, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Assessment not found' : 'Forbidden' });
  return res.json(serializeAssessment(assessment));
}

async function getAssessmentByLesson(req, res) {
  const lessonId = req.params.lessonId;
  const assessment = await Assessment.findOne({ where: { lesson_id: lessonId }, include: ASSESSMENT_INCLUDE });
  if (!assessment) return res.status(404).json({ message: 'Assessment not found for this lesson' });
  if (req.user.role === 'teacher' && assessment.lesson.class.teacher_id !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  return res.json(serializeAssessment(assessment));
}

// Creates the Assessment row for an existing lesson (type must be 'assessment'), or returns the
// one that already exists — the teacher UI calls this idempotently when opening a lesson's editor.
async function createAssessment(req, res) {
  const { lessonId } = req.body;
  if (!lessonId) {
    return res.status(400).json({ message: 'lessonId is required' });
  }

  const lesson = await Lesson.findByPk(lessonId, { include: [{ model: Class, as: 'class' }] });
  if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
  if (lesson.type !== 'assessment') return res.status(400).json({ message: 'Lesson type must be "assessment"' });
  if (req.user.role === 'teacher' && lesson.class.teacher_id !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const existing = await Assessment.findOne({ where: { lesson_id: lessonId }, include: ASSESSMENT_INCLUDE });
  if (existing) return res.json(serializeAssessment(existing));

  const assessment = await Assessment.create({
    lesson_id: lessonId,
    title: lesson.title,
    pass_mark: 70,
    leaderboard_enabled: false,
    reward_points: 10,
  });

  const created = await Assessment.findByPk(assessment.id, { include: ASSESSMENT_INCLUDE });
  return res.status(201).json(serializeAssessment(created));
}

async function updateAssessment(req, res) {
  const { assessment, error } = await getAssessmentForUser(req.params.id, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Assessment not found' : 'Forbidden' });

  const { passMark, leaderboard, rewardPoints, isPastYearPaper } = req.body;

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
  const { assessment, error } = await getAssessmentForUser(req.params.id, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Assessment not found' : 'Forbidden' });

  await AssessmentQuestion.destroy({ where: { assessment_id: assessment.id } });
  await assessment.destroy();

  return res.status(204).send();
}

async function createQuestion(req, res) {
  const { assessment, error } = await getAssessmentForUser(req.params.id, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Assessment not found' : 'Forbidden' });

  const { type, text, imageUrl, options, answer, points } = req.body;
  if (!type) return res.status(400).json({ message: 'type is required' });

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

async function getQuestionForUser(questionId, user) {
  const question = await AssessmentQuestion.findByPk(questionId, {
    include: [{ model: Assessment, as: 'assessment', include: [{ model: Lesson, as: 'lesson', include: [{ model: Class, as: 'class' }] }] }],
  });
  if (!question) return { error: 404 };
  if (user.role === 'teacher' && question.assessment.lesson.class.teacher_id !== user.id) return { error: 403 };
  return { question };
}

async function updateQuestion(req, res) {
  const { question, error } = await getQuestionForUser(req.params.id, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Question not found' : 'Forbidden' });

  const { type, text, imageUrl, options, answer, points, sequenceOrder } = req.body;

  await question.update({
    type: type ?? question.type,
    question_text: text ?? question.question_text,
    question_image_url: imageUrl ?? question.question_image_url,
    options: options ?? question.options,
    correct_answer: answer ?? question.correct_answer,
    points: points ?? question.points,
    sequence_order: sequenceOrder ?? question.sequence_order,
  });

  return res.json(serializeQuestion(question));
}

async function deleteQuestion(req, res) {
  const { question, error } = await getQuestionForUser(req.params.id, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Question not found' : 'Forbidden' });

  await question.destroy();
  return res.status(204).send();
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
};
