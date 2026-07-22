// In-memory mock database — all backend data lives here for the frontend-only demo build.
// Mutations update these arrays in-memory so CRUD operations work for the session.

import { isCorrectAnswer } from '../components/AssessmentQuestion'

let nextId = 1000
const uid = () => ++nextId

// ─── Seed data ────────────────────────────────────────────────────────────────

let terms = [
  { id: 1, name: 'Term 1', startDate: '2026-01-05', endDate: '2026-03-13', status: 'completed' },
  { id: 2, name: 'Term 2', startDate: '2026-03-30', endDate: '2026-06-05', status: 'completed' },
  { id: 3, name: 'Term 3', startDate: '2026-06-29', endDate: '2026-09-04', status: 'active' },
  { id: 4, name: 'Term 4', startDate: '2026-09-21', endDate: '2026-11-27', status: 'upcoming' },
]

let classes = [
  { id: 1, name: 'Primary 4A', subject: 'Science', level: 'P4', students: 10, lessons: 5, teacherId: 3, termId: 3 },
  { id: 2, name: 'Primary 5A', subject: 'Science', level: 'P5', students: 4,  lessons: 5, teacherId: 3, termId: 3 },
]

// Lesson ids 7/8/18/19/20/21 are shared with the curated student curriculum in
// `data/lessons.js` (ALL_LESSONS) — LessonBrowser/StudentDashboard already link to those
// exact ids, so keeping ids aligned here is what makes a teacher's authored flashcards/
// assessment content actually reachable from the student's normal "My Courses" navigation.
let lessons = [
  { id: 7,  classId: 1, title: 'The Solar System',        type: 'video',      status: 'published', subject: 'Science', cardCount: 0, publishAt: null, deadlineAt: '2026-03-14', notifyEmail: true,  weekNumber: 1, difficulty: 'Easy',   durationMinutes: 18, description: 'Journey through the 8 planets! Remember them with the Neurobix mnemonic memory trick.', objectives: ['Name all 8 planets in order', 'Know key facts about each planet', 'Use mnemonics to memorise them'], memoryTip: '"My Very Educated Mother Just Served Us Nachos" — Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. Say it 3 times fast! 🪐' },
  { id: 8,  classId: 1, title: 'Plants & Photosynthesis',  type: 'reading',    status: 'published', subject: 'Science', cardCount: 0, publishAt: null, deadlineAt: '2026-03-28', notifyEmail: false, weekNumber: 2, difficulty: 'Medium', durationMinutes: 14, description: "Discover how plants turn sunlight into food — nature's own factory!", readingSections: [
      { heading: 'What is Photosynthesis?', body: 'Plants make their own food using sunlight, water and carbon dioxide. This process is called photosynthesis — it happens mostly in the leaves.' },
      { heading: 'Why It Matters', body: 'Photosynthesis also releases oxygen — the very air we breathe! Without plants doing this every day, animals (including us) couldn\'t survive.' },
    ] },
  { id: 5,  classId: 1, title: 'States of Matter',        type: 'assessment', status: 'draft',     subject: 'Science', cardCount: 0, publishAt: null, deadlineAt: null, notifyEmail: false, weekNumber: 5, difficulty: 'Easy', durationMinutes: 12, description: 'Solid, liquid, gas — a shorter warm-up set on how matter changes state.' },
  { id: 19, classId: 1, title: 'Forces & Motion',         type: 'video',      status: 'scheduled', subject: 'Science', cardCount: 0, publishAt: '2026-06-30T09:00', deadlineAt: '2026-07-15', notifyEmail: true, weekNumber: 4, difficulty: 'Medium', durationMinutes: 15, description: 'Push, pull, gravity — understand forces through fun experiments!' },
  { id: 18, classId: 1, title: 'The Human Body',          type: 'flashcard', status: 'published', subject: 'Science', cardCount: 5, publishAt: null, deadlineAt: '2026-05-25', notifyEmail: true,  weekNumber: 3, difficulty: 'Medium', durationMinutes: 16, description: 'Learn the major organs and their functions with labelled flash cards.', objectives: ['Name the major organs', 'Describe what each organ does', 'Recall organ facts in under 5 seconds'], memoryTip: 'Picture a "factory" inside your body — the heart is the pump room, the lungs are the air vents, the brain is the control room!' },
  { id: 21, classId: 2, title: 'Food Chains & Ecosystems', type: 'activity',  status: 'published', subject: 'Science', cardCount: 0, publishAt: null, deadlineAt: null, notifyEmail: false, weekNumber: 1, difficulty: 'Hard', durationMinutes: 20, description: 'Build your own food chain and understand how ecosystems balance.' },
  { id: 20, classId: 2, title: 'States of Matter',        type: 'assessment', status: 'published', subject: 'Science', cardCount: 0, publishAt: null, deadlineAt: '2026-05-20', notifyEmail: true,  weekNumber: 2, difficulty: 'Easy', durationMinutes: 12, description: 'Solid, liquid, gas — test yourself on how matter changes state.', objectives: ['Identify the three states of matter', 'Explain melting, freezing and boiling', 'Give real-life examples of each state'], memoryTip: 'Solid = "stuck together and still". Liquid = "loose and flowing". Gas = "gone and spread out"! Say it out loud to lock it in.' },
  { id: 108, classId: 2, title: 'The Human Body',         type: 'reading',   status: 'draft',     subject: 'Science', cardCount: 0, publishAt: null, deadlineAt: null, notifyEmail: false, weekNumber: 3, difficulty: 'Medium', durationMinutes: 16, description: "Read about the body's major organs and systems." },
  { id: 109, classId: 2, title: 'Forces & Motion',        type: 'flashcard', status: 'scheduled', subject: 'Science', cardCount: 4, publishAt: '2026-07-01T08:00', deadlineAt: '2026-07-30', notifyEmail: true, weekNumber: 4, difficulty: 'Medium', durationMinutes: 15, description: 'Learn force & motion facts with flash cards.' },
  { id: 10, classId: 2, title: 'Plants & Photosynthesis', type: 'video',     status: 'published', subject: 'Science', cardCount: 0, publishAt: null, deadlineAt: '2026-07-15', notifyEmail: true,  weekNumber: 5, difficulty: 'Medium', durationMinutes: 14, description: "Discover how plants turn sunlight into food — nature's own factory!" },
]

let flashcards = [
  { id: 1, lessonId: 18, front: 'What pumps blood around your body?', back: 'Heart',   hint: 'It beats about 100,000 times a day!' },
  { id: 2, lessonId: 18, front: 'What organ helps you breathe?',      back: 'Lungs',   hint: 'You have two of them!'               },
  { id: 3, lessonId: 18, front: "What organ is your body's control room?", back: 'Brain', hint: 'It sends signals through your nerves.' },
  { id: 4, lessonId: 18, front: 'What organ filters your blood?',     back: 'Kidneys', hint: 'You have a pair of these too.'       },
  { id: 5, lessonId: 18, front: 'What organ digests your food?',      back: 'Stomach', hint: 'It uses acid to break down food.'    },
  { id: 6, lessonId: 109, front: 'What force pulls objects toward Earth?', back: 'Gravity', hint: 'It keeps your feet on the ground!' },
  { id: 7, lessonId: 109, front: 'A push or a pull is called a…',      back: 'Force',   hint: 'It can make things move, stop or change direction.' },
  { id: 8, lessonId: 109, front: 'What force slows down a sliding object?', back: 'Friction', hint: 'Rougher surfaces make more of it!' },
  { id: 9, lessonId: 109, front: 'What happens to a ball when you push it?', back: 'It moves in the direction of the push', hint: 'Newton\'s first law!' },
]

// Simple inline SVG (no external asset/network dependency) for the one "image-based"
// assessment question below — a grid of tightly-packed particles representing a solid.
const SOLID_PARTICLES_SVG = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="160" viewBox="0 0 220 160">
    <rect width="220" height="160" rx="12" fill="#F0FDF4"/>
    ${Array.from({ length: 4 }).flatMap((_, r) =>
      Array.from({ length: 5 }).map((_, c) =>
        `<circle cx="${30 + c * 40}" cy="${30 + r * 32}" r="9" fill="#36913F"/>`
      )
    ).join('')}
  </svg>`
)

// Each assessment belongs to exactly one lesson (of type 'assessment') — there is no
// assessment-taking flow outside of opening that lesson. Title/class/subject/status are
// derived by joining lessonId, mirroring the real backend's Assessment→Lesson relation.
let assessments = [
  {
    id: 1, lessonId: 5, passMark: 70, rewardPoints: 50, leaderboardEnabled: true, isPastYearPaper: false,
    questions: [
      { id: 1, assessmentId: 1, type: 'mcq',       text: 'What state of matter is ice?',   options: ['Solid','Liquid','Gas','Plasma'],   answer: 0, points: 1 },
      { id: 2, assessmentId: 1, type: 'mcq',       text: 'What happens when water boils?', options: ['It freezes','It turns to gas','It turns to rock','Nothing'], answer: 1, points: 1 },
      { id: 3, assessmentId: 1, type: 'true_false', text: 'Water is a gas at room temperature.', options: ['True','False'], answer: false, points: 1 },
      { id: 4, assessmentId: 1, type: 'fill_in',   text: 'Solid → Liquid is called ___.',  options: [],                                  answer: 'melting', points: 2 },
    ],
  },
  {
    id: 2, lessonId: 20, passMark: 70, rewardPoints: 50, leaderboardEnabled: true, isPastYearPaper: false,
    questions: [
      { id: 5,  assessmentId: 2, type: 'mcq',        text: 'Which of these is a liquid at room temperature?', options: ['Ice','Water','Steam','Rock'], answer: 1, points: 1 },
      { id: 10, assessmentId: 2, type: 'mcq',        text: 'What is it called when a gas turns into a liquid?', options: ['Melting','Condensation','Freezing','Evaporation'], answer: 1, points: 1 },
      { id: 11, assessmentId: 2, type: 'mcq',        text: 'Which state of matter has both a fixed shape and a fixed volume?', options: ['Solid','Liquid','Gas','None of these'], answer: 0, points: 1 },
      { id: 6,  assessmentId: 2, type: 'true_false', text: 'Gas has a fixed shape.', options: ['True','False'], answer: false, points: 1 },
      { id: 12, assessmentId: 2, type: 'true_false', text: 'Ice is an example of a solid.', options: ['True','False'], answer: true, points: 1 },
      { id: 13, assessmentId: 2, type: 'true_false', text: 'Freezing changes a liquid into a gas.', options: ['True','False'], answer: false, points: 1 },
      { id: 14, assessmentId: 2, type: 'fill_in',    text: 'Liquid → Gas is called ___.',  options: [], answer: 'evaporation', points: 2 },
      { id: 15, assessmentId: 2, type: 'fill_in',    text: 'Gas → Liquid is called ___.',   options: [], answer: 'condensation', points: 2 },
      { id: 16, assessmentId: 2, type: 'image',      text: 'Look at the picture — the particles are packed tightly in a fixed pattern. What state of matter is this?', imageUrl: SOLID_PARTICLES_SVG, options: [], answer: 'solid', points: 2 },
      { id: 9,  assessmentId: 2, type: 'match',      text: 'Match each process to its description', options: { pairs: [
          { left: 'Melting', right: 'Solid to liquid' }, { left: 'Evaporation', right: 'Liquid to gas' }, { left: 'Condensation', right: 'Gas to liquid' },
        ] }, answer: null, points: 3 },
    ],
  },
]

// A student's completed run of an assessment — score/points are computed from the
// assessment's own stored `answer`/`points` per question, never trusted from the client.
let assessmentAttempts = []

// A Quiz is NOT scoped to a lesson — it belongs directly to a Class and sits "between"
// two lessons via afterLessonId, for a quick informal check. Cards are front/back, same
// shape as flashcards, so the taking experience is the exact same Quizlet-style StudySet
// (Flashcards/Learn/Test/Match) already used for flashcard decks — Test mode there is
// self-practice only (never submitted/graded), which is exactly the "ungraded, no
// points/certs/leaderboard" behaviour a quiz needs. This is a deliberate distinction from
// Assessment (which was literally renamed from "quiz" earlier in the SRS) — see
// project_assessments_nav_shortcut memory for that history.
let quizzes = [
  {
    id: 1, classId: 1, title: 'Space Quick Quiz', status: 'published', afterLessonId: 7,
    cards: [
      { id: 1, quizId: 1, front: 'Which planet is closest to the Sun?', back: 'Mercury', hint: "It's also the smallest planet!" },
      { id: 2, quizId: 1, front: 'What galaxy is our Solar System in?', back: 'The Milky Way', hint: '' },
    ],
  },
  {
    id: 2, classId: 2, title: 'Ecosystems Quick Quiz', status: 'published', afterLessonId: 21,
    cards: [
      { id: 3, quizId: 2, front: 'What do we call a chain of who-eats-who in nature?', back: 'A food chain', hint: '' },
    ],
  },
]

function serializeQuiz(q) {
  const cls = classes.find(c => c.id === q.classId)
  const afterLesson = q.afterLessonId ? lessons.find(l => l.id === q.afterLessonId) : null
  return {
    id: q.id,
    classId: q.classId,
    className: cls?.name ?? null,
    subject: cls?.subject ?? null,
    title: q.title,
    status: q.status,
    afterLessonId: q.afterLessonId ?? null,
    afterLessonTitle: afterLesson?.title ?? null,
    cardCount: q.cards.length,
    cards: q.cards,
  }
}

function serializeAssessment(a) {
  const lesson = lessons.find(l => l.id === a.lessonId)
  return {
    id: a.id,
    lessonId: a.lessonId,
    title: lesson?.title || 'Assessment',
    classId: lesson?.classId ?? null,
    className: classes.find(c => c.id === lesson?.classId)?.name ?? null,
    subject: lesson?.subject ?? null,
    status: lesson?.status || 'draft',
    passMark: a.passMark,
    rewardPoints: a.rewardPoints,
    leaderboard: a.leaderboardEnabled,
    isPastYearPaper: a.isPastYearPaper,
    questions: a.questions,
  }
}

const TEACHER_NAMES = { 3: 'Ms Sarah Tan' }

// Non-assessment lessons don't have an authored reward value anywhere yet, so points are
// derived from something real on the lesson (duration/card count) rather than invented per-id.
function computeLessonPoints(lesson, assessmentRewardPoints) {
  if (lesson.type === 'assessment') return assessmentRewardPoints ?? 30
  if (lesson.type === 'flashcard') return Math.max(20, (lesson.cardCount || 0) * 8)
  return Math.max(20, (lesson.durationMinutes || 10) * 2)
}

function serializeLessonDetail(lesson) {
  const cls = classes.find(c => c.id === lesson.classId)
  const assessment = lesson.type === 'assessment' ? assessments.find(a => a.lessonId === lesson.id) : null
  return {
    ...lesson,
    className: cls?.name ?? null,
    teacherName: TEACHER_NAMES[cls?.teacherId] || 'Teacher',
    points: computeLessonPoints(lesson, assessment?.rewardPoints),
  }
}

let schedules = lessons.map(l => ({ ...l }))

let badges = [
  { id: 1, icon: '⭐', name: 'Star Learner',   description: 'Complete your first lesson',        criteriaType: 'lessons_completed', criteriaValue: 1    },
  { id: 2, icon: '🏆', name: 'Assessment Champ', description: 'Score a perfect mark on any assessment', criteriaType: 'perfect_score',      criteriaValue: 1    },
  { id: 3, icon: '🔥', name: '7-Day Streak',   description: 'Complete an activity 7 days running', criteriaType: 'streak_days',       criteriaValue: 7    },
  { id: 4, icon: '🧠', name: 'Memory Master',  description: 'Earn 1,000 total points',            criteriaType: 'points_total',       criteriaValue: 1000 },
  { id: 5, icon: '📚', name: 'Bookworm',       description: 'Complete 20 lessons',                criteriaType: 'lessons_completed',  criteriaValue: 20   },
  { id: 6, icon: '🚀', name: 'Fast Finisher',  description: 'Complete 5 assessments',             criteriaType: 'assessments_completed', criteriaValue: 5 },
]

let students = [
  { enrollmentId: 1,  studentId: 1,  classId: 1, name: 'Ahmad bin Hassan',   email: 'ahmad@student.neurobix.com'   },
  { enrollmentId: 2,  studentId: 2,  classId: 1, name: 'Nadia Putri',        email: 'nadia@student.neurobix.com'   },
  { enrollmentId: 3,  studentId: 3,  classId: 1, name: 'Farid bin Ismail',   email: 'farid@student.neurobix.com'   },
  { enrollmentId: 4,  studentId: 4,  classId: 1, name: 'Siti Nur Aisyah',    email: 'siti@student.neurobix.com'    },
  { enrollmentId: 5,  studentId: 5,  classId: 1, name: 'Justin Ng',          email: 'justin@student.neurobix.com'  },
  { enrollmentId: 6,  studentId: 6,  classId: 1, name: 'Priya Ramasamy',     email: 'priya@student.neurobix.com'   },
  { enrollmentId: 7,  studentId: 7,  classId: 1, name: 'Mei Lin',            email: 'meilin@student.neurobix.com'  },
  { enrollmentId: 8,  studentId: 8,  classId: 1, name: 'Darren Lim',         email: 'darren@student.neurobix.com'  },
  { enrollmentId: 9,  studentId: 9,  classId: 1, name: 'Hafizah Binte Omar', email: 'hafizah@student.neurobix.com' },
  { enrollmentId: 10, studentId: 10, classId: 1, name: 'Ethan Koh',          email: 'ethan@student.neurobix.com'   },
  { enrollmentId: 11, studentId: 11, classId: 2, name: 'Nur Ain',            email: 'nurain@student.neurobix.com'  },
  { enrollmentId: 12, studentId: 12, classId: 2, name: 'Samuel Tan',         email: 'samuel@student.neurobix.com'  },
  { enrollmentId: 13, studentId: 13, classId: 2, name: 'Aisyah Rahman',      email: 'aisyah@student.neurobix.com'  },
  { enrollmentId: 14, studentId: 1,  classId: 2, name: 'Ahmad bin Hassan',   email: 'ahmad@student.neurobix.com'   },
]

// A student's personal "saved cards" library — persisted to localStorage (same pattern as
// RUNTIME_USERS below) so it survives a page reload, since this is a frontend-only mock.
const FLASHCARD_LIBRARY_KEY = 'nb_flashcard_library'

let flashcardLibrary = (() => {
  try { return JSON.parse(localStorage.getItem(FLASHCARD_LIBRARY_KEY)) || [] } catch { return [] }
})()

function persistFlashcardLibrary() {
  localStorage.setItem(FLASHCARD_LIBRARY_KEY, JSON.stringify(flashcardLibrary))
}

// Per-student, per-card study progress (starred/known status, correct streak) used by
// Study Set's Flashcards/Learn modes — one row per (studentId, cardId), upserted.
const FLASHCARD_PROGRESS_KEY = 'nb_flashcard_progress'

let flashcardProgress = (() => {
  try { return JSON.parse(localStorage.getItem(FLASHCARD_PROGRESS_KEY)) || [] } catch { return [] }
})()

function persistFlashcardProgress() {
  localStorage.setItem(FLASHCARD_PROGRESS_KEY, JSON.stringify(flashcardProgress))
}

// ─── Router ───────────────────────────────────────────────────────────────────

export async function mockApiRequest(path, { method = 'GET', body } = {}) {
  await new Promise(r => setTimeout(r, 120))

  // Health check
  if (path === '/api/health') return { status: 'ok' }

  // ── Auth ──────────────────────────────────────────────────────────────────
  if (path === '/api/auth/login') {
    const match = findAuthRecord(body?.identifier)
    if (!match || match.password !== body?.password) throw new Error('Invalid email or password.')
    return { token: 'demo_' + match.user.role + '_token', user: match.user }
  }
  if (path === '/api/auth/logout') return null

  // ── Terms ─────────────────────────────────────────────────────────────────
  if (path === '/api/terms') {
    if (method === 'GET')  return [...terms]
    if (method === 'POST') {
      const created = { id: uid(), status: 'upcoming', ...body }
      terms.push(created)
      return created
    }
  }
  const termMatch = path.match(/^\/api\/terms\/(\d+)$/)
  if (termMatch) {
    const id = Number(termMatch[1])
    if (method === 'PUT') {
      terms = terms.map(t => t.id === id ? { ...t, ...body } : t)
      return terms.find(t => t.id === id)
    }
    if (method === 'DELETE') {
      terms = terms.filter(t => t.id !== id)
      classes = classes.map(c => c.termId === id ? { ...c, termId: null } : c)
      return null
    }
  }

  // ── Classes ───────────────────────────────────────────────────────────────
  if (path === '/api/classes') {
    if (method === 'GET')  return [...classes]
    if (method === 'POST') {
      const created = { id: uid(), students: 0, lessons: 0, termId: null, ...body }
      classes.push(created)
      return created
    }
  }
  const classMatch = path.match(/^\/api\/classes\/(\d+)$/)
  if (classMatch) {
    const id = Number(classMatch[1])
    if (method === 'PUT') {
      classes = classes.map(c => c.id === id ? { ...c, ...body } : c)
      return classes.find(c => c.id === id)
    }
    if (method === 'DELETE') {
      classes = classes.filter(c => c.id !== id)
      return null
    }
    if (method === 'PATCH') {
      classes = classes.map(c => c.id === id ? { ...c, ...body } : c)
      return classes.find(c => c.id === id)
    }
  }

  // ── Lessons ───────────────────────────────────────────────────────────────
  if (path === '/api/lessons') {
    if (method === 'GET')  return [...lessons]
    if (method === 'POST') {
      const created = { id: uid(), cardCount: 0, publishAt: null, deadlineAt: null, notifyEmail: false, ...body }
      lessons.push(created)
      schedules.push({ ...created })
      classes = classes.map(c => c.id === created.classId ? { ...c, lessons: (c.lessons || 0) + 1 } : c)
      if (created.type === 'assessment') {
        assessments.push({ id: uid(), lessonId: created.id, passMark: 70, rewardPoints: 10, leaderboardEnabled: false, isPastYearPaper: false, questions: [] })
      }
      return created
    }
  }
  const lessonMatch = path.match(/^\/api\/lessons\/(\d+)$/)
  if (lessonMatch) {
    const id = Number(lessonMatch[1])
    if (method === 'GET') {
      const lesson = lessons.find(l => l.id === id)
      return lesson ? serializeLessonDetail(lesson) : null
    }
    if (method === 'PUT') {
      lessons = lessons.map(l => l.id === id ? { ...l, ...body } : l)
      schedules = schedules.map(l => l.id === id ? { ...l, ...body } : l)
      return lessons.find(l => l.id === id)
    }
    if (method === 'DELETE') {
      const lesson = lessons.find(l => l.id === id)
      lessons = lessons.filter(l => l.id !== id)
      schedules = schedules.filter(l => l.id !== id)
      assessments = assessments.filter(a => a.lessonId !== id)
      if (lesson) classes = classes.map(c => c.id === lesson.classId ? { ...c, lessons: Math.max(0, (c.lessons || 1) - 1) } : c)
      return null
    }
  }

  // ── Flashcards ────────────────────────────────────────────────────────────
  if (path.startsWith('/api/flashcards')) {
    const qsMatch = path.match(/\?lessonId=(\d+)/)
    if (method === 'GET' && qsMatch) {
      const lessonId = Number(qsMatch[1])
      return flashcards.filter(f => f.lessonId === lessonId)
    }
    if (method === 'POST') {
      const created = { id: uid(), ...body }
      flashcards.push(created)
      return created
    }
  }
  const fcMatch = path.match(/^\/api\/flashcards\/(\d+)$/)
  if (fcMatch) {
    const id = Number(fcMatch[1])
    if (method === 'PUT') {
      flashcards = flashcards.map(f => f.id === id ? { ...f, ...body } : f)
      return flashcards.find(f => f.id === id)
    }
    if (method === 'DELETE') {
      flashcards = flashcards.filter(f => f.id !== id)
      return null
    }
  }

  // ── Personal flash card library (per student, "save for later" across any deck) ────
  if (path.startsWith('/api/flashcard-library')) {
    const qsMatch = path.match(/\?studentId=(\d+)/)
    if (method === 'GET' && qsMatch) {
      const studentId = Number(qsMatch[1])
      return flashcardLibrary.filter(c => c.studentId === studentId)
    }
    if (method === 'POST') {
      const existing = flashcardLibrary.find(c => c.studentId === body.studentId && c.flashcardId === body.flashcardId)
      if (existing) return existing
      const created = { id: uid(), ...body }
      flashcardLibrary.push(created)
      persistFlashcardLibrary()
      return created
    }
  }
  const libMatch = path.match(/^\/api\/flashcard-library\/(\d+)$/)
  if (libMatch) {
    const id = Number(libMatch[1])
    if (method === 'DELETE') {
      flashcardLibrary = flashcardLibrary.filter(c => c.id !== id)
      persistFlashcardLibrary()
      return null
    }
  }

  // ── Flash card study progress (per student, per card — powers Study Set modes) ─────
  if (path.startsWith('/api/flashcard-progress')) {
    const qsMatch = path.match(/\?studentId=(\d+)/)
    if (method === 'GET' && qsMatch) {
      const studentId = Number(qsMatch[1])
      return flashcardProgress.filter(p => p.studentId === studentId)
    }
    if (method === 'POST') {
      const idx = flashcardProgress.findIndex(p => p.studentId === body.studentId && p.cardId === body.cardId)
      if (idx >= 0) {
        flashcardProgress[idx] = { ...flashcardProgress[idx], ...body }
        persistFlashcardProgress()
        return flashcardProgress[idx]
      }
      const created = { status: 'new', correctStreak: 0, starred: false, ...body }
      flashcardProgress.push(created)
      persistFlashcardProgress()
      return created
    }
  }

  // ── Assessments (always scoped to a lesson) ─────────────────────────────────
  if (path === '/api/assessments') {
    if (method === 'GET')  return assessments.map(serializeAssessment)
    if (method === 'POST') {
      const existing = assessments.find(a => a.lessonId === body.lessonId)
      if (existing) return serializeAssessment(existing)
      const created = { id: uid(), passMark: 70, rewardPoints: 10, leaderboardEnabled: false, isPastYearPaper: false, questions: [], ...body }
      assessments.push(created)
      return serializeAssessment(created)
    }
  }
  const byLessonMatch = path.match(/^\/api\/assessments\/by-lesson\/(\d+)$/)
  if (byLessonMatch) {
    const lessonId = Number(byLessonMatch[1])
    if (method === 'GET') {
      const found = assessments.find(a => a.lessonId === lessonId)
      return found ? serializeAssessment(found) : null
    }
  }
  const assessmentQMatch = path.match(/^\/api\/assessments\/(\d+)\/questions$/)
  if (assessmentQMatch) {
    const assessmentId = Number(assessmentQMatch[1])
    if (method === 'POST') {
      const q = { id: uid(), assessmentId, ...body }
      assessments = assessments.map(a => a.id === assessmentId ? { ...a, questions: [...a.questions, q] } : a)
      return q
    }
  }
  // Attempts: submitting one scores it server-side from the assessment's own stored
  // answers/points (never trusted from the client) and is what powers the leaderboard.
  const attemptsMatch = path.match(/^\/api\/assessments\/(\d+)\/attempts$/)
  if (attemptsMatch) {
    const assessmentId = Number(attemptsMatch[1])
    if (method === 'GET') {
      return assessmentAttempts
        .filter(a => a.assessmentId === assessmentId)
        .sort((a, b) => b.score - a.score)
    }
    if (method === 'POST') {
      const assessment = assessments.find(a => a.id === assessmentId)
      if (!assessment) throw new Error('Assessment not found')
      let score = 0
      let totalPoints = 0
      assessment.questions.forEach(q => {
        totalPoints += q.points || 1
        if (isCorrectAnswer(q, body.answers?.[q.id])) score += q.points || 1
      })
      const created = {
        id: uid(), assessmentId, studentId: body.studentId, studentName: body.studentName,
        score, totalPoints, answers: body.answers, completedAt: new Date().toISOString(),
      }
      assessmentAttempts.push(created)
      return created
    }
  }
  const assessmentMatch = path.match(/^\/api\/assessments\/(\d+)$/)
  if (assessmentMatch) {
    const id = Number(assessmentMatch[1])
    if (method === 'GET') { const a = assessments.find(x => x.id === id); return a ? serializeAssessment(a) : null }
    if (method === 'PUT') {
      assessments = assessments.map(a => a.id === id ? { ...a, ...body } : a)
      return serializeAssessment(assessments.find(a => a.id === id))
    }
    if (method === 'DELETE') {
      assessments = assessments.filter(a => a.id !== id)
      return null
    }
  }

  // ── Assessment questions ────────────────────────────────────────────────────
  const aqMatch = path.match(/^\/api\/assessment-questions\/(\d+)$/)
  if (aqMatch) {
    const id = Number(aqMatch[1])
    if (method === 'PUT') {
      assessments = assessments.map(a => ({
        ...a,
        questions: a.questions.map(q => q.id === id ? { ...q, ...body } : q),
      }))
      return assessments.flatMap(a => a.questions).find(q => q.id === id)
    }
    if (method === 'DELETE') {
      assessments = assessments.map(a => ({ ...a, questions: a.questions.filter(q => q.id !== id) }))
      return null
    }
  }

  // ── Quizzes (belong to a Class, not a Lesson — sit "between" two lessons; ungraded,
  // never touches points/leaderboard/certs) ──────────────────────────────────
  if (path === '/api/quizzes') {
    if (method === 'GET')  return quizzes.map(serializeQuiz)
    if (method === 'POST') {
      const created = { id: uid(), status: 'draft', afterLessonId: null, cards: [], ...body }
      quizzes.push(created)
      return serializeQuiz(created)
    }
  }
  const quizMatch = path.match(/^\/api\/quizzes\/(\d+)$/)
  if (quizMatch) {
    const id = Number(quizMatch[1])
    if (method === 'GET') { const z = quizzes.find(x => x.id === id); return z ? serializeQuiz(z) : null }
    if (method === 'PUT') {
      quizzes = quizzes.map(z => z.id === id ? { ...z, ...body } : z)
      return serializeQuiz(quizzes.find(z => z.id === id))
    }
    if (method === 'DELETE') {
      quizzes = quizzes.filter(z => z.id !== id)
      return null
    }
  }

  // ── Quiz cards (front/back/hint — same shape as flashcards) ─────────────────
  if (path.startsWith('/api/quiz-cards')) {
    const qsMatch = path.match(/\?quizId=(\d+)/)
    if (method === 'GET' && qsMatch) {
      const quizId = Number(qsMatch[1])
      return quizzes.find(z => z.id === quizId)?.cards || []
    }
    if (method === 'POST') {
      const created = { id: uid(), ...body }
      quizzes = quizzes.map(z => z.id === body.quizId ? { ...z, cards: [...z.cards, created] } : z)
      return created
    }
  }
  const qcMatch = path.match(/^\/api\/quiz-cards\/(\d+)$/)
  if (qcMatch) {
    const id = Number(qcMatch[1])
    if (method === 'PUT') {
      quizzes = quizzes.map(z => ({ ...z, cards: z.cards.map(c => c.id === id ? { ...c, ...body } : c) }))
      return quizzes.flatMap(z => z.cards).find(c => c.id === id)
    }
    if (method === 'DELETE') {
      quizzes = quizzes.map(z => ({ ...z, cards: z.cards.filter(c => c.id !== id) }))
      return null
    }
  }

  // ── Schedules ─────────────────────────────────────────────────────────────
  if (path === '/api/schedules') {
    if (method === 'GET') return [...schedules]
  }
  const schedMatch = path.match(/^\/api\/schedules\/(\d+)$/)
  if (schedMatch) {
    const id = Number(schedMatch[1])
    if (method === 'PUT') {
      schedules = schedules.map(l => l.id === id ? { ...l, ...body, status: body.publishAt ? 'scheduled' : 'published' } : l)
      lessons   = lessons.map(l => l.id === id ? { ...l, ...body, status: body.publishAt ? 'scheduled' : 'published' } : l)
      return schedules.find(l => l.id === id)
    }
    if (method === 'DELETE') {
      schedules = schedules.map(l => l.id === id ? { ...l, publishAt: null, deadlineAt: null, notifyEmail: false, status: 'draft' } : l)
      lessons   = lessons.map(l => l.id === id ? { ...l, publishAt: null, deadlineAt: null, notifyEmail: false, status: 'draft' } : l)
      return schedules.find(l => l.id === id)
    }
  }

  // ── Badges ────────────────────────────────────────────────────────────────
  if (path === '/api/badges') {
    if (method === 'GET')  return [...badges]
    if (method === 'POST') {
      const created = { id: uid(), ...body }
      badges.push(created)
      return created
    }
  }
  const badgeMatch = path.match(/^\/api\/badges\/(\d+)$/)
  if (badgeMatch) {
    const id = Number(badgeMatch[1])
    if (method === 'PUT') {
      badges = badges.map(b => b.id === id ? { ...b, ...body } : b)
      return badges.find(b => b.id === id)
    }
    if (method === 'DELETE') {
      badges = badges.filter(b => b.id !== id)
      return null
    }
  }

  // ── Students / Enrollments ────────────────────────────────────────────────
  if (path === '/api/students') {
    if (method === 'GET') return [...students]
  }
  const studentMatch = path.match(/^\/api\/students\/(\d+)$/)
  if (studentMatch) {
    const enrollmentId = Number(studentMatch[1])
    if (method === 'DELETE') {
      students = students.filter(s => s.enrollmentId !== enrollmentId)
      return null
    }
  }

  throw new Error(`Mock API: unhandled ${method} ${path}`)
}

// ─── Demo user accounts ───────────────────────────────────────────────────────
// Students authenticate with a username + PIN (not email) — parents/teachers/admins use email.

export const DEMO_USERS = {
  'ahmad2026':               { password: '1234',        user: { id: 1, role: 'student', name: 'Ahmad bin Hassan', username: 'ahmad2026',           mustChangeCredential: false } },
  'parent1@neurobix.com':    { password: 'password123', user: { id: 2, role: 'parent',  name: 'Hassan bin Idris',  email: 'parent1@neurobix.com',   mustChangeCredential: false } },
  'sarah.tan@neurobix.com':  { password: 'password123', user: { id: 3, role: 'teacher', name: 'Ms Sarah Tan',      email: 'sarah.tan@neurobix.com', mustChangeCredential: false } },
  'admin@neurobix.com':      { password: 'password123', user: { id: 4, role: 'admin',   name: 'Admin User',        email: 'admin@neurobix.com',     mustChangeCredential: false } },
}

// Accounts created at runtime (Admin "Add User", Parent "Add Student") land here so they can
// actually log in — kept separate from the seeded DEMO_USERS above, and persisted to
// localStorage so a freshly-created account survives a page reload or a different tab
// (this is a frontend-only mock, so there's no real server session to share otherwise).
const RUNTIME_USERS_KEY = 'nb_runtime_users'

export let RUNTIME_USERS = (() => {
  try { return JSON.parse(localStorage.getItem(RUNTIME_USERS_KEY)) || {} } catch { return {} }
})()

function persistRuntimeUsers() {
  localStorage.setItem(RUNTIME_USERS_KEY, JSON.stringify(RUNTIME_USERS))
}

export function findAuthRecord(identifier) {
  const id = (identifier || '').toLowerCase()
  return DEMO_USERS[id] || RUNTIME_USERS[id]
}

export function registerUser(identifier, password, user) {
  const id = identifier.toLowerCase()
  RUNTIME_USERS[id] = { password, user: { mustChangeCredential: true, ...user } }
  persistRuntimeUsers()
  return RUNTIME_USERS[id].user
}

export function resetCredential(identifier, newPassword) {
  const id = identifier.toLowerCase()
  if (DEMO_USERS[id])    DEMO_USERS[id]    = { ...DEMO_USERS[id],    password: newPassword }
  if (RUNTIME_USERS[id]) { RUNTIME_USERS[id] = { ...RUNTIME_USERS[id], password: newPassword }; persistRuntimeUsers() }
}

export function setMustChangeCredential(identifier, value) {
  const id = identifier.toLowerCase()
  if (DEMO_USERS[id])    DEMO_USERS[id]    = { ...DEMO_USERS[id],    user: { ...DEMO_USERS[id].user,    mustChangeCredential: value } }
  if (RUNTIME_USERS[id]) { RUNTIME_USERS[id] = { ...RUNTIME_USERS[id], user: { ...RUNTIME_USERS[id].user, mustChangeCredential: value } }; persistRuntimeUsers() }
}
