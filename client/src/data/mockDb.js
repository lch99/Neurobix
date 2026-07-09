// In-memory mock database — all backend data lives here for the frontend-only demo build.
// Mutations update these arrays in-memory so CRUD operations work for the session.

let nextId = 1000
const uid = () => ++nextId

// ─── Seed data ────────────────────────────────────────────────────────────────

let classes = [
  { id: 1, name: 'Primary 4A', subject: 'Mathematics', level: 'P4', students: 12, lessons: 5, teacherId: 3 },
  { id: 2, name: 'Primary 4B', subject: 'English',     level: 'P4', students: 10, lessons: 4, teacherId: 3 },
  { id: 3, name: 'Primary 5A', subject: 'Science',     level: 'P5', students: 14, lessons: 3, teacherId: 3 },
]

let lessons = [
  { id: 1,  classId: 1, title: 'Addition & Subtraction',  type: 'video',     status: 'published', subject: 'Mathematics', cardCount: 0,  publishAt: null, deadlineAt: '2026-03-14', notifyEmail: true  },
  { id: 2,  classId: 1, title: 'Multiplication Tables',   type: 'flashcard', status: 'published', subject: 'Mathematics', cardCount: 3,  publishAt: null, deadlineAt: '2026-03-28', notifyEmail: false },
  { id: 3,  classId: 1, title: 'Fractions Basics',        type: 'quiz',      status: 'published', subject: 'Mathematics', cardCount: 0,  publishAt: null, deadlineAt: '2026-05-25', notifyEmail: true  },
  { id: 4,  classId: 1, title: 'Division for Beginners',  type: 'video',     status: 'scheduled', subject: 'Mathematics', cardCount: 0,  publishAt: '2026-06-30T09:00', deadlineAt: '2026-07-15', notifyEmail: true },
  { id: 5,  classId: 1, title: 'Geometry: Shapes',        type: 'activity',  status: 'draft',     subject: 'Mathematics', cardCount: 0,  publishAt: null, deadlineAt: null, notifyEmail: false },
  { id: 6,  classId: 2, title: 'Alphabet Flash Cards',    type: 'flashcard', status: 'published', subject: 'English',     cardCount: 6,  publishAt: null, deadlineAt: null, notifyEmail: false },
  { id: 7,  classId: 2, title: 'Reading Comprehension',   type: 'reading',   status: 'published', subject: 'English',     cardCount: 0,  publishAt: null, deadlineAt: '2026-05-20', notifyEmail: true  },
  { id: 8,  classId: 2, title: 'Grammar: Tenses',         type: 'quiz',      status: 'draft',     subject: 'English',     cardCount: 0,  publishAt: null, deadlineAt: null, notifyEmail: false },
  { id: 9,  classId: 3, title: 'The Solar System',        type: 'video',     status: 'published', subject: 'Science',     cardCount: 0,  publishAt: null, deadlineAt: '2026-07-15', notifyEmail: true  },
  { id: 10, classId: 3, title: 'Plants & Photosynthesis', type: 'reading',   status: 'scheduled', subject: 'Science',     cardCount: 0,  publishAt: '2026-07-01T08:00', deadlineAt: '2026-07-30', notifyEmail: true },
]

let flashcards = [
  { id: 1, lessonId: 2, front: 'What is 7 × 8?',            back: '56',                hint: '7 × 7 = 49, then +7'            },
  { id: 2, lessonId: 2, front: 'What is 12 × 12?',          back: '144',               hint: 'A dozen dozens!'                },
  { id: 3, lessonId: 2, front: 'What is √49?',              back: '7',                 hint: '7 × 7 = 49'                     },
  { id: 4, lessonId: 6, front: 'Letter A sounds like…',     back: 'Apple 🍎 / Ant 🐜', hint: 'Think of words that start with A!' },
  { id: 5, lessonId: 6, front: 'Spell: Beautiful',          back: 'B-E-A-U-T-I-F-U-L', hint: '"Big Elephants Are Ugly"'       },
  { id: 6, lessonId: 6, front: 'Opposite of: Happy',        back: 'Sad / Unhappy',     hint: 'Prefix un- makes opposites!'    },
  { id: 7, lessonId: 6, front: 'Plural of: Mouse',          back: 'Mice 🐭',           hint: 'Irregular plural — no rules!'   },
  { id: 8, lessonId: 6, front: 'What does "enormous" mean?', back: 'Very, very big',   hint: 'Bigger than big!'               },
  { id: 9, lessonId: 6, front: 'Rhymes with: Cat',          back: 'Bat, Hat, Mat, Rat', hint: 'Short "a" sound family'        },
]

let quizzes = [
  {
    id: 1, classId: 1, title: 'Times Tables Challenge',
    questions: [
      { id: 1, quizId: 1, type: 'mcq',       text: 'What is 6 × 7?',   options: ['36','42','48','54'],        answer: 1, points: 1 },
      { id: 2, quizId: 1, type: 'mcq',       text: 'What is 9 × 8?',   options: ['63','72','81','90'],        answer: 1, points: 1 },
      { id: 3, quizId: 1, type: 'true_false', text: '7 × 7 = 48',      options: ['True','False'],             answer: false, points: 1 },
      { id: 4, quizId: 1, type: 'fill_in',   text: '12 × 11 = ___',    options: [],                           answer: '132', points: 2 },
    ],
  },
  {
    id: 2, classId: 1, title: 'Fractions Basics Quiz',
    questions: [
      { id: 5, quizId: 2, type: 'mcq',       text: 'What is ½ of 20?', options: ['5','8','10','12'],          answer: 2, points: 1 },
      { id: 6, quizId: 2, type: 'true_false', text: '¼ is greater than ½', options: ['True','False'],         answer: false, points: 1 },
    ],
  },
  {
    id: 3, classId: 2, title: 'Grammar: Tenses Check',
    questions: [
      { id: 7, quizId: 3, type: 'mcq', text: 'Which is past tense: "run"?', options: ['runned','ran','runs','running'], answer: 1, points: 1 },
    ],
  },
]

let schedules = lessons.map(l => ({ ...l }))

let students = [
  { enrollmentId: 1,  studentId: 1,  classId: 1, name: 'Ahmad bin Hassan',   email: 'ahmad@student.neurobix.com'   },
  { enrollmentId: 2,  studentId: 2,  classId: 1, name: 'Nadia Putri',        email: 'nadia@student.neurobix.com'   },
  { enrollmentId: 3,  studentId: 3,  classId: 1, name: 'Farid bin Ismail',   email: 'farid@student.neurobix.com'   },
  { enrollmentId: 4,  studentId: 4,  classId: 1, name: 'Siti Nur Aisyah',    email: 'siti@student.neurobix.com'    },
  { enrollmentId: 5,  studentId: 5,  classId: 1, name: 'Justin Ng',          email: 'justin@student.neurobix.com'  },
  { enrollmentId: 6,  studentId: 6,  classId: 1, name: 'Priya Ramasamy',     email: 'priya@student.neurobix.com'   },
  { enrollmentId: 7,  studentId: 7,  classId: 2, name: 'Mei Lin',            email: 'meilin@student.neurobix.com'  },
  { enrollmentId: 8,  studentId: 8,  classId: 2, name: 'Darren Lim',         email: 'darren@student.neurobix.com'  },
  { enrollmentId: 9,  studentId: 9,  classId: 2, name: 'Hafizah Binte Omar', email: 'hafizah@student.neurobix.com' },
  { enrollmentId: 10, studentId: 10, classId: 2, name: 'Ethan Koh',          email: 'ethan@student.neurobix.com'   },
  { enrollmentId: 11, studentId: 11, classId: 3, name: 'Nur Ain',            email: 'nurain@student.neurobix.com'  },
  { enrollmentId: 12, studentId: 12, classId: 3, name: 'Samuel Tan',         email: 'samuel@student.neurobix.com'  },
  { enrollmentId: 13, studentId: 13, classId: 3, name: 'Aisyah Rahman',      email: 'aisyah@student.neurobix.com'  },
  { enrollmentId: 14, studentId: 1,  classId: 3, name: 'Ahmad bin Hassan',   email: 'ahmad@student.neurobix.com'   },
]

// ─── Router ───────────────────────────────────────────────────────────────────

export async function mockApiRequest(path, { method = 'GET', body } = {}) {
  await new Promise(r => setTimeout(r, 120))

  // Health check
  if (path === '/api/health') return { status: 'ok' }

  // ── Auth ──────────────────────────────────────────────────────────────────
  if (path === '/api/auth/login') {
    const match = DEMO_USERS[body?.identifier?.toLowerCase()]
    if (!match || match.password !== body?.password) throw new Error('Invalid email or password.')
    return { token: 'demo_' + match.user.role + '_token', user: match.user }
  }
  if (path === '/api/auth/logout') return null

  // ── Classes ───────────────────────────────────────────────────────────────
  if (path === '/api/classes') {
    if (method === 'GET')  return [...classes]
    if (method === 'POST') {
      const created = { id: uid(), students: 0, lessons: 0, ...body }
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
      return created
    }
  }
  const lessonMatch = path.match(/^\/api\/lessons\/(\d+)$/)
  if (lessonMatch) {
    const id = Number(lessonMatch[1])
    if (method === 'PUT') {
      lessons = lessons.map(l => l.id === id ? { ...l, ...body } : l)
      schedules = schedules.map(l => l.id === id ? { ...l, ...body } : l)
      return lessons.find(l => l.id === id)
    }
    if (method === 'DELETE') {
      const lesson = lessons.find(l => l.id === id)
      lessons = lessons.filter(l => l.id !== id)
      schedules = schedules.filter(l => l.id !== id)
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

  // ── Quizzes ───────────────────────────────────────────────────────────────
  if (path === '/api/quizzes') {
    if (method === 'GET')  return quizzes.map(q => ({ ...q }))
    if (method === 'POST') {
      const created = { id: uid(), questions: [], ...body }
      quizzes.push(created)
      return created
    }
  }
  const quizQMatch = path.match(/^\/api\/quizzes\/(\d+)\/questions$/)
  if (quizQMatch) {
    const quizId = Number(quizQMatch[1])
    if (method === 'POST') {
      const q = { id: uid(), quizId, ...body }
      quizzes = quizzes.map(qz => qz.id === quizId ? { ...qz, questions: [...qz.questions, q] } : qz)
      return q
    }
  }
  const quizMatch = path.match(/^\/api\/quizzes\/(\d+)$/)
  if (quizMatch) {
    const id = Number(quizMatch[1])
    if (method === 'GET')  return quizzes.find(q => q.id === id) || null
    if (method === 'PUT') {
      quizzes = quizzes.map(q => q.id === id ? { ...q, ...body } : q)
      return quizzes.find(q => q.id === id)
    }
    if (method === 'DELETE') {
      quizzes = quizzes.filter(q => q.id !== id)
      return null
    }
  }

  // ── Quiz questions ────────────────────────────────────────────────────────
  const qqMatch = path.match(/^\/api\/quiz-questions\/(\d+)$/)
  if (qqMatch) {
    const id = Number(qqMatch[1])
    if (method === 'PUT') {
      quizzes = quizzes.map(qz => ({
        ...qz,
        questions: qz.questions.map(q => q.id === id ? { ...q, ...body } : q),
      }))
      return quizzes.flatMap(qz => qz.questions).find(q => q.id === id)
    }
    if (method === 'DELETE') {
      quizzes = quizzes.map(qz => ({ ...qz, questions: qz.questions.filter(q => q.id !== id) }))
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

export const DEMO_USERS = {
  'student1@neurobix.com':  { password: 'password123', user: { id: 1, role: 'student', name: 'Ahmad bin Hassan', email: 'student1@neurobix.com'  } },
  'parent1@neurobix.com':   { password: 'password123', user: { id: 2, role: 'parent',  name: 'Hassan bin Idris',  email: 'parent1@neurobix.com'   } },
  'sarah.tan@neurobix.com': { password: 'password123', user: { id: 3, role: 'teacher', name: 'Ms Sarah Tan',      email: 'sarah.tan@neurobix.com' } },
  'admin@neurobix.com':     { password: 'password123', user: { id: 4, role: 'admin',   name: 'Admin User',        email: 'admin@neurobix.com'     } },
}
