'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const classesRoutes = require('./routes/classes.routes');
const lessonsRoutes = require('./routes/lessons.routes');
const flashcardsRoutes = require('./routes/flashcards.routes');
const assessmentsRoutes = require('./routes/assessments.routes');
const assessmentQuestionsRoutes = require('./routes/assessmentQuestions.routes');
const schedulesRoutes = require('./routes/schedules.routes');
const studentsRoutes = require('./routes/students.routes');
const termsRoutes = require('./routes/terms.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/flashcards', flashcardsRoutes);
app.use('/api/assessments', assessmentsRoutes);
app.use('/api/assessment-questions', assessmentQuestionsRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/terms', termsRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
