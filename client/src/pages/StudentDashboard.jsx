import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoHorizontal from '../assets/Asset 1@3x.png'
import logoWhite from '../assets/Asset 1@3x 1_White.png'

const SUBJECTS = [
  { id: 1, name: 'Mathematics', icon: '🔢', color: '#3b82f6', progress: 72, lessons: 14, completed: 10 },
  { id: 2, name: 'English',     icon: '📖', color: '#9333ea', progress: 55, lessons: 12, completed: 6  },
  { id: 3, name: 'Science',     icon: '🔬', color: '#36913F', progress: 40, lessons: 10, completed: 4  },
]

const RECENT_LESSONS = [
  { id: 1, title: 'Addition & Subtraction', subject: 'Mathematics', status: 'completed',   icon: '🎬' },
  { id: 3, title: 'Fractions Basics',       subject: 'Mathematics', status: 'in_progress', icon: '📝' },
  { id: 4, title: 'Alphabet Flash Cards',   subject: 'English',     status: 'in_progress', icon: '🃏' },
  { id: 7, title: 'The Solar System',       subject: 'Science',     status: 'in_progress', icon: '🎬' },
  { id: 2, title: 'Reading Comprehension',  subject: 'English',     status: 'overdue',     icon: '📄' },
]

const BADGES = [
  { icon: '⭐', label: 'Star Learner',  earned: true  },
  { icon: '🏆', label: 'Quiz Champ',    earned: true  },
  { icon: '🔥', label: '7-Day Streak',  earned: true  },
  { icon: '🧠', label: 'Memory Master', earned: false },
  { icon: '📚', label: 'Bookworm',      earned: false },
  { icon: '🚀', label: 'Fast Finisher', earned: false },
]

const STATUS_STYLE = {
  completed:   'bg-green-100 text-green-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  pending:     'bg-gray-100 text-gray-400',
  overdue:     'bg-red-100 text-red-600',
}
const STATUS_LABEL = {
  completed:   '✅ Done',
  in_progress: '▶ Continue',
  pending:     '🔒 Locked',
  overdue:     '⚠️ Overdue',
}

const TABS = [
  { id: 'home',       icon: '🏠', label: 'Home'       },
  { id: 'lessons',    icon: '📚', label: 'Lessons'    },
  { id: 'flashcards', icon: '🃏', label: 'Flash Cards' },
  { id: 'quizzes',    icon: '📝', label: 'Quizzes'    },
  { id: 'schedule',   icon: '📅', label: 'Schedule'   },
  { id: 'rewards',    icon: '🏆', label: 'Rewards'    },
]

const OPEN_CLASSES = [
  { id: 10, name: 'Extra Math Practice',   subject: 'Mathematics', level: 'Year 4', slots: 12, enrolled: false },
  { id: 11, name: 'English Writing Club',  subject: 'English',     level: 'Year 3–5', slots: 8, enrolled: false },
  { id: 12, name: 'Science Explorers',     subject: 'Science',     level: 'Year 4–6', slots: 15, enrolled: true  },
]

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('home')
  const [certModal, setCertModal] = useState(null)
  const [openClasses, setOpenClasses] = useState(OPEN_CLASSES)

  return (
    <div className="min-h-screen bg-nb-cream flex flex-col">

      {/* ── Top bar ── */}
      <header className="bg-white border-b border-nb-olive/20 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-13 flex items-center justify-between gap-2">
          <img src={logoHorizontal} alt="Neurobix Method" className="h-7 sm:h-8 w-auto object-contain flex-shrink-0" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-nb-dark bg-nb-yellow px-2 py-0.5 rounded-full whitespace-nowrap">⭐ 1,240</span>
            <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-nb-dark text-xs flex-shrink-0"
                 style={{ background: '#FFEB3C' }}>AH</div>
            <button onClick={() => navigate('/login')} className="text-xs text-gray-400 hover:text-red-400 whitespace-nowrap">Logout</button>
          </div>
        </div>

        {/* Tab bar — scrollable on mobile */}
        <div className="max-w-5xl mx-auto border-t border-gray-100 flex overflow-x-auto scrollbar-hide">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-shrink-0 flex flex-col items-center py-2 gap-0.5 text-[10px] sm:text-xs font-bold transition-colors border-b-2 px-3 sm:px-0 sm:flex-1 ${
                tab === t.id ? 'border-nb-green text-nb-green' : 'border-transparent text-gray-400 hover:text-nb-dark'
              }`}>
              <span className="text-lg sm:text-xl leading-none">{t.icon}</span>
              <span className="leading-none whitespace-nowrap">{t.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">

        {/* ── HOME ── */}
        {tab === 'home' && (
          <div className="space-y-6">

            {/* Welcome banner */}
            <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white relative overflow-hidden shadow-xl"
                 style={{ background: 'linear-gradient(135deg,#6FC911 0%,#396336 100%)' }}>
              <img src={logoWhite} alt=""
                   className="absolute -right-4 -top-4 h-32 sm:h-40 opacity-10 pointer-events-none select-none" />
              <div className="relative">
                <p className="text-green-200 font-semibold text-sm">Welcome back 👋</p>
                <h1 className="text-2xl sm:text-3xl font-black mt-1">Hello, Ahmad!</h1>
                <p className="text-green-100 text-sm mt-1">🔥 7-day streak — you're on fire!</p>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {[['10','Lessons'],['7 🔥','Streak'],['3','Badges'],['1,240⭐','Points']].map(([v,l]) => (
                    <div key={l} className="bg-white/20 rounded-xl px-2 py-2 text-center backdrop-blur-sm">
                      <p className="text-base sm:text-xl font-black leading-none">{v}</p>
                      <p className="text-[10px] sm:text-[11px] text-green-200 mt-0.5">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subjects */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg sm:text-xl font-black text-nb-dark">📚 My Subjects</h2>
                <button onClick={() => navigate('/lessons')} className="text-sm font-bold text-nb-green hover:text-nb-dark transition">View all →</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SUBJECTS.map(s => (
                  <div key={s.id} onClick={() => navigate('/lessons')}
                    className="bg-white rounded-2xl border-2 border-nb-olive/20 p-4 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 sm:mb-3 shadow-sm"
                         style={{ background: s.color + '18' }}>{s.icon}</div>
                    <div className="flex-1 min-w-0 sm:w-full">
                      <p className="font-black text-nb-dark text-sm sm:text-base">{s.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 sm:mt-1">{s.completed}/{s.lessons} lessons done</p>
                      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${s.progress}%`, background: s.color }} />
                      </div>
                    </div>
                    <p className="text-sm font-black flex-shrink-0 sm:mt-1.5" style={{ color: s.color }}>{s.progress}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Learning + Tip side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Continue learning — takes 2/3 */}
              <div className="lg:col-span-2">
                <h2 className="text-lg sm:text-xl font-black text-nb-dark mb-3">▶️ Continue Learning</h2>
                <div className="space-y-2.5">
                  {RECENT_LESSONS.map(l => (
                    <div key={l.id} onClick={() => navigate(`/lessons/${l.id}`)}
                      className="bg-white rounded-2xl border-2 border-nb-olive/20 p-3 sm:p-4 flex items-center gap-3 hover:shadow-md hover:border-nb-green/40 hover:-translate-y-0.5 transition-all cursor-pointer">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0"
                           style={{ background: '#FFF7E9' }}>{l.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-nb-dark text-sm truncate">{l.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{l.subject}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 sm:px-3 py-1 rounded-full flex-shrink-0 ${STATUS_STYLE[l.status]}`}>
                        {STATUS_LABEL[l.status]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 1/3: tip + streak stacked */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="bg-white rounded-2xl border-2 border-nb-yellow p-4"
                     style={{ background: 'linear-gradient(135deg,#FFEB3C15,#ffffff)' }}>
                  <p className="text-2xl mb-1">💡</p>
                  <p className="font-black text-nb-dark text-sm">Memory Tip</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                    Use the <strong>Story Method</strong> — turn facts into a funny story. Silly stories stick! 🧠
                  </p>
                </div>
                <div className="bg-white rounded-2xl border border-nb-olive/20 p-4 text-center">
                  <p className="text-3xl mb-1">🔥</p>
                  <p className="text-2xl font-black text-nb-dark">7 Days</p>
                  <p className="text-xs text-gray-400 mt-1">Learning Streak</p>
                  <p className="text-xs font-bold mt-1" style={{ color: '#36913F' }}>Don't break it!</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── LESSONS ── */}
        {tab === 'lessons' && (
          <div className="space-y-5">
            <h2 className="text-xl sm:text-2xl font-black text-nb-dark">📚 My Lessons</h2>
            <div className="grid grid-cols-1 gap-3">
              {RECENT_LESSONS.map(l => (
                <div key={l.id} onClick={() => navigate(`/lessons/${l.id}`)}
                  className="bg-white rounded-2xl border-2 border-nb-olive/20 p-4 flex items-center gap-3 hover:shadow-lg hover:border-nb-green/40 hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow"
                       style={{ background: '#FFF7E9' }}>{l.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-nb-dark text-sm truncate">{l.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{l.subject}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1.5 rounded-full flex-shrink-0 ${STATUS_STYLE[l.status]}`}>
                    {STATUS_LABEL[l.status]}
                  </span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/lessons')}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-nb-olive/40 text-nb-green font-bold hover:border-nb-green hover:bg-white transition text-base">
              Browse All Lessons →
            </button>

            {/* Open / Extra Classes — self-enrol */}
            <div>
              <div className="mb-3">
                <h3 className="text-base sm:text-lg font-black text-nb-dark">🏫 Open Classes — Browse &amp; Enrol</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">No lesson sequence — access any lesson freely</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {openClasses.map(c => (
                  <div key={c.id} className={`bg-white rounded-2xl border-2 p-5 ${c.enrolled ? 'border-nb-green' : 'border-nb-olive/20'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                           style={{ background: '#FFF7E9' }}>📚</div>
                      {c.enrolled && <span className="text-[10px] font-black bg-nb-green text-white px-2 py-1 rounded-full">✓ Enrolled</span>}
                    </div>
                    <p className="font-black text-nb-dark text-sm mt-2">{c.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.subject} · {c.level}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.slots} slots available</p>
                    <button
                      onClick={() => setOpenClasses(prev => prev.map(x => x.id === c.id ? { ...x, enrolled: !x.enrolled } : x))}
                      className={`w-full mt-3 py-2.5 rounded-xl font-black text-sm transition ${
                        c.enrolled
                          ? 'border-2 border-red-200 text-red-500 hover:bg-red-50'
                          : 'text-nb-dark shadow hover:shadow-md'
                      }`}
                      style={c.enrolled ? {} : { background: '#FFEB3C' }}>
                      {c.enrolled ? 'Leave Class' : 'Join Class →'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── FLASH CARDS ── */}
        {tab === 'flashcards' && <FlashCardsView />}

        {/* ── QUIZZES ── */}
        {tab === 'quizzes' && <QuizzesView />}

        {/* ── SCHEDULE ── */}
        {tab === 'schedule' && <ScheduleView navigate={navigate} />}

        {/* ── REWARDS ── */}
        {tab === 'rewards' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-nb-dark">🏆 My Rewards</h2>

            {/* Points banner */}
            <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl"
                 style={{ background: 'linear-gradient(135deg,#FFEB3C,#91BA4F)' }}>
              <p className="text-nb-dark/60 font-semibold text-sm">Total Points Earned</p>
              <p className="text-4xl sm:text-5xl font-black text-nb-dark mt-1">1,240 ⭐</p>
              <div className="mt-4 h-3 bg-white/40 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '82%' }} />
              </div>
              <p className="text-nb-dark/60 text-sm mt-1.5">Only 260 pts away from the next badge!</p>
            </div>

            {/* Certificates of Completion */}
            <div className="bg-white rounded-2xl border-2 border-nb-olive/20 p-4 sm:p-5">
              <h3 className="text-base sm:text-lg font-black text-nb-dark mb-4">🎓 Certificates of Completion</h3>
              <div className="space-y-3">
                <div className="bg-nb-cream rounded-2xl p-4 border-2 border-nb-yellow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0"
                         style={{ background: '#FFEB3C' }}>🏆</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-nb-dark text-sm">Mathematics — Primary 4</p>
                      <p className="text-xs text-gray-400 mt-0.5">All 14 lessons · All quizzes passed · Issued 2025-05-10</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setCertModal('Mathematics')}
                      className="flex-1 py-2 rounded-xl font-bold text-nb-green border-2 border-nb-green/30 text-xs hover:bg-nb-green hover:text-white transition">
                      👁 Preview
                    </button>
                    <button className="flex-1 py-2 rounded-xl font-black text-nb-dark text-xs shadow"
                            style={{ background: '#FFEB3C' }}>⬇ PDF</button>
                  </div>
                </div>
                {[{name:'English', pct:55, done:6, total:12}, {name:'Science', pct:40, done:4, total:10}].map(s => (
                  <div key={s.name} className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200 opacity-60">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-xl flex-shrink-0">🔒</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-gray-500 text-sm">{s.name} Certificate</p>
                        <p className="text-xs text-gray-400 mt-0.5">{s.done}/{s.total} lessons · {s.pct}% complete</p>
                      </div>
                      <span className="text-xs font-bold text-gray-400 flex-shrink-0">In progress…</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gray-400" style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Badges */}
              <div>
                <h3 className="text-base sm:text-lg font-black text-nb-dark mb-3">🎖️ Badges</h3>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {BADGES.map(b => (
                    <div key={b.label}
                      className={`rounded-2xl p-3 text-center border-2 transition-all ${b.earned ? 'bg-white border-nb-yellow shadow-md hover:scale-105' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
                      <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">{b.icon}</div>
                      <p className="text-[10px] sm:text-xs font-black text-gray-700 leading-tight">{b.label}</p>
                      {!b.earned && <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">🔒 Locked</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject progress */}
              <div>
                <h3 className="text-lg font-black text-nb-dark mb-3">📊 Subject Progress</h3>
                <div className="space-y-3">
                  {SUBJECTS.map(s => (
                    <div key={s.id} className="bg-white rounded-2xl p-5 border-2 border-nb-olive/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-nb-dark">{s.icon} {s.name}</span>
                        <span className="font-black text-base" style={{ color: s.color }}>{s.progress}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${s.progress}%`, background: s.color }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5">{s.completed}/{s.lessons} lessons complete</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* ── Certificate Preview Modal ── */}
      {certModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
             style={{ background: 'rgba(0,0,0,0.6)' }}
             onClick={e => e.target === e.currentTarget && setCertModal(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-xl overflow-hidden">
            {/* Certificate */}
            <div className="relative p-6 sm:p-10 text-center"
                 style={{ background: 'linear-gradient(135deg,#396336 0%,#36913F 50%,#6FC911 100%)' }}>
              <div className="absolute inset-0 opacity-5 flex items-center justify-center text-[120px] sm:text-[200px] font-black select-none pointer-events-none">
                NM
              </div>
              <div className="relative">
                <p className="text-nb-yellow font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-3">Certificate of Completion</p>
                <p className="text-white/80 text-xs sm:text-sm mb-1">This certifies that</p>
                <p className="text-2xl sm:text-4xl font-black text-white mb-2">Ahmad bin Hassan</p>
                <p className="text-white/80 text-xs sm:text-sm mb-1">has successfully completed</p>
                <p className="text-lg sm:text-2xl font-black text-nb-yellow mb-1">{certModal}</p>
                <p className="text-white/70 text-xs sm:text-sm mb-4">Primary 4 · All lessons completed · All quizzes passed</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-6 text-xs text-white/60">
                  <span>📅 Issued: 2025-05-10</span>
                  <span>🏫 Neurobix Method</span>
                  <span>🔒 Cert #NM-2025-0041</span>
                </div>
              </div>
            </div>
            <div className="p-4 flex gap-3">
              <button onClick={() => setCertModal(null)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm">
                Close
              </button>
              <button className="flex-1 py-3 rounded-xl font-black text-nb-dark text-sm shadow-md"
                      style={{ background: '#FFEB3C' }}>
                ⬇ Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Schedule ─── */
function ScheduleView({ navigate }) {
  const SCHEDULE = [
    { id: 3,  title: 'Fractions Basics',       subject: 'Mathematics', type: 'quiz',      status: 'in_progress', deadline: '2026-05-25', icon: '📝', class: 'Primary 4A' },
    { id: 2,  title: 'Reading Comprehension',  subject: 'English',     type: 'reading',   status: 'overdue',     deadline: '2026-05-20', icon: '📄', class: 'Primary 4A' },
    { id: 7,  title: 'The Solar System',       subject: 'Science',     type: 'video',     status: 'in_progress', deadline: '2026-05-28', icon: '🎬', class: 'Primary 4A' },
    { id: 19, title: 'Forces & Motion',        subject: 'Science',     type: 'video',     status: 'pending',     deadline: '2026-06-01', icon: '🎬', class: 'Primary 4A', releaseDate: '2026-05-24' },
    { id: 20, title: 'States of Matter',       subject: 'Science',     type: 'quiz',      status: 'pending',     deadline: '2026-06-05', icon: '📝', class: 'Primary 4A', releaseDate: '2026-05-27' },
    { id: 6,  title: 'Grammar: Tenses',        subject: 'English',     type: 'quiz',      status: 'pending',     deadline: '2026-05-30', icon: '📝', class: 'Primary 4A' },
    { id: 4,  title: 'Alphabet Flash Cards',   subject: 'English',     type: 'flashcard', status: 'in_progress', deadline: null,         icon: '🃏', class: 'Primary 4A' },
  ]

  const today = new Date('2026-05-22')

  function daysLeft(deadline) {
    if (!deadline) return null
    const diff = Math.round((new Date(deadline) - today) / (1000 * 60 * 60 * 24))
    return diff
  }

  const STATUS_STYLE = {
    completed:   'bg-green-100 text-green-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    pending:     'bg-gray-100 text-gray-400',
    overdue:     'bg-red-100 text-red-600',
    locked:      'bg-gray-100 text-gray-400',
  }
  const STATUS_LABEL = {
    completed:   '✅ Done',
    in_progress: '▶ In Progress',
    pending:     '🔒 Upcoming',
    overdue:     '⚠️ Overdue',
  }

  const overdue  = SCHEDULE.filter(l => l.status === 'overdue')
  const active   = SCHEDULE.filter(l => l.status === 'in_progress')
  const upcoming = SCHEDULE.filter(l => l.status === 'pending').sort((a, b) => (a.deadline || 'z').localeCompare(b.deadline || 'z'))

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-nb-dark">📅 My Schedule</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: 'In Progress', value: active.length,   bg: 'bg-yellow-50',  text: 'text-yellow-700', icon: '▶' },
          { label: 'Overdue',     value: overdue.length,  bg: 'bg-red-50',     text: 'text-red-600',    icon: '⚠️' },
          { label: 'Upcoming',    value: upcoming.length, bg: 'bg-blue-50',    text: 'text-blue-700',   icon: '📅' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-3 border border-nb-olive/20 text-center`}>
            <p className="text-xl mb-0.5">{s.icon}</p>
            <p className={`text-2xl sm:text-3xl font-black ${s.text}`}>{s.value}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Overdue alert */}
      {overdue.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
          <h3 className="font-black text-red-700 mb-3">⚠️ Overdue — Action Required</h3>
          <div className="space-y-2.5">
            {overdue.map(l => (
              <div key={l.id} onClick={() => navigate(`/lessons/${l.id}`)}
                className="bg-white rounded-xl p-3.5 flex items-center justify-between cursor-pointer hover:shadow-md transition border-2 border-red-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-red-50">{l.icon}</div>
                  <div>
                    <p className="font-bold text-nb-dark text-sm">{l.title}</p>
                    <p className="text-xs text-gray-400">{l.subject}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-black text-red-600 bg-red-100 px-2.5 py-1 rounded-full block">Due {l.deadline}</span>
                  <span className="text-xs font-black text-red-500 mt-1 block">{Math.abs(daysLeft(l.deadline))} days overdue</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In Progress */}
      {active.length > 0 && (
        <div>
          <h3 className="text-lg font-black text-nb-dark mb-3">▶ Continue Where You Left Off</h3>
          <div className="space-y-2.5">
            {active.map(l => {
              const days = daysLeft(l.deadline)
              return (
                <div key={l.id} onClick={() => navigate(`/lessons/${l.id}`)}
                  className="bg-white rounded-2xl border-2 border-nb-yellow p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-nb-cream">{l.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-nb-dark truncate">{l.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{l.subject} · {l.class}</p>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-1">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full block ${STATUS_STYLE.in_progress}`}>▶ In Progress</span>
                    {l.deadline && (
                      <span className={`text-xs font-bold block ${days !== null && days <= 3 ? 'text-amber-600' : 'text-gray-400'}`}>
                        {days !== null && days <= 3 ? `⏰ ${days}d left` : `Due ${l.deadline}`}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-lg font-black text-nb-dark mb-3">📋 Upcoming Lessons</h3>
          <div className="space-y-2.5">
            {upcoming.map(l => {
              const days = daysLeft(l.deadline)
              return (
                <div key={l.id}
                  className="bg-white rounded-2xl border-2 border-nb-olive/20 p-4 flex items-center gap-4 opacity-80">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-gray-50">{l.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-nb-dark truncate">{l.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{l.subject}</p>
                    {l.releaseDate && <p className="text-xs text-blue-500 font-bold mt-0.5">📅 Releases {l.releaseDate}</p>}
                  </div>
                  <div className="text-right flex-shrink-0 space-y-1">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full block bg-gray-100 text-gray-400">🔒 Not yet</span>
                    {l.deadline && (
                      <span className={`text-xs font-bold block ${days !== null && days <= 3 ? 'text-amber-600' : 'text-gray-400'}`}>
                        Due {l.deadline}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Neurobix tip */}
      <div className="rounded-2xl p-4 border-2 border-nb-yellow flex items-start gap-3"
           style={{ background: '#FFEB3C10' }}>
        <span className="text-xl flex-shrink-0">💡</span>
        <div>
          <p className="font-black text-nb-dark text-sm">Neurobix Method Tip</p>
          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
            Review lessons in short 15–20 minute sessions daily. Spaced repetition is the secret to making memories stick long-term!
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─── Flash Cards ─── */
function FlashCardsView() {
  const DECKS = [
    { subject: 'Mathematics', icon: '🔢', cards: [
      { front: 'What is 7 × 8?',  back: '56 🎉',  hint: 'Think: 7 × 7 = 49, then +7' },
      { front: 'What is 12 × 12?', back: '144 ⭐', hint: 'A dozen dozens!' },
      { front: 'What is √49?',    back: '7 💡',   hint: '7 × 7 = 49' },
    ]},
    { subject: 'English', icon: '📖', cards: [
      { front: 'Spell: Beautiful',    back: 'B-E-A-U-T-I-F-U-L 🌸', hint: '"Big Elephants Are Ugly"' },
      { front: 'Opposite of: Happy',  back: 'Sad / Unhappy 😢',      hint: 'Prefix un- makes opposites!' },
      { front: 'Plural of: Mouse',    back: 'Mice 🐭',               hint: 'Irregular plural — no rules!' },
    ]},
    { subject: 'Science', icon: '🔬', cards: [
      { front: 'What gas do plants absorb?',          back: 'Carbon Dioxide (CO₂) 🌿', hint: 'They breathe what we breathe out!' },
      { front: 'How many planets in our solar system?', back: '8 Planets 🪐',           hint: 'My Very Educated Mother Just Served Us Nachos' },
      { front: 'Closest star to Earth?',              back: 'The Sun ☀️',              hint: '150 million km away!' },
    ]},
  ]

  const [deckIdx, setDeckIdx]   = useState(0)
  const [cardIdx, setCardIdx]   = useState(0)
  const [flipped, setFlipped]   = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [library, setLibrary]   = useState([])
  const [showLibrary, setShowLibrary] = useState(false)

  const deck = DECKS[deckIdx]
  const card = deck.cards[cardIdx]
  const cardKey = `${deckIdx}-${cardIdx}`
  const isSaved = library.some(c => c.key === cardKey)

  function changeDeck(i) { setDeckIdx(i); setCardIdx(0); setFlipped(false); setShowHint(false) }
  function next() { setCardIdx((cardIdx + 1) % deck.cards.length); setFlipped(false); setShowHint(false) }
  function prev() { setCardIdx((cardIdx - 1 + deck.cards.length) % deck.cards.length); setFlipped(false); setShowHint(false) }
  function toggleSave() {
    if (isSaved) {
      setLibrary(l => l.filter(c => c.key !== cardKey))
    } else {
      setLibrary(l => [...l, { key: cardKey, subject: deck.subject, front: card.front, back: card.back, hint: card.hint }])
    }
  }

  /* My Library view */
  if (showLibrary) return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-nb-dark">📖 My Saved Library</h2>
        <button onClick={() => setShowLibrary(false)} className="text-sm font-bold text-gray-400 hover:text-nb-dark">← Back to Cards</button>
      </div>
      {library.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-3">📭</p>
          <p className="font-bold">No saved cards yet</p>
          <p className="text-sm mt-1">Tap the ⭐ Save button on any card to add it here</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {library.map((c, i) => (
            <div key={i} className="bg-white rounded-2xl border-2 border-nb-yellow p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-black text-nb-olive uppercase tracking-widest">{c.subject}</span>
                <button onClick={() => setLibrary(l => l.filter((_, j) => j !== i))}
                  className="text-xs text-red-400 font-bold hover:text-red-600">✕ Remove</button>
              </div>
              <p className="font-black text-nb-dark">{c.front}</p>
              <p className="text-nb-green font-bold mt-2">{c.back}</p>
              {c.hint && <p className="text-xs text-gray-400 mt-2 italic">🧠 {c.hint}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-nb-dark">🃏 Flash Cards</h2>
        <button onClick={() => setShowLibrary(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-nb-yellow text-nb-dark text-sm font-black hover:bg-nb-yellow transition">
          📖 My Library {library.length > 0 && <span className="bg-nb-dark text-white text-[10px] px-1.5 py-0.5 rounded-full">{library.length}</span>}
        </button>
      </div>

      {/* Deck picker — big buttons */}
      <div className="grid grid-cols-3 gap-2">
        {DECKS.map((d, i) => (
          <button key={d.subject} onClick={() => changeDeck(i)}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 rounded-2xl text-xs sm:text-base font-black border-2 transition-all hover:scale-[1.02] ${
              deckIdx === i ? 'text-nb-dark border-nb-yellow shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:border-nb-olive'
            }`}
            style={deckIdx === i ? { background: '#FFEB3C' } : {}}>
            <span className="text-xl sm:text-2xl">{d.icon}</span>
            <span className="text-center leading-tight">{d.subject}</span>
          </button>
        ))}
      </div>

      {/* Main card area — wider, taller, fixed height */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">

        {/* Card — takes 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          {/* Progress dots */}
          <div className="flex gap-2 justify-center">
            {deck.cards.map((_, i) => (
              <div key={i} className="h-2.5 rounded-full transition-all cursor-pointer"
                style={{ width: i === cardIdx ? 32 : 10, background: i === cardIdx ? '#36913F' : '#d1d5db' }}
                onClick={() => { setCardIdx(i); setFlipped(false); setShowHint(false) }} />
            ))}
          </div>

          {/* Fixed-height card — NEVER grows */}
          <div
            onClick={() => { setFlipped(!flipped); setShowHint(false) }}
            className="cursor-pointer bg-white rounded-3xl border-2 select-none transition-all hover:shadow-xl"
            style={{
              borderColor: flipped ? '#6FC911' : '#91BA4F44',
              height: 220,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '24px 32px',
              overflow: 'hidden',
              textAlign: 'center',
            }}>
            {!flipped ? (
              <>
                <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#91BA4F' }}>{deck.subject}</p>
                <p className="font-black text-nb-dark leading-snug"
                   style={{ fontSize: card.front.length > 30 ? 17 : 24, maxHeight: 100, overflow: 'hidden' }}>
                  {card.front}
                </p>
                <p className="text-sm text-gray-300 mt-4">👆 Tap to flip!</p>
              </>
            ) : (
              <>
                <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#6FC911' }}>Answer</p>
                <p className="font-black leading-snug"
                   style={{ color: '#36913F', fontSize: card.back.length > 20 ? 18 : 30, maxHeight: 100, overflow: 'hidden' }}>
                  {card.back}
                </p>
                <p className="text-sm text-gray-300 mt-4">👆 Tap to flip back</p>
              </>
            )}
          </div>

          {/* Fixed-height hint slot — buttons never shift */}
          <div className="h-10 flex items-center justify-center">
            {!flipped && (
              !showHint
                ? <button onClick={() => setShowHint(true)}
                    className="text-sm font-bold text-nb-olive hover:text-nb-green transition">
                    💡 Show Memory Hint
                  </button>
                : <p className="text-sm font-semibold text-nb-dark text-center px-4 py-2 rounded-xl"
                     style={{ background: '#FFEB3C33' }}>
                    🧠 {card.hint}
                  </p>
            )}
          </div>

          {/* Navigation — always anchored here */}
          <div className="flex gap-3">
            <button onClick={prev}
              className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-500 font-black hover:border-nb-olive transition text-base">
              ← Prev
            </button>
            <button onClick={next}
              className="flex-1 py-3.5 rounded-2xl font-black text-nb-dark shadow-md transition hover:shadow-lg text-base"
              style={{ background: '#FFEB3C' }}>
              Next →
            </button>
          </div>
          <p className="text-center text-sm text-gray-400">Card {cardIdx + 1} of {deck.cards.length}</p>

          {/* Save to Library */}
          <button onClick={toggleSave}
            className={`w-full py-3 rounded-2xl font-black text-sm border-2 transition-all ${
              isSaved
                ? 'border-nb-yellow text-nb-dark'
                : 'border-gray-200 text-gray-400 hover:border-nb-yellow hover:text-nb-dark'
            }`}
            style={isSaved ? { background: '#FFEB3C' } : {}}>
            {isSaved ? '⭐ Saved to My Library' : '☆ Save to My Library'}
          </button>
        </div>

        {/* Side panel — all cards in deck (2 cols) */}
        <div className="lg:col-span-2 space-y-2.5">
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">All Cards</p>
          {deck.cards.map((c, i) => (
            <div key={i}
              onClick={() => { setCardIdx(i); setFlipped(false); setShowHint(false) }}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                i === cardIdx
                  ? 'border-nb-green shadow-sm'
                  : 'bg-white border-gray-100 hover:border-nb-olive'
              }`}
              style={i === cardIdx ? { background: '#6FC91112' } : {}}>
              <p className="text-sm font-black text-nb-dark leading-snug">{c.front}</p>
              {i === cardIdx && flipped && (
                <p className="text-xs font-bold mt-1.5" style={{ color: '#36913F' }}>{c.back}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Quizzes ─── */
function QuizzesView() {
  const quizzes = [
    { id: 1, title: 'Times Tables Challenge', subject: 'Mathematics', questions: 10, bestScore: 90,   icon: '🔢', difficulty: 'Easy'   },
    { id: 3, title: 'Fractions Basics',       subject: 'Mathematics', questions: 8,  bestScore: 75,   icon: '📐', difficulty: 'Medium' },
    { id: 7, title: 'Solar System Quiz',      subject: 'Science',     questions: 8,  bestScore: null, icon: '🪐', difficulty: 'Easy'   },
    { id: 6, title: 'Grammar: Tenses',        subject: 'English',     questions: 10, bestScore: null, icon: '✏️', difficulty: 'Medium' },
  ]
  const DIFF_COLOR = { Easy: 'bg-green-100 text-green-700', Medium: 'bg-yellow-100 text-yellow-700', Hard: 'bg-red-100 text-red-600' }

  const [active, setActive]     = useState(null)
  const [current, setCurrent]   = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore]       = useState(0)
  const [answered, setAnswered] = useState(false)
  const [done, setDone]         = useState(false)

  const QUESTIONS = [
    { q: 'What is 6 × 7?',   options: ['36','42','48','54'],        answer: 1 },
    { q: 'What is 9 × 8?',   options: ['63','72','81','90'],        answer: 1 },
    { q: 'What is 12 × 11?', options: ['121','132','144','122'],    answer: 2 },
  ]

  function startQuiz(q) { setActive(q); setCurrent(0); setSelected(null); setScore(0); setAnswered(false); setDone(false) }
  function submit() { if (selected === QUESTIONS[current].answer) setScore(s => s + 1); setAnswered(true) }
  function nextQ() { setAnswered(false); setSelected(null); current + 1 < QUESTIONS.length ? setCurrent(c => c + 1) : setDone(true) }

  if (active) {
    if (done) return (
      <div className="flex flex-col items-center py-8 gap-4 text-center">
        <div className="text-6xl">{score === QUESTIONS.length ? '🏆' : '👍'}</div>
        <h2 className="text-2xl font-black text-nb-dark">Quiz Done!</h2>
        <p className="text-lg text-gray-500">Score: <span className="font-black text-nb-green">{score}/{QUESTIONS.length}</span></p>
        {score === QUESTIONS.length && <p className="text-amber-600 font-bold">Perfect! Amazing! ⭐</p>}
        <p className="font-bold text-nb-lime">+{score * 30} points!</p>
        <button onClick={() => setActive(null)}
          className="px-8 py-3 rounded-2xl font-black text-nb-dark shadow hover:shadow-md transition"
          style={{ background: '#FFEB3C' }}>← Back to Quizzes</button>
      </div>
    )

    const q = QUESTIONS[current]
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setActive(null)} className="text-gray-400 text-sm font-bold">← Back</button>
          <span className="text-sm font-bold text-gray-400">{current + 1}/{QUESTIONS.length}</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all"
               style={{ width: `${(current / QUESTIONS.length) * 100}%`, background: 'linear-gradient(90deg,#FFEB3C,#6FC911)' }} />
        </div>
        <div className="bg-white rounded-2xl border border-nb-olive/20 p-5 text-center">
          <p className="text-xl font-black text-nb-dark">{q.q}</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {q.options.map((opt, i) => {
            let bg = {}, cls = 'border-gray-200 bg-white text-gray-700 hover:border-nb-green'
            if (answered) {
              cls = i === q.answer ? 'border-nb-green bg-green-50 text-nb-dark' : i === selected ? 'border-red-300 bg-red-50 text-red-500' : 'border-gray-100 bg-gray-50 text-gray-300'
            } else if (selected === i) { cls = 'border-nb-yellow text-nb-dark'; bg = { background: '#FFEB3C' } }
            return (
              <button key={i} onClick={() => !answered && setSelected(i)}
                className={`py-3.5 rounded-xl font-black border-2 transition-all ${cls}`} style={bg}>
                {opt}{answered && i === q.answer && ' ✅'}{answered && i === selected && i !== q.answer && ' ❌'}
              </button>
            )
          })}
        </div>
        {!answered
          ? <button onClick={submit} disabled={selected === null}
              className="w-full py-3.5 rounded-xl font-black text-nb-dark shadow disabled:opacity-40 transition"
              style={{ background: '#FFEB3C' }}>Submit ✅</button>
          : <button onClick={nextQ}
              className="w-full py-3.5 rounded-xl font-black text-white shadow transition hover:opacity-90"
              style={{ background: '#36913F' }}>
              {current + 1 < QUESTIONS.length ? 'Next →' : 'See Results 🎉'}
            </button>
        }
      </div>
    )
  }

  const LEADERBOARD = [
    { rank: 1, name: 'Nadia Putri',         score: 96, points: 1380, isMe: false },
    { rank: 2, name: 'Ahmad bin Hassan',    score: 90, points: 1240, isMe: true  },
    { rank: 3, name: 'Farid bin Ismail',    score: 85, points: 1020, isMe: false },
    { rank: 4, name: 'Siti Nur Aisyah',     score: 80, points: 980,  isMe: false },
    { rank: 5, name: 'Justin Ng',           score: 72, points: 790,  isMe: false },
  ]
  const RANK_MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-nb-dark">📝 Quizzes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="bg-white rounded-2xl border-2 border-nb-olive/20 p-5 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow"
                 style={{ background: '#FFF7E9' }}>{quiz.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-nb-dark truncate">{quiz.title}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-gray-400">{quiz.subject}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${DIFF_COLOR[quiz.difficulty]}`}>{quiz.difficulty}</span>
              </div>
              {quiz.bestScore !== null && <p className="text-sm font-black mt-1" style={{ color: '#36913F' }}>Best: {quiz.bestScore}%</p>}
            </div>
            <button onClick={() => startQuiz(quiz)}
              className="flex-shrink-0 px-5 py-3 rounded-2xl font-black text-nb-dark shadow-md transition hover:shadow-lg text-sm"
              style={{ background: '#FFEB3C' }}>
              {quiz.bestScore !== null ? 'Retry 🔄' : 'Start 🚀'}
            </button>
          </div>
        ))}
      </div>

      {/* Quiz Leaderboard */}
      <div className="bg-white rounded-2xl border-2 border-nb-olive/20 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-nb-dark">🏅 Class Leaderboard — Primary 4A</h3>
          <span className="text-xs text-gray-400 font-semibold">Times Tables Challenge</span>
        </div>
        <div className="space-y-2.5">
          {LEADERBOARD.map(s => (
            <div key={s.rank}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition ${
                s.isMe ? 'border-nb-yellow shadow-md' : 'border-transparent bg-nb-cream/50'
              }`}
              style={s.isMe ? { background: '#FFEB3C20' } : {}}>
              <span className="text-xl w-7 text-center flex-shrink-0">{RANK_MEDAL[s.rank] || `#${s.rank}`}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-black text-sm truncate ${s.isMe ? 'text-nb-dark' : 'text-gray-600'}`}>
                  {s.name} {s.isMe && <span className="text-xs font-bold text-nb-green">(You)</span>}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-black text-nb-dark text-sm">{s.score}%</p>
                <p className="text-[10px] text-gray-400">⭐ {s.points} pts</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-3">Leaderboard updates after each quiz attempt · Visible to all class members</p>
      </div>
    </div>
  )
}
