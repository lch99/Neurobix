'use strict';

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const parentRoutes = require('./routes/parent.routes');
const classesRoutes = require('./routes/classes.routes');
const lessonsRoutes = require('./routes/lessons.routes');
const flashcardsRoutes = require('./routes/flashcards.routes');
const flashcardLibraryRoutes = require('./routes/flashcardLibrary.routes');
const flashcardProgressRoutes = require('./routes/flashcardProgress.routes');
const assessmentsRoutes = require('./routes/assessments.routes');
const assessmentQuestionsRoutes = require('./routes/assessmentQuestions.routes');
const quizzesRoutes = require('./routes/quizzes.routes');
const quizCardsRoutes = require('./routes/quizCards.routes');
const schedulesRoutes = require('./routes/schedules.routes');
const studentsRoutes = require('./routes/students.routes');
const termsRoutes = require('./routes/terms.routes');

const app = express();

// CORS_ORIGIN: comma-separated list of allowed front-end origins (unset = allow any, for local dev).
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors(allowedOrigins.length ? { origin: allowedOrigins } : undefined));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/flashcards', flashcardsRoutes);
app.use('/api/flashcard-library', flashcardLibraryRoutes);
app.use('/api/flashcard-progress', flashcardProgressRoutes);
app.use('/api/assessments', assessmentsRoutes);
app.use('/api/assessment-questions', assessmentQuestionsRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/quiz-cards', quizCardsRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/terms', termsRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` });
});

// Express 5 forwards rejected async handlers here. Always answer with JSON so the client's
// apiRequest() can show a message instead of choking on an HTML error page.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Malformed JSON body' });
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: 'That record already exists' });
  }
  const badValue = err.name === 'SequelizeDatabaseError' && /Incorrect|Data truncated|out of range/i.test(err.message);
  if (err.name === 'SequelizeValidationError' || badValue) {
    return res.status(400).json({ message: 'Invalid data' });
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ message: 'Referenced record does not exist' });
  }
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  return res.status(status).json({ message: status >= 500 ? 'Something went wrong on the server' : err.message });
});

module.exports = app;
