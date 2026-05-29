import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoHorizontal from '../assets/Asset 1@3x.png'
import logoWhite from '../assets/Asset 1@3x 1_White.png'

const ALL_LESSONS = [
  // Mathematics
  { id: 1,  title: 'Addition & Subtraction',      subject: 'Mathematics', type: 'video',     status: 'completed',   duration: '12 min', icon: '🎬', difficulty: 'Easy',   desc: 'Master adding and subtracting numbers up to 100 using fun memory tricks!' },
  { id: 2,  title: 'Multiplication Tables',        subject: 'Mathematics', type: 'flashcard', status: 'completed',   duration: '10 min', icon: '🃏', difficulty: 'Easy',   desc: 'Flip your way through times tables 1–12 with our visual memory cards.' },
  { id: 3,  title: 'Fractions Basics',             subject: 'Mathematics', type: 'quiz',      status: 'in_progress', duration: '15 min', icon: '📝', difficulty: 'Medium', desc: 'Learn numerators, denominators and simple fractions with pizza examples!' },
  { id: 11, title: 'Division for Beginners',       subject: 'Mathematics', type: 'video',     status: 'pending',     duration: '14 min', icon: '🎬', difficulty: 'Easy',   desc: 'Sharing equally — understand division through real-life situations.' },
  { id: 12, title: 'Place Value & Digits',         subject: 'Mathematics', type: 'flashcard', status: 'pending',     duration: '12 min', icon: '🃏', difficulty: 'Easy',   desc: 'Hundreds, tens, ones — know exactly what each digit means!' },
  { id: 13, title: 'Geometry: Shapes',             subject: 'Mathematics', type: 'activity',  status: 'pending',     duration: '18 min', icon: '🎨', difficulty: 'Medium', desc: 'Identify 2D & 3D shapes and their properties through interactive drawing.' },
  { id: 14, title: 'Word Problems Challenge',      subject: 'Mathematics', type: 'quiz',      status: 'pending',     duration: '20 min', icon: '📝', difficulty: 'Hard',   desc: 'Apply maths to real-world problems. Think like a mathematician!' },

  // English
  { id: 4,  title: 'Alphabet Flash Cards',         subject: 'English',     type: 'flashcard', status: 'in_progress', duration: '8 min',  icon: '🃏', difficulty: 'Easy',   desc: 'Review all 26 letters with pictures and phonics memory cues.' },
  { id: 5,  title: 'Reading Comprehension',        subject: 'English',     type: 'reading',   status: 'pending',     duration: '20 min', icon: '📄', difficulty: 'Medium', desc: 'Read a short story then answer questions to check your understanding.' },
  { id: 6,  title: 'Grammar: Tenses',              subject: 'English',     type: 'quiz',      status: 'pending',     duration: '15 min', icon: '📝', difficulty: 'Medium', desc: 'Past, present and future tense — learn the rules with colourful examples!' },
  { id: 15, title: 'Spelling Bee — Level 1',       subject: 'English',     type: 'quiz',      status: 'pending',     duration: '10 min', icon: '📝', difficulty: 'Easy',   desc: 'Spell 20 common words correctly using the Neurobix memory method.' },
  { id: 16, title: 'Vocabulary Builder',           subject: 'English',     type: 'flashcard', status: 'pending',     duration: '12 min', icon: '🃏', difficulty: 'Medium', desc: 'Expand your word bank with 30 new words and their meanings.' },
  { id: 17, title: 'Creative Writing Starter',     subject: 'English',     type: 'activity',  status: 'pending',     duration: '25 min', icon: '🎨', difficulty: 'Medium', desc: 'Use story prompts and mind maps to write your own short story!' },

  // Science
  { id: 7,  title: 'The Solar System',             subject: 'Science',     type: 'video',     status: 'in_progress', duration: '18 min', icon: '🎬', difficulty: 'Easy',   desc: 'Journey through the 8 planets using the mnemonic "My Very Educated Mother".' },
  { id: 8,  title: 'Plants & Photosynthesis',      subject: 'Science',     type: 'reading',   status: 'pending',     duration: '14 min', icon: '📄', difficulty: 'Medium', desc: 'Discover how plants turn sunlight into food — nature\'s own factory!' },
  { id: 18, title: 'The Human Body',               subject: 'Science',     type: 'flashcard', status: 'pending',     duration: '16 min', icon: '🃏', difficulty: 'Medium', desc: 'Learn the major organs and their functions with labelled flash cards.' },
  { id: 19, title: 'Forces & Motion',              subject: 'Science',     type: 'video',     status: 'pending',     duration: '15 min', icon: '🎬', difficulty: 'Medium', desc: 'Push, pull, gravity — understand forces through fun experiments!' },
  { id: 20, title: 'States of Matter',             subject: 'Science',     type: 'quiz',      status: 'pending',     duration: '12 min', icon: '📝', difficulty: 'Easy',   desc: 'Solid, liquid, gas — quiz yourself on how matter changes state.' },
  { id: 21, title: 'Food Chains & Ecosystems',     subject: 'Science',     type: 'activity',  status: 'pending',     duration: '20 min', icon: '🎨', difficulty: 'Hard',   desc: 'Build your own food chain and understand how ecosystems balance.' },

]

const SUBJECTS = ['All', 'Mathematics', 'English', 'Science']
const TYPES    = ['All', 'video', 'flashcard', 'quiz', 'reading', 'activity']

const STATUS_STYLE = {
  completed:   'bg-green-100 text-green-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  pending:     'bg-gray-100 text-gray-500',
}
const STATUS_LABEL = {
  completed:   '✅ Done',
  in_progress: '▶️ Continue',
  pending:     '🔒 Start',
}
const DIFF_COLOR = {
  Easy:   'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard:   'bg-red-100 text-red-600',
}
const TYPE_COLOR = {
  video:     'bg-blue-100 text-blue-700',
  flashcard: 'bg-purple-100 text-purple-700',
  quiz:      'bg-orange-100 text-orange-700',
  reading:   'bg-nb-cream text-nb-dark border border-nb-olive/30',
  activity:  'bg-pink-100 text-pink-700',
}
const TYPE_ICON = { video:'🎬', flashcard:'🃏', quiz:'📝', reading:'📄', activity:'🎨' }

const SUBJECT_META = {
  Mathematics: { emoji: '🔢', color: 'from-blue-400 to-blue-600',    sequential: true  },
  English:     { emoji: '📖', color: 'from-purple-400 to-purple-600', sequential: false },
  Science:     { emoji: '🔬', color: 'from-nb-lime to-nb-dark',       sequential: false },
}

// Returns a Set of lesson IDs that are locked.
// Mathematics only: a lesson is locked if the immediately previous Math lesson
// is not completed (lock propagates forward through the chain).
function computeLockedIds(lessons) {
  const mathLessons = lessons.filter(l => l.subject === 'Mathematics')
  const lockedIds = new Set()
  for (let i = 1; i < mathLessons.length; i++) {
    const prev = mathLessons[i - 1]
    if (prev.status !== 'completed' || lockedIds.has(prev.id)) {
      lockedIds.add(mathLessons[i].id)
    }
  }
  return lockedIds
}

export const LOCKED_IDS = computeLockedIds(ALL_LESSONS)

export default function LessonsPage() {
  const navigate = useNavigate()
  const [subject, setSubject] = useState('All')
  const [type, setType]       = useState('All')
  const [search, setSearch]   = useState('')
  const [view, setView]       = useState('grid') // 'grid' | 'list'

  const lessons = ALL_LESSONS.filter(l =>
    (subject === 'All' || l.subject === subject) &&
    (type    === 'All' || l.type    === type)    &&
    l.title.toLowerCase().includes(search.toLowerCase())
  )

  const done  = ALL_LESSONS.filter(l => l.status === 'completed').length
  const inProg = ALL_LESSONS.filter(l => l.status === 'in_progress').length
  const pct   = Math.round((done / ALL_LESSONS.length) * 100)

  return (
    <div className="min-h-screen bg-nb-cream">
      {/* Header */}
      <div className="bg-white border-b-2 border-nb-olive/20 shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/student')} className="text-gray-400 hover:text-nb-green text-2xl font-bold leading-none">←</button>
            <img src={logoHorizontal} alt="Neurobix Method" className="h-8 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="hidden sm:flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-nb-olive/30">
              <span className="font-black text-nb-green">{done}/{ALL_LESSONS.length}</span>
              <span className="text-xs text-gray-400">completed</span>
            </div>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button onClick={() => setView('grid')} className={`px-3 py-1.5 text-xs font-bold transition ${view==='grid' ? 'text-nb-dark' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
                      style={view==='grid' ? { background: '#FFEB3C' } : {}}>⊞</button>
              <button onClick={() => setView('list')} className={`px-3 py-1.5 text-xs font-bold transition ${view==='list' ? 'text-nb-dark' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
                      style={view==='list' ? { background: '#FFEB3C' } : {}}>☰</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">

        {/* Progress Banner */}
        <div className="rounded-3xl p-6 text-white shadow-xl relative overflow-hidden"
             style={{ background: 'linear-gradient(135deg,#6FC911,#396336)' }}>
          <img src={logoWhite} alt="" className="absolute -right-2 -top-2 h-24 w-auto opacity-20 select-none pointer-events-none" />
          <div className="relative flex items-end justify-between mb-3">
            <div>
              <p className="text-green-200 text-sm font-semibold">Overall Progress</p>
              <p className="text-4xl font-black">{pct}% Done! 🎯</p>
            </div>
            <div className="text-right text-sm text-green-200 hidden sm:block">
              <p>✅ {done} completed</p>
              <p>▶️ {inProg} in progress</p>
              <p>🔒 {ALL_LESSONS.length - done - inProg} remaining</p>
            </div>
          </div>
          <div className="h-4 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-green-100 text-xs mt-2">{ALL_LESSONS.length - done} lessons left to complete the full curriculum</p>
        </div>

        {/* Subject cards (quick filter) */}
        <div className="grid grid-cols-4 gap-3">
          {Object.entries(SUBJECT_META).map(([name, meta]) => {
            const count = ALL_LESSONS.filter(l => l.subject === name && l.status === 'completed').length
            const total = ALL_LESSONS.filter(l => l.subject === name).length
            return (
              <button key={name} onClick={() => setSubject(subject === name ? 'All' : name)}
                className={`bg-white rounded-2xl p-3 text-center border-2 transition-all hover:shadow-md relative ${subject === name ? 'border-nb-green shadow-md scale-[1.03]' : 'border-nb-olive/20'}`}>
                {meta.sequential && (
                  <span className="absolute -top-1.5 -right-1.5 bg-nb-dark text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-tight">
                    Sequential
                  </span>
                )}
                <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center text-xl mb-2 bg-gradient-to-br ${meta.color} shadow-sm`}>
                  {meta.emoji}
                </div>
                <p className="text-[11px] font-black text-nb-dark leading-tight">{name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{count}/{total}</p>
              </button>
            )
          })}
        </div>

        {/* Search + Type Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search lessons..."
            className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-nb-olive/20 focus:outline-none focus:border-nb-green bg-white text-sm font-medium"
          />
          <div className="flex gap-1.5 flex-wrap">
            {TYPES.map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border-2 whitespace-nowrap transition-all ${type === t ? 'text-nb-dark border-nb-yellow' : 'bg-white border-gray-200 text-gray-500 hover:border-nb-olive'}`}
                style={type === t ? { background: '#FFEB3C' } : {}}>
                {t === 'All' ? '🗂 All' : `${TYPE_ICON[t]} ${t}`}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <p className="text-sm text-gray-400 font-medium">{lessons.length} lesson{lessons.length !== 1 ? 's' : ''} found</p>

        {/* Sequential notice when Mathematics is filtered */}
        {subject === 'Mathematics' && (
          <div className="flex items-start gap-3 rounded-2xl p-4 border-2 border-nb-dark/30"
               style={{ background: '#396336' + '15' }}>
            <span className="text-xl flex-shrink-0">🔗</span>
            <div>
              <p className="font-black text-nb-dark text-sm">Sequential Learning — Mathematics</p>
              <p className="text-xs text-gray-600 mt-0.5">
                Each lesson must be completed before the next one unlocks. Complete <strong>Fractions Basics</strong> to continue.
              </p>
            </div>
          </div>
        )}

        {/* Lesson Grid */}
        {view === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map(lesson => {
              const locked = LOCKED_IDS.has(lesson.id)
              return (
                <LessonCard key={lesson.id} lesson={lesson} locked={locked}
                  onClick={() => !locked && navigate(`/lessons/${lesson.id}`)} />
              )
            })}
          </div>
        ) : (
          <div className="space-y-2.5">
            {lessons.map(lesson => {
              const locked = LOCKED_IDS.has(lesson.id)
              return (
                <LessonRow key={lesson.id} lesson={lesson} locked={locked}
                  onClick={() => !locked && navigate(`/lessons/${lesson.id}`)} />
              )
            })}
          </div>
        )}

        {lessons.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-3">🔍</div>
            <p className="font-bold text-lg">No lessons found</p>
            <p className="text-sm mt-1">Try a different subject or search term</p>
          </div>
        )}
      </div>
    </div>
  )
}

function LessonCard({ lesson, locked, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border-2 overflow-hidden transition-all relative
        ${locked
          ? 'border-gray-200 opacity-60 cursor-not-allowed'
          : 'border-nb-olive/20 hover:shadow-lg hover:border-nb-green/40 hover:-translate-y-0.5 cursor-pointer group'
        }`}
    >
      {/* Top colour strip */}
      <div className="h-2 w-full" style={{
        background: locked                          ? '#e5e7eb' :
                    lesson.status === 'completed'   ? 'linear-gradient(90deg,#6FC911,#36913F)' :
                    lesson.status === 'in_progress' ? 'linear-gradient(90deg,#FFEB3C,#91BA4F)' : '#e5e7eb'
      }} />

      {/* Lock overlay badge */}
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-white/90 rounded-2xl px-4 py-3 flex flex-col items-center gap-1 shadow-md border border-gray-200">
            <span className="text-3xl">🔒</span>
            <p className="text-xs font-black text-gray-500">Complete previous lesson</p>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0 ${locked ? 'grayscale' : ''}`}
               style={{ background: '#FFF7E9' }}>
            {lesson.icon}
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${locked ? 'bg-gray-100 text-gray-400' : STATUS_STYLE[lesson.status]}`}>
            {locked ? '🔒 Locked' : STATUS_LABEL[lesson.status]}
          </span>
        </div>
        <h3 className={`font-black text-sm leading-snug transition-colors ${locked ? 'text-gray-400' : 'text-nb-dark group-hover:text-nb-green'}`}>
          {lesson.title}
        </h3>
        <p className="text-xs text-gray-300 mt-1.5 line-clamp-2 leading-relaxed">{locked ? 'Complete the previous lesson to unlock this one.' : lesson.desc}</p>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${locked ? 'bg-gray-100 text-gray-400' : TYPE_COLOR[lesson.type]}`}>
            {TYPE_ICON[lesson.type]} {lesson.type}
          </span>
          {!locked && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFF_COLOR[lesson.difficulty]}`}>
              {lesson.difficulty}
            </span>
          )}
          <span className="text-[10px] text-gray-300 ml-auto">⏱ {lesson.duration}</span>
        </div>
      </div>
    </div>
  )
}

function LessonRow({ lesson, locked, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border-2 p-4 flex items-center gap-4 transition relative
        ${locked
          ? 'border-gray-200 opacity-60 cursor-not-allowed'
          : 'border-nb-olive/20 hover:shadow-md hover:border-nb-green/40 cursor-pointer group'
        }`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm ${locked ? 'grayscale' : ''}`}
           style={{ background: '#FFF7E9' }}>
        {locked ? '🔒' : lesson.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-black text-sm truncate transition-colors ${locked ? 'text-gray-400' : 'text-nb-dark group-hover:text-nb-green'}`}>
          {lesson.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-xs text-gray-400">{lesson.subject}</span>
          {!locked && (
            <>
              <span className="text-gray-200">·</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLOR[lesson.type]}`}>
                {TYPE_ICON[lesson.type]} {lesson.type}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFF_COLOR[lesson.difficulty]}`}>
                {lesson.difficulty}
              </span>
            </>
          )}
          {locked && <span className="text-xs text-gray-400">Complete previous lesson to unlock</span>}
          <span className="text-[10px] text-gray-400">⏱ {lesson.duration}</span>
        </div>
      </div>
      <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 ${locked ? 'bg-gray-100 text-gray-400' : STATUS_STYLE[lesson.status]}`}>
        {locked ? '🔒 Locked' : STATUS_LABEL[lesson.status]}
      </span>
    </div>
  )
}
