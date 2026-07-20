import { useState, useEffect } from 'react'
import iconSolarSystem from '../assets/icons/solar-system.png'
import iconPlants from '../assets/icons/plants.png'
import iconHumanBody from '../assets/icons/human-body.png'
import iconForces from '../assets/icons/forces.png'
import iconStatesMatter from '../assets/icons/states-matter.png'
import iconFoodChain from '../assets/icons/food-chain.png'
import { subjectMicroscope } from '../assets/icons'

// Each term runs roughly 1–3 months and is broken into weeks; every lesson
// is scheduled for a specific week within its term so students/parents can
// see what's coming up week by week.
export const TERMS = [
  { id: 1, name: 'Term 1', startDate: '2026-01-02', endDate: '2026-03-14', status: 'completed' },
  { id: 2, name: 'Term 2', startDate: '2026-03-30', endDate: '2026-05-30', status: 'completed' },
  { id: 3, name: 'Term 3', startDate: '2026-06-29', endDate: '2026-09-05', status: 'active' },
  { id: 4, name: 'Term 4', startDate: '2026-09-21', endDate: '2026-11-19', status: 'upcoming' },
]

const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// e.g. "2 Jan – 14 Mar 2026"
export function formatTermRange(term) {
  const s = new Date(term.startDate)
  const e = new Date(term.endDate)
  const start = `${s.getDate()} ${MONTH_ABBR[s.getMonth()]}`
  const end = `${e.getDate()} ${MONTH_ABBR[e.getMonth()]} ${e.getFullYear()}`
  return `${start} – ${end}`
}

export const ALL_LESSONS = [
  // Science — Term 1: Space
  { id: 7,  term: 1, week: 2, title: 'The Solar System',             subject: 'Science',     type: 'video',     status: 'in_progress', duration: '18 min', icon: iconSolarSystem,  difficulty: 'Easy',   desc: 'Journey through the 8 planets using the mnemonic "My Very Educated Mother".' },
  // Science — Term 2: Life Science
  { id: 8,  term: 2, week: 1, title: 'Plants & Photosynthesis',      subject: 'Science',     type: 'reading',   status: 'pending',     duration: '14 min', icon: iconPlants,       difficulty: 'Medium', desc: "Discover how plants turn sunlight into food — nature's own factory!" },
  { id: 18, term: 2, week: 3, title: 'The Human Body',               subject: 'Science',     type: 'flashcard', status: 'pending',     duration: '16 min', icon: iconHumanBody,    difficulty: 'Medium', desc: 'Learn the major organs and their functions with labelled flash cards.' },
  // Science — Term 3: Physics
  { id: 19, term: 3, week: 2, title: 'Forces & Motion',              subject: 'Science',     type: 'video',     status: 'pending',     duration: '15 min', icon: iconForces,       difficulty: 'Medium', desc: 'Push, pull, gravity — understand forces through fun experiments!' },
  { id: 20, term: 3, week: 1, title: 'States of Matter',             subject: 'Science',     type: 'assessment', status: 'pending',     duration: '12 min', icon: iconStatesMatter, difficulty: 'Easy',   desc: 'Solid, liquid, gas — test yourself on how matter changes state.' },
  // Science — Term 4: Ecosystems
  { id: 21, term: 4, week: 1, title: 'Food Chains & Ecosystems',     subject: 'Science',     type: 'activity',  status: 'pending',     duration: '20 min', icon: iconFoodChain,    difficulty: 'Hard',   desc: 'Build your own food chain and understand how ecosystems balance.' },
]

export const SUBJECTS     = ['All', 'Science']
export const TYPES        = ['All', 'video', 'flashcard', 'assessment', 'reading', 'activity']
export const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']

export const STATUS_STYLE = {
  completed:   'bg-green-100 text-green-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  pending:     'bg-gray-100 text-gray-500',
}
export const STATUS_LABEL = {
  completed:   '✅ Done',
  in_progress: '▶️ Continue',
  pending:     '🔒 Start',
}
export const DIFF_COLOR = {
  Easy:   'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard:   'bg-red-100 text-red-600',
}
export const TYPE_COLOR = {
  video:     'bg-blue-100 text-blue-700',
  flashcard: 'bg-purple-100 text-purple-700',
  assessment: 'bg-orange-100 text-orange-700',
  reading:   'bg-nb-cream text-nb-dark border border-nb-olive/30',
  activity:  'bg-pink-100 text-pink-700',
}
export const TYPE_ICON = { video:'🎬', flashcard:'🃏', assessment:'📝', reading:'📄', activity:'🎨' }

export const SUBJECT_META = {
  Science: { emoji: '🔬', icon: subjectMicroscope, color: '#36913F', sequential: true },
}
export const SUBJECT_BADGE = {
  Science: 'bg-green-100 text-green-700',
}

// Returns a Set of lesson IDs that are locked.
// Science only: a lesson is locked if the immediately previous Science lesson
// is not completed (lock propagates forward through the chain).
function computeLockedIds(lessons) {
  const scienceLessons = lessons.filter(l => l.subject === 'Science')
  const lockedIds = new Set()
  for (let i = 1; i < scienceLessons.length; i++) {
    const prev = scienceLessons[i - 1]
    if (prev.status !== 'completed' || lockedIds.has(prev.id)) {
      lockedIds.add(scienceLessons[i].id)
    }
  }
  return lockedIds
}

export const LOCKED_IDS = computeLockedIds(ALL_LESSONS)

// ─── Teacher "force open" override ──────────────────────────────────────────
// Lets a teacher open this week's class on the spot for a student who hasn't
// finished the previous lesson yet, bypassing the sequential lock above.
// Demo-only: state lives in localStorage (no server), shared across tabs so a
// teacher's override is instantly visible on the student side in the browser.
const FORCE_OPEN_KEY = 'nb_force_open_lesson_ids'

// Demo default: lesson 20 ("States of Matter", the Assessment showcase example) comes
// pre-opened in any fresh browser, so it's reachable without first completing lessons
// 7/8/18/19 in sequence. Only applies before any real toggle exists for this browser —
// once a teacher uses the actual "Force Open Now" button, that explicit state takes over.
const DEMO_DEFAULT_FORCE_OPEN_IDS = [20]

function readForceOpenIds() {
  try {
    const raw = localStorage.getItem(FORCE_OPEN_KEY)
    if (raw === null) return new Set(DEMO_DEFAULT_FORCE_OPEN_IDS)
    return new Set(JSON.parse(raw) || [])
  } catch {
    return new Set(DEMO_DEFAULT_FORCE_OPEN_IDS)
  }
}

export function setForceOpen(lessonId, open) {
  const ids = readForceOpenIds()
  if (open) ids.add(lessonId)
  else ids.delete(lessonId)
  localStorage.setItem(FORCE_OPEN_KEY, JSON.stringify([...ids]))
  window.dispatchEvent(new Event('nb-force-open-change'))
}

// Reactive set of force-opened lesson ids — re-renders when a teacher toggles
// an override, in this tab or another (e.g. teacher + student tabs open side by side).
export function useForceOpenIds() {
  const [ids, setIds] = useState(() => readForceOpenIds())
  useEffect(() => {
    const sync = () => setIds(readForceOpenIds())
    window.addEventListener('nb-force-open-change', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('nb-force-open-change', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  return ids
}

// ─── Weekly schedule helpers ────────────────────────────────────────────────

export function getTermWeekCount(term) {
  return Math.max(1, Math.ceil((new Date(term.endDate) - new Date(term.startDate)) / (7 * 24 * 60 * 60 * 1000)) + 1)
}

// Which term + week "today" falls in — used to open the weekly schedule on the current week.
export function getCurrentTermWeek(today = new Date()) {
  const active = TERMS.find(t => new Date(t.startDate) <= today && today <= new Date(t.endDate))
  if (!active) {
    const upcoming = [...TERMS].filter(t => new Date(t.startDate) > today).sort((a, b) => a.startDate.localeCompare(b.startDate))[0]
    return { term: upcoming || TERMS[TERMS.length - 1], week: 1 }
  }
  const dayDiff = Math.floor((today - new Date(active.startDate)) / (24 * 60 * 60 * 1000))
  const week = Math.min(getTermWeekCount(active), Math.max(1, Math.floor(dayDiff / 7) + 1))
  return { term: active, week }
}

// Groups a term's lessons as { [weekNumber]: lessons[] } — only weeks with content.
export function getLessonsByWeek(termId, lessons = ALL_LESSONS) {
  const byWeek = {}
  lessons.filter(l => l.term === termId).forEach(l => {
    const wk = l.week || 1
    if (!byWeek[wk]) byWeek[wk] = []
    byWeek[wk].push(l)
  })
  return byWeek
}
