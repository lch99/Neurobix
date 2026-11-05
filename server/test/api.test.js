'use strict';

// End-to-end API checks against a real MySQL database loaded with the demo seed.
//
//   npm run db:reset   # fresh schema + demo data
//   npm test
//
// The suite creates (and cleans up) its own records, but it expects the demo seed to be
// present, so run db:reset first if the database has drifted.

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
require('dotenv').config({ quiet: true });

const app = require('../src/app');
const { sequelize, User } = require('../src/db/models');

let server;
let base;
const tokens = {};

async function call(method, path, { token, body } = {}) {
  const res = await fetch(base + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

async function login(identifier, password) {
  const res = await call('POST', '/api/auth/login', { body: { identifier, password } });
  assert.equal(res.status, 200, `login ${identifier}: ${JSON.stringify(res.body)}`);
  return res.body;
}

before(async () => {
  await sequelize.authenticate();
  server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;

  tokens.student = (await login('ahmad2026', '1234')).token;
  tokens.parent = (await login('parent1@neurobix.com', 'password123')).token;
  tokens.teacher = (await login('sarah.tan@neurobix.com', 'password123')).token;
  tokens.admin = (await login('admin@neurobix.com', 'password123')).token;
  tokens.otherTeacher = (await login('alif@neurobix.com', 'password123')).token;
});

after(async () => {
  await User.destroy({ where: { username: ['test_kid_api', 'test_kid_parent'] } });
  await User.destroy({ where: { email: 'test_teacher_api@neurobix.com' } });
  server?.close();
  await sequelize.close();
});

test('health and auth basics', async () => {
  assert.deepEqual((await call('GET', '/api/health')).body, { status: 'ok' });

  const bad = await call('POST', '/api/auth/login', { body: { identifier: 'ahmad2026', password: '0000' } });
  assert.equal(bad.status, 401);

  const noToken = await call('GET', '/api/lessons');
  assert.equal(noToken.status, 401);

  const me = await call('GET', '/api/auth/me', { token: tokens.student });
  assert.equal(me.body.id, 1);
  assert.equal(me.body.role, 'student');
  assert.equal(me.body.mustChangeCredential, false);
});

test('teacher sees all lessons in own classes with derived status', async () => {
  const { body: lessons } = await call('GET', '/api/lessons', { token: tokens.teacher });
  assert.equal(lessons.length, 10);
  const byId = Object.fromEntries(lessons.map((l) => [l.id, l]));
  assert.equal(byId[5].status, 'draft');
  // publish_at (30 Jun 2026) has passed, so the scheduled lesson now counts as published
  assert.equal(byId[19].status, 'published');
  assert.equal(byId[18].cardCount, 5);
  assert.ok(byId[8].readingSections.length === 2);

  const { body: detail } = await call('GET', '/api/lessons/7', { token: tokens.teacher });
  assert.equal(detail.teacherName, 'Ms Sarah Tan');
  assert.equal(detail.points, 36);
  assert.equal(detail.objectives.length, 3);

  const { body: classes } = await call('GET', '/api/classes', { token: tokens.teacher });
  assert.equal(classes.length, 2);
  const p4a = classes.find((c) => c.id === 1);
  assert.equal(p4a.students, 10);
  assert.deepEqual(p4a.terms, [3]);
  assert.equal(p4a.teacherName, 'Ms Sarah Tan');

  const other = await call('GET', '/api/lessons', { token: tokens.otherTeacher });
  assert.equal(other.body.length, 0, "a teacher must not see another teacher's lessons");
});

test('student only sees published content in enrolled classes', async () => {
  const { body: lessons } = await call('GET', '/api/lessons', { token: tokens.student });
  const ids = lessons.map((l) => l.id).sort((a, b) => a - b);
  assert.deepEqual(ids, [7, 8, 10, 18, 19, 20, 21, 109]);

  assert.equal((await call('GET', '/api/lessons/5', { token: tokens.student })).status, 404);
  assert.equal((await call('GET', '/api/assessments/by-lesson/5', { token: tokens.student })).status, 404);

  const cards = await call('GET', '/api/flashcards?lessonId=18', { token: tokens.student });
  assert.equal(cards.body.length, 5);
  assert.equal(cards.body[0].front, 'What pumps blood around your body?');

  const roster = await call('GET', '/api/students', { token: tokens.student });
  assert.ok(roster.body.every((r) => r.studentId === 1));
  assert.deepEqual(roster.body.map((r) => r.classId).sort(), [1, 2]);

  assert.equal((await call('POST', '/api/classes', { token: tokens.student, body: { name: 'x', subject: 'y' } })).status, 403);
  assert.equal((await call('GET', '/api/schedules', { token: tokens.student })).status, 403);
  assert.equal((await call('GET', '/api/users', { token: tokens.student })).status, 403);
});

test('assessment attempts are scored on the server and scoped per role', async () => {
  const { body: a } = await call('GET', '/api/assessments/by-lesson/20', { token: tokens.student });
  assert.equal(a.questions.length, 10);
  assert.equal(a.leaderboard, true);

  const correct = {};
  for (const q of a.questions) {
    if (q.type === 'match') correct[q.id] = Object.fromEntries(q.options.pairs.map((p, i) => [i, p.right]));
    else correct[q.id] = q.answer;
  }
  const total = a.questions.reduce((s, q) => s + q.points, 0);

  const perfect = await call('POST', `/api/assessments/${a.id}/attempts`, {
    token: tokens.student,
    body: { studentId: 999, studentName: 'Spoofed', answers: correct },
  });
  assert.equal(perfect.status, 201);
  assert.equal(perfect.body.score, total);
  assert.equal(perfect.body.totalPoints, total);
  assert.equal(perfect.body.studentId, 1, 'student id comes from the token, not the body');
  assert.equal(perfect.body.studentName, 'Ahmad bin Hassan');

  const blank = await call('POST', `/api/assessments/${a.id}/attempts`, { token: tokens.student, body: { answers: {} } });
  assert.equal(blank.body.score, 0);

  const preview = await call('POST', `/api/assessments/${a.id}/attempts`, { token: tokens.teacher, body: { answers: correct } });
  assert.equal(preview.body.preview, true);

  const teacherView = await call('GET', `/api/assessments/${a.id}/attempts`, { token: tokens.teacher });
  const mine = teacherView.body.filter((r) => r.studentId === 1);
  assert.ok(mine.length >= 2);
  assert.ok(teacherView.body.every((r) => r.studentId === 1), 'teacher previews are not recorded');
  assert.equal(teacherView.body[0].score, total, 'sorted best score first');

  const parentView = await call('GET', `/api/assessments/${a.id}/attempts`, { token: tokens.parent });
  assert.ok(parentView.body.length >= 2 && parentView.body.every((r) => r.studentId === 1));
  assert.equal((await call('POST', `/api/assessments/${a.id}/attempts`, { token: tokens.parent, body: { answers: {} } })).status, 403);
});

test('teacher builds an assessment with every question type', async () => {
  const lesson = await call('POST', '/api/lessons', {
    token: tokens.teacher,
    body: { classId: 1, title: 'API Test Assessment', type: 'assessment', status: 'draft' },
  });
  assert.equal(lesson.status, 201);

  const { body: a } = await call('GET', `/api/assessments/by-lesson/${lesson.body.id}`, { token: tokens.teacher });
  assert.equal(a.questions.length, 0);

  const match = await call('POST', `/api/assessments/${a.id}/questions`, {
    token: tokens.teacher,
    body: { type: 'match', text: 'Match', options: { pairs: [{ left: 'A', right: '1' }] }, answer: null, points: 2 },
  });
  assert.equal(match.status, 201);
  const tf = await call('POST', `/api/assessments/${a.id}/questions`, {
    token: tokens.teacher,
    body: { type: 'true_false', text: 'Sky is blue', options: ['True', 'False'], answer: true, points: 1 },
  });
  const upd = await call('PUT', `/api/assessment-questions/${tf.body.id}`, { token: tokens.teacher, body: { answer: false } });
  assert.equal(upd.body.answer, false);

  assert.equal((await call('PUT', `/api/assessment-questions/${tf.body.id}`, { token: tokens.otherTeacher, body: { answer: true } })).status, 403);

  const settings = await call('PUT', `/api/assessments/${a.id}`, { token: tokens.teacher, body: { passMark: 80, leaderboard: true } });
  assert.equal(settings.body.passMark, 80);
  assert.equal(settings.body.questions.length, 2);

  const published = await call('PUT', `/api/lessons/${lesson.body.id}`, { token: tokens.teacher, body: { status: 'published' } });
  assert.equal(published.body.status, 'published');

  assert.equal((await call('DELETE', `/api/lessons/${lesson.body.id}`, { token: tokens.teacher })).status, 204);
  assert.equal((await call('GET', `/api/assessments/${a.id}`, { token: tokens.teacher })).status, 404);
});

test('schedules: future publish shows as scheduled, clearing returns to draft', async () => {
  const future = new Date(Date.now() + 7 * 864e5).toISOString();
  const put = await call('PUT', '/api/schedules/108', { token: tokens.teacher, body: { publishAt: future, deadlineAt: null, notifyEmail: true } });
  assert.equal(put.body.status, 'scheduled');
  assert.ok(put.body.releaseDate);

  const hidden = await call('GET', '/api/lessons/108', { token: tokens.student });
  assert.equal(hidden.status, 404, 'scheduled lessons stay hidden from students');

  const cleared = await call('DELETE', '/api/schedules/108', { token: tokens.teacher });
  assert.equal(cleared.body.status, 'draft');
  assert.equal(cleared.body.releaseDate, null);
});

test('quizzes and quiz cards', async () => {
  const studentList = await call('GET', '/api/quizzes', { token: tokens.student });
  assert.deepEqual(studentList.body.map((q) => q.id).sort(), [1, 2]);
  assert.equal(studentList.body.find((q) => q.id === 1).cards.length, 8);

  const created = await call('POST', '/api/quizzes', { token: tokens.teacher, body: { title: 'API Quiz', classId: 1, afterLessonId: 8 } });
  assert.equal(created.status, 201);
  assert.equal(created.body.status, 'draft');
  assert.equal(created.body.afterLessonTitle, 'Plants & Photosynthesis');

  const badAfter = await call('POST', '/api/quizzes', { token: tokens.teacher, body: { title: 'x', classId: 1, afterLessonId: 21 } });
  assert.equal(badAfter.status, 400, 'after-lesson must be in the same class');

  const card = await call('POST', '/api/quiz-cards', { token: tokens.teacher, body: { quizId: created.body.id, front: '', back: '', hint: '' } });
  await call('PUT', `/api/quiz-cards/${card.body.id}`, { token: tokens.teacher, body: { front: 'Q', back: 'A' } });
  const cards = await call('GET', `/api/quiz-cards?quizId=${created.body.id}`, { token: tokens.teacher });
  assert.equal(cards.body[0].front, 'Q');

  const draftForStudent = await call('GET', `/api/quizzes/${created.body.id}`, { token: tokens.student });
  assert.equal(draftForStudent.status, 404);

  const pub = await call('PUT', `/api/quizzes/${created.body.id}`, { token: tokens.teacher, body: { status: 'published' } });
  assert.equal(pub.body.cardCount, 1);
  assert.equal((await call('DELETE', `/api/quizzes/${created.body.id}`, { token: tokens.teacher })).status, 204);
});

test('flash card library and study progress are private to the student', async () => {
  const add = await call('POST', '/api/flashcard-library', {
    token: tokens.student,
    body: { studentId: 1, flashcardId: 1, subject: 'Science', front: 'tampered', back: 'x', hint: '' },
  });
  assert.equal(add.body.front, 'What pumps blood around your body?', 'text is copied from the real card');
  const again = await call('POST', '/api/flashcard-library', { token: tokens.student, body: { studentId: 1, flashcardId: 1 } });
  assert.equal(again.body.id, add.body.id, 'saving twice is idempotent');

  assert.equal((await call('GET', '/api/flashcard-library?studentId=6', { token: tokens.student })).status, 403);
  assert.equal((await call('GET', '/api/flashcard-library?studentId=1', { token: tokens.teacher })).status, 403);

  const list = await call('GET', '/api/flashcard-library?studentId=1', { token: tokens.student });
  assert.ok(list.body.some((e) => e.id === add.body.id));
  assert.equal((await call('DELETE', `/api/flashcard-library/${add.body.id}`, { token: tokens.student })).status, 204);

  const p1 = await call('POST', '/api/flashcard-progress', { token: tokens.student, body: { studentId: 1, deckKey: 'lesson-18', cardId: 2, status: 'known', correctStreak: 1 } });
  assert.equal(p1.body.status, 'known');
  const p2 = await call('POST', '/api/flashcard-progress', { token: tokens.student, body: { studentId: 1, deckKey: 'lesson-18', cardId: 2, starred: true } });
  assert.equal(p2.body.status, 'known');
  assert.equal(p2.body.starred, true);
  const rows = await call('GET', '/api/flashcard-progress?studentId=1&deckKey=lesson-18', { token: tokens.student });
  assert.equal(rows.body.filter((r) => r.cardId === 2).length, 1, 'upsert keeps one row per card');
});

test('classes: ownership and admin-only force-open', async () => {
  const forbidden = await call('PUT', '/api/classes/1', { token: tokens.otherTeacher, body: { name: 'Hijack' } });
  assert.equal(forbidden.status, 403);

  const teacherForce = await call('PUT', '/api/classes/1', { token: tokens.teacher, body: { forcedOpenTerm: 2 } });
  assert.equal(teacherForce.status, 403);

  const created = await call('POST', '/api/classes', {
    token: tokens.teacher,
    body: { name: 'API Open Class', subject: 'Mathematics', level: 'P4', type: 'extra', slots: 12, coTeachers: ['Mr Alif Ibrahim'], terms: [3, 4] },
  });
  assert.equal(created.status, 201);
  assert.deepEqual(created.body.terms, [3, 4]);
  assert.equal(created.body.slots, 12);

  // Students can browse open classes they are not enrolled in.
  const studentClasses = await call('GET', '/api/classes', { token: tokens.student });
  assert.ok(studentClasses.body.some((c) => c.id === created.body.id));

  const archived = await call('PUT', `/api/classes/${created.body.id}`, { token: tokens.teacher, body: { status: 'archived' } });
  assert.equal(archived.body.status, 'archived');
  const forced = await call('PUT', `/api/classes/${created.body.id}`, { token: tokens.admin, body: { forcedOpenTerm: 3 } });
  assert.equal(forced.body.forcedOpenTerm, 3);

  assert.equal((await call('DELETE', `/api/classes/${created.body.id}`, { token: tokens.teacher })).status, 204);
});

test('admin creates users who must change their credential on first login', async () => {
  const list = await call('GET', '/api/users', { token: tokens.admin });
  assert.ok(list.body.length >= 18);
  assert.equal(list.body.find((u) => u.id === 1).parentId, 2);

  const kid = await call('POST', '/api/users', {
    token: tokens.admin,
    body: { name: 'Test Kid', role: 'student', username: 'test_kid_api', pin: '4321', parentId: 2 },
  });
  assert.equal(kid.status, 201);
  assert.equal(kid.body.mustChangeCredential, true);
  assert.equal(kid.body.parentId, 2);

  const dup = await call('POST', '/api/users', { token: tokens.admin, body: { name: 'Dup', role: 'student', username: 'test_kid_api', pin: '1111' } });
  assert.equal(dup.status, 409);
  const badPin = await call('POST', '/api/users', { token: tokens.admin, body: { name: 'Bad', role: 'student', username: 'x_bad', pin: '12' } });
  assert.equal(badPin.status, 400);

  const first = await login('test_kid_api', '4321');
  assert.equal(first.user.mustChangeCredential, true);
  const weak = await call('POST', '/api/auth/change-credential', { token: first.token, body: { newCredential: 'abcd' } });
  assert.equal(weak.status, 400);
  const changed = await call('POST', '/api/auth/change-credential', { token: first.token, body: { newCredential: '9876' } });
  assert.equal(changed.body.user.mustChangeCredential, false);
  assert.equal((await call('POST', '/api/auth/login', { body: { identifier: 'test_kid_api', password: '4321' } })).status, 401);
  await login('test_kid_api', '9876');

  const teacher = await call('POST', '/api/users', {
    token: tokens.admin,
    body: { name: 'Ms Test Teacher', role: 'teacher', email: 'test_teacher_api@neurobix.com', password: 'temp123' },
  });
  const reset = await call('POST', `/api/users/${teacher.body.id}/reset-credential`, { token: tokens.admin, body: { tempPassword: 'newtemp1' } });
  assert.equal(reset.body.mustChangeCredential, true);
  await login('test_teacher_api@neurobix.com', 'newtemp1');
});

test('parent manages their own children only', async () => {
  const kids = await call('GET', '/api/parent/children', { token: tokens.parent });
  const usernames = kids.body.map((k) => k.username);
  assert.ok(usernames.includes('ahmad2026') && usernames.includes('aisyah2026'));
  assert.ok(!usernames.includes('nadia2026'), 'only linked children are listed');
  assert.deepEqual(kids.body.find((k) => k.id === 1).classes.map((c) => c.id).sort(), [1, 2]);

  const added = await call('POST', '/api/parent/children', { token: tokens.parent, body: { name: 'Test Kid Two', username: 'test_kid_parent', pin: '2468' } });
  assert.equal(added.status, 201);
  const taken = await call('POST', '/api/parent/children', { token: tokens.parent, body: { name: 'X', username: 'ahmad2026', pin: '2468' } });
  assert.equal(taken.status, 409);

  const resetOwn = await call('POST', '/api/parent/children/reset-pin', { token: tokens.parent, body: { username: 'test_kid_parent', pin: '1357' } });
  assert.equal(resetOwn.status, 200);
  await login('test_kid_parent', '1357');

  const resetOther = await call('POST', '/api/parent/children/reset-pin', { token: tokens.parent, body: { username: 'nadia2026', pin: '1357' } });
  assert.equal(resetOther.status, 404, "cannot reset someone else's child");
});

test('forgot password never locks the real owner out', async () => {
  const res = await call('POST', '/api/auth/forgot-password', { body: { email: 'parent1@neurobix.com' } });
  assert.equal(res.status, 200);
  assert.equal(res.body.tempPassword, undefined, 'temp password is never returned by the API');
  const unknown = await call('POST', '/api/auth/forgot-password', { body: { email: 'nobody@example.com' } });
  assert.deepEqual(unknown.body, res.body, 'same answer whether or not the account exists');

  // The original password still works after a reset request.
  tokens.parent = (await login('parent1@neurobix.com', 'password123')).token;
});

test('single active session per account', async () => {
  const fresh = await login('alif@neurobix.com', 'password123');
  const old = await call('GET', '/api/classes', { token: tokens.otherTeacher });
  assert.equal(old.status, 401);
  assert.equal(old.body.code, 'SESSION_REPLACED');
  assert.equal((await call('GET', '/api/classes', { token: fresh.token })).status, 200);
});
