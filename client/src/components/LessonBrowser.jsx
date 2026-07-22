import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../lib/api'
import StudySet from './StudySet'
import logoWhite from '../assets/Asset 1@3x 1_White.png'
import { starYellow, lockIcon, durationIcon } from '../assets/icons'
import {
  ALL_LESSONS, LOCKED_IDS, TERMS, formatTermRange,
  STATUS_STYLE, STATUS_LABEL, DIFF_COLOR, TYPE_COLOR, TYPE_ICON,
  SUBJECT_META, SUBJECT_BADGE, useForceOpenIds,
} from '../data/lessons'

const MILESTONES = [25, 50, 75, 100]

const SUBJECT_ICON = {
  Science: SUBJECT_META.Science.icon,
}

const TERM_TOPIC = {
  Science: {
    1: 'Space',
    2: 'Life Science',
    3: 'Physics',
    4: 'Ecosystems',
  },
}

const TERM_DATES = Object.fromEntries(TERMS.map(t => [t.id, formatTermRange(t)]))

function termStatus(lessons) {
  if (!lessons.length) return 'locked'
  if (lessons.every(l => l.status === 'completed')) return 'completed'
  if (lessons.some(l => l.status === 'in_progress' || l.status === 'completed')) return 'in_progress'
  return 'pending'
}

export default function LessonBrowser() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [view, setView]                 = useState('courses')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [expandedTerm, setExpandedTerm] = useState(null)
  const [quizzes, setQuizzes]           = useState([])

  // Quizzes aren't their own nav tab — they're pinned to a specific lesson (afterLessonId)
  // and rendered right below it in the term list below, so they visually sit "between
  // classes" instead of living in a separate place a student has to think to check.
  useEffect(() => {
    let cancelled = false
    apiRequest('/api/quizzes', { token }).then(data => {
      if (!cancelled) setQuizzes((data || []).filter(q => q.status === 'published'))
    })
    return () => { cancelled = true }
  }, [token])

  const done      = ALL_LESSONS.filter(l => l.status === 'completed').length
  const inProg    = ALL_LESSONS.filter(l => l.status === 'in_progress').length
  const remaining = ALL_LESSONS.length - done - inProg
  const pct       = Math.round((done / ALL_LESSONS.length) * 100)

  function openCourse(name) {
    setSelectedCourse(name)
    setView('terms')
    const cl = ALL_LESSONS.filter(l => l.subject === name)
    const auto =
      [1, 2, 3, 4].find(t => cl.filter(l => l.term === t).some(l => l.status === 'in_progress')) ||
      [1, 2, 3, 4].find(t => cl.filter(l => l.term === t).some(l => l.status === 'pending')) ||
      1
    setExpandedTerm(auto)
  }

  function backToCourses() {
    setView('courses')
    setSelectedCourse(null)
    setExpandedTerm(null)
  }

  return (
    <div className="space-y-5">

      {/* ── Progress Banner ── */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] p-5 sm:py-7 text-white shadow-xl overflow-hidden"
           style={{ background: 'linear-gradient(135deg,#6FC911,#396336)' }}>
        <img src={logoWhite} alt="" className="absolute -right-2 -top-2 h-24 w-auto opacity-20 select-none pointer-events-none" />

        <div className="relative max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
          <div>
            <p className="text-green-100 text-sm font-semibold">Overall Progress</p>
            <p className="text-3xl sm:text-4xl font-black">{pct}% Complete</p>
            <p className="text-green-100 text-sm mt-1">Great start! Let's strengthen your memory!</p>
          </div>
          <div className="flex flex-wrap sm:flex-col gap-2">
            {[
              { bg: 'bg-nb-green', label: '✓', count: done,      text: 'Completed'   },
              { bg: 'bg-nb-yellow text-nb-dark', label: '▶', count: inProg,   text: 'In Progress' },
              { bg: 'bg-gray-300', label: <img src={lockIcon} alt="" className="w-2.5 h-2.5 object-contain invert" />, count: remaining, text: 'Remaining'   },
            ].map(s => (
              <span key={s.text} className="flex items-center gap-2 bg-white rounded-full pl-1.5 pr-3 py-1 text-xs sm:text-sm font-bold text-nb-dark whitespace-nowrap shadow-sm">
                <span className={`w-5 h-5 rounded-full ${s.bg} text-white flex items-center justify-center text-[10px] flex-shrink-0`}>{s.label}</span>
                {s.count} <span className="font-medium text-gray-400">{s.text}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto flex justify-center mb-7">
          <span className="bg-white text-nb-dark text-xs sm:text-sm font-bold rounded-full px-4 py-2 shadow-sm flex items-center gap-2">
            <img src={starYellow} alt="" className="w-4 h-4 object-contain" /> {ALL_LESSONS.length - done} lessons left to complete the full curriculum
          </span>
        </div>

        <div className="relative max-w-5xl mx-auto mt-4 mb-5">
          <div className="absolute -top-4 flex flex-col items-center" style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}>
            <div className="w-7 h-7 rounded-full bg-nb-yellow text-nb-dark flex items-center justify-center shadow p-1.5"><img src={starYellow} alt="" className="w-full h-full object-contain" /></div>
          </div>
          <div className="relative h-3 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          {MILESTONES.map(m => (
            <div key={m} className="absolute top-1.5 flex flex-col items-center" style={{ left: `${m}%`, transform: 'translateX(-50%)' }}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center p-1 ${pct >= m ? 'bg-nb-green text-white' : 'bg-white/30 text-white/70'}`}><img src={starYellow} alt="" className="w-full h-full object-contain" style={pct >= m ? {} : { filter: 'grayscale(1) brightness(1.6)' }} /></div>
              <span className="text-[10px] text-white/80 font-bold mt-1">{m}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── COURSES VIEW ── */}
      {view === 'courses' && (
        <>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-nb-dark">My Courses</h2>
            <p className="text-sm text-gray-400 mt-0.5">Primary 4 · Academic Year 2026 · 4 Terms per course</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(SUBJECT_META).map(([name, meta]) => {
              const lessons  = ALL_LESSONS.filter(l => l.subject === name)
              const doneCount = lessons.filter(l => l.status === 'completed').length
              const subjPct  = Math.round((doneCount / lessons.length) * 100)
              const currentTerm = (() => {
                const ip = [1, 2, 3, 4].find(t => lessons.filter(l => l.term === t).some(l => l.status === 'in_progress'))
                if (ip) return ip
                const completed = [1, 2, 3, 4].filter(t => lessons.filter(l => l.term === t).every(l => l.status === 'completed'))
                return completed.length ? completed[completed.length - 1] : 1
              })()

              return (
                <div key={name} onClick={() => openCourse(name)}
                  className="bg-white rounded-2xl border-2 border-nb-olive/20 p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group">

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center p-2.5 flex-shrink-0"
                         style={{ background: meta.color + '1A' }}>
                      <img src={SUBJECT_ICON[name]} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-nb-dark">{name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Primary 4 · 4 Terms</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-gray-400 font-semibold">{doneCount}/{lessons.length} lessons</span>
                      <span className="text-sm font-black" style={{ color: meta.color }}>{subjPct}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${subjPct}%`, background: meta.color }} />
                    </div>
                  </div>

                  {/* Term status pills */}
                  <div className="flex gap-1.5 mb-4">
                    {[1, 2, 3, 4].map(t => {
                      const s = termStatus(lessons.filter(l => l.term === t))
                      return (
                        <div key={t}
                          className={`flex-1 py-1.5 rounded-xl text-[11px] font-black text-center ${
                            s === 'completed'   ? 'bg-nb-green text-white' :
                            s === 'in_progress' ? 'text-nb-dark' :
                            'bg-gray-100 text-gray-400'
                          }`}
                          style={s === 'in_progress' ? { background: '#FFEB3C' } : {}}>
                          {s === 'completed' ? '✓' : s === 'in_progress' ? '▶' : '○'} T{t}
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Now: Term {currentTerm}</span>
                    <span className="text-xs font-black text-nb-green group-hover:underline">View Course →</span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* ── TERMS VIEW ── */}
      {view === 'terms' && selectedCourse && <TermsView
        course={selectedCourse}
        meta={SUBJECT_META[selectedCourse]}
        expandedTerm={expandedTerm}
        setExpandedTerm={setExpandedTerm}
        onBack={backToCourses}
        navigate={navigate}
        quizzes={quizzes}
      />}
    </div>
  )
}

function TermsView({ course, meta, expandedTerm, setExpandedTerm, onBack, navigate, quizzes }) {
  const forceOpenIds = useForceOpenIds()
  const courseLessons = ALL_LESSONS.filter(l => l.subject === course)
  const doneCount = courseLessons.filter(l => l.status === 'completed').length
  const subjPct   = Math.round((doneCount / courseLessons.length) * 100)
  const [takingQuiz, setTakingQuiz] = useState(null)

  if (takingQuiz) {
    return (
      <StudySet title={takingQuiz.title} subject={course} cards={takingQuiz.cards}
        deckKey={`quiz-${takingQuiz.id}`} onExit={() => setTakingQuiz(null)} />
    )
  }

  return (
    <>
      {/* Course header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-nb-dark transition px-3 py-2 rounded-xl hover:bg-gray-100">
          ← Courses
        </button>
        <div className="h-6 w-px bg-gray-200" />
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center p-2 flex-shrink-0"
               style={{ background: meta.color + '1A' }}>
            <img src={SUBJECT_ICON[course]} alt="" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-nb-dark">{course}</p>
            <p className="text-xs text-gray-400">{doneCount}/{courseLessons.length} lessons · {subjPct}% complete</p>
          </div>
        </div>
        {meta.sequential && (
          <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full flex-shrink-0">
            🔗 Sequential
          </span>
        )}
      </div>

      {/* Term accordions */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map(termNum => {
          const termLessons = courseLessons.filter(l => l.term === termNum)
          const status      = termStatus(termLessons)
          const isExpanded  = expandedTerm === termNum
          const doneInTerm  = termLessons.filter(l => l.status === 'completed').length
          const topic       = TERM_TOPIC[course]?.[termNum] || ''

          const borderCls =
            status === 'completed'   ? 'border-nb-green/40' :
            status === 'in_progress' ? 'border-nb-yellow'   :
            'border-gray-200'

          const headerBg =
            status === 'completed'   ? '#F0FDF4' :
            status === 'in_progress' ? '#FFFBEB'  :
            '#F9FAFB'

          const numStyle =
            status === 'completed'   ? { background: '#36913F', color: '#fff' }         :
            status === 'in_progress' ? { background: '#FFEB3C', color: '#1a1a1a' }      :
            { background: '#E5E7EB', color: '#9CA3AF' }

          const statusLabel =
            status === 'completed'   ? '✅ Completed'  :
            status === 'in_progress' ? '▶ In Progress' :
            <span className="inline-flex items-center gap-1"><img src={lockIcon} alt="" className="w-2.5 h-2.5 object-contain" /> Upcoming</span>

          const statusCls =
            status === 'completed'   ? 'bg-green-100 text-green-700' :
            status === 'in_progress' ? 'text-nb-dark'                :
            'bg-gray-100 text-gray-400'

          return (
            <div key={termNum}
              className={`rounded-2xl border-2 overflow-hidden transition-all ${borderCls}`}>

              <button
                onClick={() => setExpandedTerm(isExpanded ? null : termNum)}
                className="w-full flex items-center gap-3 p-4 text-left"
                style={{ background: headerBg }}>

                <div className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                     style={numStyle}>
                  {status === 'completed' ? '✓' : `T${termNum}`}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-black text-nb-dark text-sm">Term {termNum}
                    {topic && <span className="font-semibold text-gray-400 ml-1.5">— {topic}</span>}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{TERM_DATES[termNum]} · {termLessons.length} lessons</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full hidden sm:block ${statusCls}`}
                        style={status === 'in_progress' ? { background: '#FFEB3C' } : {}}>
                    {statusLabel}
                  </span>
                  <span className="text-xs font-semibold text-gray-400 tabular-nums">
                    {doneInTerm}/{termLessons.length}
                  </span>
                  <span className={`text-gray-400 text-lg transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>›</span>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t-2 border-gray-100 p-3 space-y-2.5 bg-white">
                  {termLessons.map(lesson => {
                    const baseLocked = LOCKED_IDS.has(lesson.id)
                    const forced = forceOpenIds.has(lesson.id)
                    const locked = baseLocked && !forced
                    const afterQuizzes = quizzes.filter(q => q.afterLessonId === lesson.id)
                    return (
                      <div key={lesson.id} className="space-y-2.5">
                        <LessonRow lesson={lesson} locked={locked} forceOpened={baseLocked && forced}
                          onClick={() => !locked && navigate(`/lessons/${lesson.id}`)} />
                        {afterQuizzes.map(q => (
                          <QuizRow key={q.id} quiz={q} onClick={() => setTakingQuiz(q)} />
                        ))}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

// Sits directly below the lesson it's pinned to (via afterLessonId) — this dashed/amber
// styling is deliberately distinct from LessonRow so it reads as "a quick check between
// classes" rather than another lesson in the sequence. No lock logic: quizzes are ungraded
// practice, never part of the sequential-unlock chain.
function QuizRow({ quiz, onClick }) {
  return (
    <div onClick={onClick}
      className="ml-4 sm:ml-6 bg-nb-cream/50 rounded-2xl border-2 border-dashed border-nb-yellow/70 p-3.5 flex items-center gap-3.5 hover:shadow-md hover:border-nb-yellow cursor-pointer group transition">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg" style={{ background: '#FFEB3C33' }}>🎯</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-black text-sm text-nb-dark group-hover:text-nb-green">{quiz.title}</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Ungraded</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{quiz.cardCount} card{quiz.cardCount === 1 ? '' : 's'} · quick practice between classes</p>
      </div>
      <span className="text-gray-300 text-lg group-hover:text-nb-green transition-colors">›</span>
    </div>
  )
}

function LessonRow({ lesson, locked, forceOpened, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border-2 p-4 flex items-center gap-4 transition relative
        ${locked
          ? 'border-gray-200 opacity-60 cursor-not-allowed'
          : 'border-nb-olive/20 hover:shadow-md hover:border-nb-green/40 cursor-pointer group'
        }`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm p-2 ${locked ? 'grayscale' : ''}`}
           style={{ background: '#FFF7E9' }}>
        {locked
          ? <img src={lockIcon} alt="" className="w-6 h-6 object-contain opacity-60" />
          : <img src={lesson.icon} alt="" className="w-full h-full object-contain" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className={`font-black text-sm sm:text-base transition-colors ${locked ? 'text-gray-400' : 'text-nb-dark group-hover:text-nb-green'}`}>
            {lesson.title}
          </p>
          {!locked && (
            <>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFF_COLOR[lesson.difficulty]}`}>
                {lesson.difficulty}
              </span>
              {forceOpened && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  🔓 Opened by teacher
                </span>
              )}
            </>
          )}
        </div>
        <p className="text-xs text-gray-400 line-clamp-1 leading-relaxed">
          {locked ? 'Complete the previous lesson to unlock this one.' : lesson.desc}
        </p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {!locked && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLOR[lesson.type]}`}>
              {TYPE_ICON[lesson.type]} {lesson.type}
            </span>
          )}
          <span className="text-[10px] text-gray-300 flex items-center gap-0.5"><img src={durationIcon} alt="" className="w-2.5 h-2.5 object-contain opacity-60" /> {lesson.duration}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1 ${locked ? 'bg-gray-100 text-gray-400' : STATUS_STYLE[lesson.status]}`}>
          {locked ? <><img src={lockIcon} alt="" className="w-2.5 h-2.5 object-contain" /> Locked</> : STATUS_LABEL[lesson.status]}
        </span>
        {!locked && <span className="text-gray-300 text-lg group-hover:text-nb-green transition-colors">›</span>}
      </div>
    </div>
  )
}
