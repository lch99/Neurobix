'use strict';

// Demo data for the real database — mirrors the sample data the GitHub Pages build serves
// from client/src/data/mockDb.js, with the same ids where the client relies on them:
//   • users 1–4 are the demo logins (Ahmad is student id 1, which ParentDashboard expects)
//   • lesson ids 7/8/18/19/20/21 match the curated curriculum in client/src/data/lessons.js
//
// Logins (all created active, no forced credential change):
//   student  ahmad2026 / PIN 1234        parent  parent1@neurobix.com / password123
//   teacher  sarah.tan@neurobix.com / password123
//   admin    admin@neurobix.com / password123
// Every other demo student uses PIN 1234.

const bcrypt = require('bcrypt');

const SOLID_PARTICLES_SVG = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="160" viewBox="0 0 220 160">
    <rect width="220" height="160" rx="12" fill="#F0FDF4"/>
    ${Array.from({ length: 4 }).flatMap((_, r) =>
      Array.from({ length: 5 }).map((_, c) =>
        `<circle cx="${30 + c * 40}" cy="${30 + r * 32}" r="9" fill="#36913F"/>`
      )
    ).join('')}
  </svg>`
);

// Singapore time for authored dates.
const sgt = (s) => (s ? new Date(s.length === 10 ? `${s}T23:59:00+08:00` : `${s}:00+08:00`) : null);

const TABLES_IN_DELETE_ORDER = [
  'flashcard_progress', 'flashcard_library', 'quiz_cards', 'quizzes',
  'assessment_attempts', 'assessment_questions', 'assessments',
  'flashcards', 'schedules', 'lesson_progress', 'lessons',
  'class_enrollments', 'classes', 'terms', 'parent_students', 'users',
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const stamp = { created_at: now, updated_at: now };
    const [staffHash, pinHash] = await Promise.all([
      bcrypt.hash('password123', 10),
      bcrypt.hash('1234', 10),
    ]);

    // ── Users ──────────────────────────────────────────────────────────────────
    const student = (id, name, username, level, email) => ({
      id, role: 'student', name, username, email, level, password_hash: pinHash, status: 'active', ...stamp,
    });
    const staff = (id, role, name, email) => ({
      id, role, name, email, username: null, level: null, password_hash: staffHash, status: 'active', ...stamp,
    });

    await queryInterface.bulkInsert('users', [
      student(1, 'Ahmad bin Hassan', 'ahmad2026', 'P4', 'ahmad@student.neurobix.com'),
      staff(2, 'parent', 'Hassan bin Idris', 'parent1@neurobix.com'),
      staff(3, 'teacher', 'Ms Sarah Tan', 'sarah.tan@neurobix.com'),
      staff(4, 'admin', 'Admin User', 'admin@neurobix.com'),
      staff(5, 'teacher', 'Mr Alif Ibrahim', 'alif@neurobix.com'),
      student(6, 'Nadia Putri', 'nadia2026', 'P4', 'nadia@student.neurobix.com'),
      student(7, 'Farid bin Ismail', 'farid2026', 'P4', 'farid@student.neurobix.com'),
      student(8, 'Siti Nur Aisyah', 'siti2026', 'P4', 'siti@student.neurobix.com'),
      student(9, 'Justin Ng', 'justin2026', 'P4', 'justin@student.neurobix.com'),
      student(10, 'Priya Ramasamy', 'priya2026', 'P4', 'priya@student.neurobix.com'),
      student(11, 'Mei Lin', 'meilin2026', 'P4', 'meilin@student.neurobix.com'),
      student(12, 'Darren Lim', 'darren2026', 'P4', 'darren@student.neurobix.com'),
      student(13, 'Hafizah Binte Omar', 'hafizah2026', 'P4', 'hafizah@student.neurobix.com'),
      student(14, 'Ethan Koh', 'ethan2026', 'P4', 'ethan@student.neurobix.com'),
      student(15, 'Nur Ain', 'nurain2026', 'P5', 'nurain@student.neurobix.com'),
      student(16, 'Samuel Tan', 'samuel2026', 'P5', 'samuel@student.neurobix.com'),
      student(17, 'Aisyah Rahman', 'aisyahr2026', 'P5', 'aisyah@student.neurobix.com'),
      // Second child shown on the demo Parent dashboard.
      student(18, 'Nur Aisyah bte Hassan', 'aisyah2026', 'P2', null),
    ]);

    await queryInterface.bulkInsert('parent_students', [
      { parent_id: 2, student_id: 1, created_at: now },
      { parent_id: 2, student_id: 18, created_at: now },
    ]);

    // ── Terms & classes ──────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('terms', [
      { id: 1, name: 'Term 1', start_date: '2026-01-05', end_date: '2026-03-13', status: 'completed', ...stamp },
      { id: 2, name: 'Term 2', start_date: '2026-03-30', end_date: '2026-06-05', status: 'completed', ...stamp },
      { id: 3, name: 'Term 3', start_date: '2026-06-29', end_date: '2026-09-04', status: 'active', ...stamp },
      { id: 4, name: 'Term 4', start_date: '2026-09-21', end_date: '2026-11-27', status: 'upcoming', ...stamp },
    ]);

    await queryInterface.bulkInsert('classes', [
      { id: 1, name: 'Primary 4A', subject: 'Science', level: 'P4', type: 'regular', teacher_id: 3, term_id: 3, term_ids: JSON.stringify([3]), co_teachers: JSON.stringify([]), leaderboard_enabled: false, status: 'active', ...stamp },
      { id: 2, name: 'Primary 5A', subject: 'Science', level: 'P5', type: 'regular', teacher_id: 3, term_id: 3, term_ids: JSON.stringify([3]), co_teachers: JSON.stringify([]), leaderboard_enabled: false, status: 'active', ...stamp },
    ]);

    const enrol = (id, classId, studentId) => ({ id, class_id: classId, student_id: studentId, enrolled_by: 'admin', status: 'active', enrolled_at: now });
    await queryInterface.bulkInsert('class_enrollments', [
      enrol(1, 1, 1), enrol(2, 1, 6), enrol(3, 1, 7), enrol(4, 1, 8), enrol(5, 1, 9),
      enrol(6, 1, 10), enrol(7, 1, 11), enrol(8, 1, 12), enrol(9, 1, 13), enrol(10, 1, 14),
      enrol(11, 2, 15), enrol(12, 2, 16), enrol(13, 2, 17), enrol(14, 2, 1),
    ]);

    // ── Lessons (+ schedules) ─────────────────────────────────────────────────────
    const lessons = [
      { id: 7, classId: 1, title: 'The Solar System', type: 'video', status: 'published', deadlineAt: '2026-03-14', notifyEmail: true, weekNumber: 1, difficulty: 'Easy', durationMinutes: 18,
        description: 'Journey through the 8 planets! Remember them with the Neurobix mnemonic memory trick.',
        objectives: ['Name all 8 planets in order', 'Know key facts about each planet', 'Use mnemonics to memorise them'],
        memoryTip: '"My Very Educated Mother Just Served Us Nachos" — Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. Say it 3 times fast! 🪐' },
      { id: 8, classId: 1, title: 'Plants & Photosynthesis', type: 'reading', status: 'published', deadlineAt: '2026-03-28', notifyEmail: false, weekNumber: 2, difficulty: 'Medium', durationMinutes: 14,
        description: "Discover how plants turn sunlight into food — nature's own factory!",
        readingSections: [
          { heading: 'What is Photosynthesis?', body: 'Plants make their own food using sunlight, water and carbon dioxide. This process is called photosynthesis — it happens mostly in the leaves.' },
          { heading: 'Why It Matters', body: "Photosynthesis also releases oxygen — the very air we breathe! Without plants doing this every day, animals (including us) couldn't survive." },
        ] },
      { id: 18, classId: 1, title: 'The Human Body', type: 'flashcard', status: 'published', deadlineAt: '2026-05-25', notifyEmail: true, weekNumber: 3, difficulty: 'Medium', durationMinutes: 16,
        description: 'Learn the major organs and their functions with labelled flash cards.',
        objectives: ['Name the major organs', 'Describe what each organ does', 'Recall organ facts in under 5 seconds'],
        memoryTip: 'Picture a "factory" inside your body — the heart is the pump room, the lungs are the air vents, the brain is the control room!' },
      { id: 19, classId: 1, title: 'Forces & Motion', type: 'video', status: 'draft', publishAt: '2026-06-30T09:00', deadlineAt: '2026-07-15', notifyEmail: true, weekNumber: 4, difficulty: 'Medium', durationMinutes: 15,
        description: 'Push, pull, gravity — understand forces through fun experiments!' },
      { id: 5, classId: 1, title: 'States of Matter', type: 'assessment', status: 'draft', weekNumber: 5, difficulty: 'Easy', durationMinutes: 12,
        description: 'Solid, liquid, gas — a shorter warm-up set on how matter changes state.' },
      { id: 21, classId: 2, title: 'Food Chains & Ecosystems', type: 'activity', status: 'published', weekNumber: 1, difficulty: 'Hard', durationMinutes: 20,
        description: 'Build your own food chain and understand how ecosystems balance.' },
      { id: 20, classId: 2, title: 'States of Matter', type: 'assessment', status: 'published', deadlineAt: '2026-05-20', notifyEmail: true, weekNumber: 2, difficulty: 'Easy', durationMinutes: 12,
        description: 'Solid, liquid, gas — test yourself on how matter changes state.',
        objectives: ['Identify the three states of matter', 'Explain melting, freezing and boiling', 'Give real-life examples of each state'],
        memoryTip: 'Solid = "stuck together and still". Liquid = "loose and flowing". Gas = "gone and spread out"! Say it out loud to lock it in.' },
      { id: 108, classId: 2, title: 'The Human Body', type: 'reading', status: 'draft', weekNumber: 3, difficulty: 'Medium', durationMinutes: 16,
        description: "Read about the body's major organs and systems." },
      { id: 109, classId: 2, title: 'Forces & Motion', type: 'flashcard', status: 'draft', publishAt: '2026-07-01T08:00', deadlineAt: '2026-07-30', notifyEmail: true, weekNumber: 4, difficulty: 'Medium', durationMinutes: 15,
        description: 'Learn force & motion facts with flash cards.' },
      { id: 10, classId: 2, title: 'Plants & Photosynthesis', type: 'video', status: 'published', deadlineAt: '2026-07-15', notifyEmail: true, weekNumber: 5, difficulty: 'Medium', durationMinutes: 14,
        description: "Discover how plants turn sunlight into food — nature's own factory!" },
    ];

    await queryInterface.bulkInsert('lessons', lessons.map((l) => ({
      id: l.id,
      class_id: l.classId,
      title: l.title,
      type: l.type,
      sequence_order: l.weekNumber,
      week_number: l.weekNumber,
      difficulty: l.difficulty,
      duration_minutes: l.durationMinutes,
      description: l.description,
      objectives: l.objectives ? JSON.stringify(l.objectives) : null,
      memory_tip: l.memoryTip || null,
      reading_sections: l.readingSections ? JSON.stringify(l.readingSections) : null,
      status: l.status,
      ...stamp,
    })));

    await queryInterface.bulkInsert('schedules', lessons
      .filter((l) => l.publishAt || l.deadlineAt)
      .map((l) => ({
        lesson_id: l.id,
        class_id: l.classId,
        publish_at: sgt(l.publishAt),
        deadline_at: sgt(l.deadlineAt),
        notify_email: !!l.notifyEmail,
        ...stamp,
      })));

    // ── Flash cards ────────────────────────────────────────────────────────────────
    const card = (id, lessonId, order, front, back, hint) => ({
      id, lesson_id: lessonId, front_text: front, back_text: back, hint, sequence_order: order, ...stamp,
    });
    await queryInterface.bulkInsert('flashcards', [
      card(1, 18, 0, 'What pumps blood around your body?', 'Heart', 'It beats about 100,000 times a day!'),
      card(2, 18, 1, 'What organ helps you breathe?', 'Lungs', 'You have two of them!'),
      card(3, 18, 2, "What organ is your body's control room?", 'Brain', 'It sends signals through your nerves.'),
      card(4, 18, 3, 'What organ filters your blood?', 'Kidneys', 'You have a pair of these too.'),
      card(5, 18, 4, 'What organ digests your food?', 'Stomach', 'It uses acid to break down food.'),
      card(6, 109, 0, 'What force pulls objects toward Earth?', 'Gravity', 'It keeps your feet on the ground!'),
      card(7, 109, 1, 'A push or a pull is called a…', 'Force', 'It can make things move, stop or change direction.'),
      card(8, 109, 2, 'What force slows down a sliding object?', 'Friction', 'Rougher surfaces make more of it!'),
      card(9, 109, 3, 'What happens to a ball when you push it?', 'It moves in the direction of the push', "Newton's first law!"),
    ]);

    // ── Assessments ────────────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('assessments', [
      { id: 1, lesson_id: 5, title: 'States of Matter', pass_mark: 70, reward_points: 50, leaderboard_enabled: true, is_past_year_paper: false, ...stamp },
      { id: 2, lesson_id: 20, title: 'States of Matter', pass_mark: 70, reward_points: 50, leaderboard_enabled: true, is_past_year_paper: false, ...stamp },
    ]);

    const q = (id, assessmentId, order, type, text, options, answer, points, imageUrl = null) => ({
      id,
      assessment_id: assessmentId,
      type,
      question_text: text,
      question_image_url: imageUrl,
      options: options === null ? null : JSON.stringify(options),
      correct_answer: answer === null ? null : JSON.stringify(answer),
      points,
      sequence_order: order,
      ...stamp,
    });
    await queryInterface.bulkInsert('assessment_questions', [
      q(1, 1, 0, 'mcq', 'What state of matter is ice?', ['Solid', 'Liquid', 'Gas', 'Plasma'], 0, 1),
      q(2, 1, 1, 'mcq', 'What happens when water boils?', ['It freezes', 'It turns to gas', 'It turns to rock', 'Nothing'], 1, 1),
      q(3, 1, 2, 'true_false', 'Water is a gas at room temperature.', ['True', 'False'], false, 1),
      q(4, 1, 3, 'fill_in', 'Solid → Liquid is called ___.', [], 'melting', 2),

      q(5, 2, 0, 'mcq', 'Which of these is a liquid at room temperature?', ['Ice', 'Water', 'Steam', 'Rock'], 1, 1),
      q(10, 2, 1, 'mcq', 'What is it called when a gas turns into a liquid?', ['Melting', 'Condensation', 'Freezing', 'Evaporation'], 1, 1),
      q(11, 2, 2, 'mcq', 'Which state of matter has both a fixed shape and a fixed volume?', ['Solid', 'Liquid', 'Gas', 'None of these'], 0, 1),
      q(6, 2, 3, 'true_false', 'Gas has a fixed shape.', ['True', 'False'], false, 1),
      q(12, 2, 4, 'true_false', 'Ice is an example of a solid.', ['True', 'False'], true, 1),
      q(13, 2, 5, 'true_false', 'Freezing changes a liquid into a gas.', ['True', 'False'], false, 1),
      q(14, 2, 6, 'fill_in', 'Liquid → Gas is called ___.', [], 'evaporation', 2),
      q(15, 2, 7, 'fill_in', 'Gas → Liquid is called ___.', [], 'condensation', 2),
      q(16, 2, 8, 'image', 'Look at the picture — the particles are packed tightly in a fixed pattern. What state of matter is this?', [], 'solid', 2, SOLID_PARTICLES_SVG),
      q(9, 2, 9, 'match', 'Match each process to its description', { pairs: [
        { left: 'Melting', right: 'Solid to liquid' },
        { left: 'Evaporation', right: 'Liquid to gas' },
        { left: 'Condensation', right: 'Gas to liquid' },
      ] }, null, 3),
    ]);

    // ── Quizzes (class-level, ungraded) ──────────────────────────────────────────────
    await queryInterface.bulkInsert('quizzes', [
      { id: 1, class_id: 1, title: 'Space Quick Quiz', status: 'published', after_lesson_id: 7, ...stamp },
      { id: 2, class_id: 2, title: 'Ecosystems Quick Quiz', status: 'published', after_lesson_id: 21, ...stamp },
    ]);

    const qc = (id, quizId, order, front, back, hint = '') => ({
      id, quiz_id: quizId, front_text: front, back_text: back, hint, sequence_order: order, ...stamp,
    });
    await queryInterface.bulkInsert('quiz_cards', [
      qc(1, 1, 0, 'Which planet is closest to the Sun?', 'Mercury', "It's also the smallest planet!"),
      qc(2, 1, 1, 'What galaxy is our Solar System in?', 'The Milky Way'),
      qc(3, 1, 2, 'Which planet is known as the Red Planet?', 'Mars', 'Named after the Roman god of war.'),
      qc(4, 1, 3, 'What force keeps the planets in orbit around the Sun?', 'Gravity'),
      qc(5, 1, 4, 'Which planet has the most famous rings?', 'Saturn'),
      qc(6, 1, 5, 'What do we call a large rock orbiting a planet, like our Moon?', 'A moon (natural satellite)'),
      qc(7, 1, 6, 'Which planet is the largest in the Solar System?', 'Jupiter'),
      qc(8, 1, 7, 'What do we call the path a planet takes around the Sun?', 'An orbit'),
      qc(9, 2, 0, 'What do we call a chain of who-eats-who in nature?', 'A food chain'),
      qc(10, 2, 1, 'What do we call an animal that only eats plants?', 'A herbivore'),
      qc(11, 2, 2, 'What do we call an animal that eats both plants and meat?', 'An omnivore'),
      qc(12, 2, 3, 'What is the main source of energy for almost every food chain?', 'The Sun'),
      qc(13, 2, 4, 'What do we call an animal that only eats other animals?', 'A carnivore'),
      qc(14, 2, 5, 'What do we call all the living and non-living things in an area, working together?', 'An ecosystem'),
      qc(15, 2, 6, 'What do we call living things that make their own food, like plants?', 'Producers'),
      qc(16, 2, 7, 'What do we call several overlapping food chains in one habitat?', 'A food web'),
    ]);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    try {
      for (const table of TABLES_IN_DELETE_ORDER) {
        await queryInterface.bulkDelete(table, null, {});
      }
    } finally {
      await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }
  },
};
