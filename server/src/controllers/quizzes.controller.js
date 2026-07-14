'use strict';

const { Quiz, QuizQuestion, Lesson, Class } = require('../db/models');

const QUIZ_INCLUDE = [
  { model: Lesson, as: 'lesson', attributes: ['id', 'class_id', 'title', 'status'], include: [{ model: Class, as: 'class', attributes: ['id', 'name', 'subject', 'teacher_id'] }] },
  { model: QuizQuestion, as: 'questions' },
];

function serializeQuestion(q) {
  return {
    id: q.id,
    quizId: q.quiz_id,
    type: q.type,
    text: q.question_text,
    imageUrl: q.question_image_url,
    options: q.options,
    answer: q.correct_answer,
    points: q.points,
    sequenceOrder: q.sequence_order,
  };
}

function serializeQuiz(quiz) {
  const questions = (quiz.questions || []).slice().sort((a, b) => a.sequence_order - b.sequence_order);
  return {
    id: quiz.id,
    lessonId: quiz.lesson_id,
    title: quiz.lesson?.title || quiz.title,
    classId: quiz.lesson?.class_id || null,
    className: quiz.lesson?.class?.name || null,
    subject: quiz.lesson?.class?.subject || null,
    status: quiz.lesson?.status || 'draft',
    passMark: quiz.pass_mark,
    leaderboard: quiz.leaderboard_enabled,
    rewardPoints: quiz.reward_points,
    isPastYearPaper: quiz.is_past_year_paper,
    questions: questions.map(serializeQuestion),
  };
}

async function getOwnedClassIds(teacherId) {
  const classes = await Class.findAll({ where: { teacher_id: teacherId }, attributes: ['id'] });
  return classes.map((c) => c.id);
}

async function getQuizForUser(quizId, user) {
  const quiz = await Quiz.findByPk(quizId, { include: QUIZ_INCLUDE });
  if (!quiz) return { error: 404 };
  if (user.role === 'teacher' && quiz.lesson.class.teacher_id !== user.id) return { error: 403 };
  return { quiz };
}

async function listQuizzes(req, res) {
  const lessonWhere = {};
  if (req.user.role === 'teacher') {
    const classIds = await getOwnedClassIds(req.user.id);
    lessonWhere.class_id = classIds;
  }
  if (req.query.classId) {
    lessonWhere.class_id = req.query.classId;
  }

  const quizzes = await Quiz.findAll({
    include: [
      { model: Lesson, as: 'lesson', attributes: ['id', 'class_id', 'title', 'status'], where: lessonWhere, include: [{ model: Class, as: 'class', attributes: ['id', 'name', 'subject', 'teacher_id'] }] },
      { model: QuizQuestion, as: 'questions', attributes: ['id'] },
    ],
    order: [['id', 'ASC']],
  });

  return res.json(quizzes.map(serializeQuiz));
}

async function getQuiz(req, res) {
  const { quiz, error } = await getQuizForUser(req.params.id, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Quiz not found' : 'Forbidden' });
  return res.json(serializeQuiz(quiz));
}

async function createQuiz(req, res) {
  const { classId, title } = req.body;
  if (!classId || !title) {
    return res.status(400).json({ message: 'classId and title are required' });
  }

  const cls = await Class.findByPk(classId);
  if (!cls) return res.status(404).json({ message: 'Class not found' });
  if (req.user.role === 'teacher' && cls.teacher_id !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const count = await Lesson.count({ where: { class_id: classId } });

  const lesson = await Lesson.create({
    class_id: classId,
    title,
    type: 'quiz',
    sequence_order: count,
    status: 'draft',
  });

  const quiz = await Quiz.create({
    lesson_id: lesson.id,
    title,
    pass_mark: 70,
    leaderboard_enabled: false,
    reward_points: 10,
  });

  const created = await Quiz.findByPk(quiz.id, { include: QUIZ_INCLUDE });
  return res.status(201).json(serializeQuiz(created));
}

async function updateQuiz(req, res) {
  const { quiz, error } = await getQuizForUser(req.params.id, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Quiz not found' : 'Forbidden' });

  const { title, passMark, leaderboard, rewardPoints, status } = req.body;

  await quiz.update({
    title: title ?? quiz.title,
    pass_mark: passMark ?? quiz.pass_mark,
    leaderboard_enabled: leaderboard ?? quiz.leaderboard_enabled,
    reward_points: rewardPoints ?? quiz.reward_points,
  });

  if (title || status) {
    await quiz.lesson.update({
      title: title ?? quiz.lesson.title,
      status: status ?? quiz.lesson.status,
    });
  }

  const updated = await Quiz.findByPk(quiz.id, { include: QUIZ_INCLUDE });
  return res.json(serializeQuiz(updated));
}

async function deleteQuiz(req, res) {
  const { quiz, error } = await getQuizForUser(req.params.id, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Quiz not found' : 'Forbidden' });

  const lesson = quiz.lesson;
  await QuizQuestion.destroy({ where: { quiz_id: quiz.id } });
  await quiz.destroy();
  await lesson.destroy();

  return res.status(204).send();
}

async function createQuestion(req, res) {
  const { quiz, error } = await getQuizForUser(req.params.id, req.user);
  if (error) return res.status(error).json({ message: error === 404 ? 'Quiz not found' : 'Forbidden' });

  const { type, text, imageUrl, options, answer, points } = req.body;
  if (!type) return res.status(400).json({ message: 'type is required' });

  const count = await QuizQuestion.count({ where: { quiz_id: quiz.id } });

  const question = await QuizQuestion.create({
    quiz_id: quiz.id,
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
  const question = await QuizQuestion.findByPk(questionId, {
    include: [{ model: Quiz, as: 'quiz', include: [{ model: Lesson, as: 'lesson', include: [{ model: Class, as: 'class' }] }] }],
  });
  if (!question) return { error: 404 };
  if (user.role === 'teacher' && question.quiz.lesson.class.teacher_id !== user.id) return { error: 403 };
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
  listQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
