import { useState } from 'react'
import Navbar from '../components/Navbar'
import MemoryFundamentals from '../components/MemoryFundamentals'
import PinInput from '../components/PinInput'
import { registerUser, resetCredential, setMustChangeCredential, findAuthRecord } from '../data/mockDb'
import {
  subjectMicroscope,
  starYellow, streakIcon, badgeIcon, medalIcon, bookIcon, passIcon, retryIcon,
  overdueIcon, scoreIcon, lightBulbIcon,
} from '../assets/icons'

const CHILDREN = [
  {
    id: 1,
    name: 'Ahmad bin Hassan',
    username: 'ahmad2026',
    class: 'Primary 4A',
    avatar: 'AH',
    subjects: [
      { name: 'Science', icon: subjectMicroscope, progress: 40, completed: 4, total: 10, color: '#36913F', lastActive: '3 days ago' },
    ],
    points: 1240,
    streak: 7,
    badges: [{ icon: starYellow, label: 'Star Learner' }, { icon: medalIcon, label: 'Assessment Champion' }, { icon: streakIcon, label: '7-Day Streak' }],
    assessmentResults: [
      { title: 'Solar System Assessment',      subject: 'Science', score: 85, date: '2025-04-30', passed: true },
      { title: 'States of Matter Assessment',  subject: 'Science', score: 78, date: '2025-04-25', passed: true },
    ],
    recentActivity: [
      { icon: '✅', text: 'Completed "The Solar System" lesson', time: 'Today, 3:15 PM', type: 'lesson' },
      { icon: '📝', text: 'Scored 85% on Solar System Assessment', time: 'Yesterday, 4:30 PM', type: 'assessment' },
      { icon: '🃏', text: 'Reviewed 12 flash cards in Science', time: 'Yesterday, 3:00 PM', type: 'flashcard' },
      { icon: '⭐', text: 'Earned "Assessment Champion" badge', time: '3 days ago', type: 'badge' },
      { icon: '🔥', text: 'Achieved 7-day learning streak!', time: '4 days ago', type: 'streak' },
    ],
    teacherNotes: [
      { teacher: 'Mr Alif Ibrahim', subject: 'Science', date: '2025-04-28', message: 'Ahmad engages well in class. Encourage him to complete the Solar System video lesson at home this week.' },
    ],
    upcomingDeadlines: [
      { title: 'Solar System Video', subject: 'Science', due: '2025-05-09', urgent: true },
    ],
  },
  {
    id: 2,
    name: 'Nur Aisyah bte Hassan',
    username: 'aisyah2026',
    class: 'Primary 2B',
    avatar: 'NA',
    subjects: [
      { name: 'Science', icon: subjectMicroscope, progress: 65, completed: 7, total: 10, color: '#36913F', lastActive: 'Today' },
    ],
    points: 620,
    streak: 3,
    badges: [{ icon: starYellow, label: 'Star Learner' }],
    assessmentResults: [
      { title: 'Human Body Assessment',   subject: 'Science', score: 88, date: '2025-05-06', passed: true },
      { title: 'States of Matter Assessment', subject: 'Science', score: 72, date: '2025-05-04', passed: true },
    ],
    recentActivity: [
      { icon: '✅', text: 'Completed "Plants & Photosynthesis" lesson', time: 'Today, 2:00 PM', type: 'lesson' },
      { icon: '📝', text: 'Scored 88% on Human Body Assessment', time: 'Yesterday, 1:00 PM', type: 'assessment' },
      { icon: '🃏', text: 'Reviewed 8 Science flash cards', time: '2 days ago', type: 'flashcard' },
    ],
    teacherNotes: [
      { teacher: 'Ms Maria Wong', subject: 'Science', date: '2025-05-04', message: 'Aisyah is doing very well in Science. Her curiosity about how things work really shines — keep encouraging hands-on exploration at home!' },
    ],
    upcomingDeadlines: [
      { title: 'Human Body Assessment (Retry)', subject: 'Science', due: '2025-05-11', urgent: false },
    ],
  },
]

const SUBJECT_ACTIVITY_COLOR = {
  lesson:     'bg-green-100 text-green-700',
  assessment: 'bg-orange-100 text-orange-700',
  flashcard:  'bg-purple-100 text-purple-700',
  badge:      'bg-yellow-100 text-yellow-700',
  streak:     'bg-red-100 text-red-700',
}

/* ── Reset a linked student's PIN ── */
function ResetChildPinModal({ child, onClose }) {
  const [pin, setPin]         = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)

  function submit(e) {
    e.preventDefault()
    if (pin.length !== 4) { setError('PIN needs to be 4 digits.'); return }
    if (pin !== confirm) { setError("PINs don't match — try again."); return }
    if (findAuthRecord(child.username)) {
      resetCredential(child.username, pin)
      setMustChangeCredential(child.username, false)
    } else {
      registerUser(child.username, pin, { name: child.name, role: 'student', username: child.username, mustChangeCredential: false })
    }
    setDone(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
         style={{ background: 'rgba(0,0,0,0.4)' }}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-sm p-6 sm:p-8 text-center">
        {!done ? (
          <>
            <div className="text-4xl mb-2">🔑</div>
            <h2 className="text-lg font-black text-nb-dark">Reset PIN for {child.name}</h2>
            <p className="text-xs text-gray-400 mt-1 mb-5">Username: {child.username}</p>
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-2">New PIN</label>
                <PinInput length={4} value={pin} onChange={v => { setPin(v); setError('') }} autoFocus />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Confirm PIN</label>
                <PinInput length={4} value={confirm} onChange={v => { setConfirm(v); setError('') }} />
              </div>
              {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={onClose}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-gray-300 transition">Cancel</button>
                <button type="submit"
                  className="flex-1 py-3 rounded-xl font-black text-nb-dark text-sm shadow-md transition hover:shadow-lg"
                  style={{ background: '#FFEB3C' }}>Set PIN</button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="text-4xl mb-2">✅</div>
            <h2 className="text-lg font-black text-nb-dark">PIN updated!</h2>
            <p className="text-sm text-gray-400 mt-1">{child.name} can log in with their new PIN right away.</p>
            <button onClick={onClose}
              className="w-full mt-5 py-3 rounded-xl font-black text-nb-dark text-sm shadow-md" style={{ background: '#FFEB3C' }}>Done</button>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Create a new student account under this parent ── */
function AddChildModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', className: '', username: '', pin: '' })
  const [error, setError] = useState('')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setError('') }

  function submit(e) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Please enter your child\'s full name.'); return }
    if (!form.username.trim()) { setError('Please set a username.'); return }
    if (form.pin.length !== 4) { setError('PIN needs to be 4 digits.'); return }
    if (findAuthRecord(form.username)) { setError('That username is already taken — try another.'); return }

    registerUser(form.username, form.pin, { name: form.name, role: 'student', username: form.username })

    const initials = form.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    onAdd({
      id: Date.now(),
      name: form.name,
      username: form.username,
      class: form.className.trim() || 'Not yet assigned',
      avatar: initials || '🙂',
      subjects: [], points: 0, streak: 0, badges: [], assessmentResults: [],
      recentActivity: [], teacherNotes: [], upcomingDeadlines: [],
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
         style={{ background: 'rgba(0,0,0,0.4)' }}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md p-5 sm:p-7 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-black text-nb-dark">Add a Student Account</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        {error && <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Child's Full Name</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="e.g. Nur Aisyah bte Hassan"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Class (optional — Admin can assign later)</label>
            <input value={form.className} onChange={e => set('className', e.target.value)}
              placeholder="e.g. Primary 2B"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Username</label>
            <input value={form.username} onChange={e => set('username', e.target.value)}
              placeholder="e.g. aisyah2026"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5 text-center">4-digit PIN</label>
            <PinInput length={4} value={form.pin} onChange={v => set('pin', v)} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-gray-300 transition">Cancel</button>
            <button type="submit"
              className="flex-1 py-3 rounded-xl font-black text-nb-dark text-sm shadow-md transition hover:shadow-lg"
              style={{ background: '#FFEB3C' }}>Create Account →</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ParentDashboard() {
  const [childIdx, setChildIdx] = useState(0)
  const [tab, setTab] = useState('overview')
  const [children, setChildren] = useState(CHILDREN)
  const [showAddChild, setShowAddChild] = useState(false)
  const [pinTarget, setPinTarget] = useState(null)
  const child = children[childIdx]

  const overallProgress = child.subjects.length
    ? Math.round(child.subjects.reduce((sum, s) => sum + s.progress, 0) / child.subjects.length)
    : 0

  const TABS = [
    { id: 'overview',   label: '📊 Overview' },
    { id: 'progress',   label: '📚 Progress' },
    { id: 'memory',     label: '🧠 Memory Fundamentals' },
    { id: 'memportal',  label: '🧠 Mem Portal' },
    { id: 'rewards',    label: '🏆 Rewards' },
    { id: 'messages',   label: '💬 Messages' },
    { id: 'deadlines',  label: '📅 Deadlines' },
  ]

  return (
    <div className="min-h-screen bg-nb-cream">

      <Navbar role="parent" userName="Encik Hassan" avatar="EH" />

      {/* Sub-tabs (full-width) */}
      <div className="bg-white border-b border-nb-olive/15">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 flex overflow-x-auto scrollbar-hide">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition-all flex-shrink-0 ${
                tab === t.id ? 'border-nb-green text-nb-dark' : 'border-transparent text-gray-400 hover:text-nb-dark hover:bg-nb-cream/50'
              }`}
              style={tab === t.id ? { background: '#FFEB3C22' } : {}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-5">

        {/* Child Selector */}
        <div className="bg-white rounded-2xl border border-nb-olive/20 p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm font-black text-nb-dark">My Children:</p>
            <button onClick={() => setShowAddChild(true)}
              className="text-xs font-black text-nb-green hover:text-nb-dark transition">+ Add Child</button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {children.map((c, i) => (
              <div key={c.id}
                className={`flex items-center gap-2 pl-3 pr-2 py-2 rounded-2xl border-2 transition-all ${
                  childIdx === i ? 'border-nb-green shadow-md' : 'border-nb-olive/20 hover:border-nb-olive bg-nb-cream/50'
                }`}
                style={childIdx === i ? { background: '#6FC91115' } : {}}>
                <button onClick={() => { setChildIdx(i); setTab('overview') }} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-nb-dark flex-shrink-0"
                       style={{ background: '#FFEB3C' }}>{c.avatar}</div>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm font-black text-nb-dark">{c.name}</p>
                    <p className="text-[10px] text-gray-400">{c.class}</p>
                  </div>
                  {childIdx === i && <span className="text-nb-green text-xs ml-1">✓</span>}
                </button>
                <button onClick={() => setPinTarget(c)} title="Reset PIN"
                  className="text-xs text-gray-400 hover:text-nb-green transition ml-1 px-1">🔑</button>
              </div>
            ))}
          </div>
        </div>

        {showAddChild && (
          <AddChildModal
            onClose={() => setShowAddChild(false)}
            onAdd={newChild => { setChildren(cs => [...cs, newChild]); setChildIdx(children.length); setShowAddChild(false) }}
          />
        )}
        {pinTarget && <ResetChildPinModal child={pinTarget} onClose={() => setPinTarget(null)} />}

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="tab-panel space-y-5">
            {/* Summary banner */}
            <div className="rounded-3xl p-4 sm:p-6 shadow-lg border-2 border-nb-yellow overflow-hidden relative"
                 style={{ background: 'linear-gradient(135deg,#FFF6CC,#E9F8D9)' }}>
              <span className="absolute -right-4 -bottom-6 text-7xl sm:text-8xl opacity-20 select-none pointer-events-none">🌟</span>
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-nb-green text-xs sm:text-sm font-bold">👋 Parent Overview</p>
                  <h1 className="text-xl sm:text-2xl font-black mt-0.5 truncate text-nb-dark">{child.name}</h1>
                  <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{child.class} · Neurobix Method</p>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-3 mt-3">
                    {[
                      [`${overallProgress}%`, 'Progress', '#6FC911', null],
                      [child.streak, 'Streak', '#f97316', streakIcon],
                      [child.points.toLocaleString(), 'Points', '#eab308', starYellow],
                      [child.badges.length, 'Badges', '#9333ea', badgeIcon],
                    ].map(([v, l, c, icon]) => (
                      <div key={l} className="bg-white rounded-xl px-1.5 sm:px-4 py-2 text-center shadow-sm border border-nb-olive/10">
                        <p className="text-sm sm:text-lg font-black leading-tight flex items-center justify-center gap-1" style={{ color: c }}>
                          {icon && <img src={icon} alt="" className={`object-contain ${icon === badgeIcon ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'}`} />}{v}
                        </p>
                        <p className="text-[9px] sm:text-[11px] text-gray-400 mt-0.5">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-lg sm:text-2xl font-black text-nb-dark flex-shrink-0 shadow-lg relative z-10"
                     style={{ background: '#FFEB3C' }}>{child.avatar}</div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-nb-olive/20 p-5">
                <img src={bookIcon} alt="" className="w-7 h-7 mb-1 object-contain" />
                <p className="text-3xl font-black text-nb-dark">
                  {child.subjects.reduce((s, x) => s + x.completed, 0)}/{child.subjects.reduce((s, x) => s + x.total, 0)}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">Lessons completed</p>
              </div>
              <div className="bg-white rounded-2xl border border-nb-olive/20 p-5">
                <p className="text-2xl mb-1">📝</p>
                <p className="text-3xl font-black text-nb-dark">
                  {child.assessmentResults.length ? Math.round(child.assessmentResults.reduce((s, q) => s + q.score, 0) / child.assessmentResults.length) : 0}%
                </p>
                <p className="text-sm text-gray-500 mt-0.5">Avg. assessment score</p>
              </div>
              <div className="bg-white rounded-2xl border border-nb-olive/20 p-5 col-span-2 sm:col-span-1">
                <img src={passIcon} alt="" className="w-7 h-7 mb-1 object-contain" />
                <p className="text-3xl font-black text-nb-dark">
                  {child.assessmentResults.filter(q => q.passed).length}/{child.assessmentResults.length}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">Assessments passed</p>
              </div>
            </div>

            {/* Recent activity */}
            <div className="bg-white rounded-2xl border border-nb-olive/20 p-5">
              <h3 className="font-black text-nb-dark mb-4">🕐 Recent Activity</h3>
              <div className="space-y-3">
                {child.recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5 ${SUBJECT_ACTIVITY_COLOR[item.type]}`}>
                      {item.icon}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{item.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Urgent deadlines */}
            {child.upcomingDeadlines.some(d => d.urgent) && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                <h3 className="font-black text-red-700 mb-3 flex items-center gap-1.5"><img src={overdueIcon} alt="" className="w-4 h-4 object-contain" /> Urgent — Action Needed</h3>
                <div className="space-y-2">
                  {child.upcomingDeadlines.filter(d => d.urgent).map((d, i) => (
                    <div key={i} className="bg-white rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm text-nb-dark">{d.title}</p>
                        <p className="text-xs text-gray-400">{d.subject}</p>
                      </div>
                      <span className="text-xs font-black text-red-600 bg-red-100 px-2.5 py-1 rounded-full">Due {d.due}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PROGRESS ── */}
        {tab === 'progress' && (
          <div className="tab-panel space-y-4">
            <h2 className="text-xl font-black text-nb-dark flex items-center gap-2"><img src={bookIcon} alt="" className="w-6 h-6 object-contain" /> Subject Progress</h2>
            {child.subjects.map(s => (
              <div key={s.name} className="bg-white rounded-2xl border border-nb-olive/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center p-2.5 shadow-sm"
                         style={{ background: s.color + '20' }}><img src={s.icon} alt="" className="w-full h-full object-contain" /></div>
                    <div>
                      <p className="font-black text-nb-dark">{s.name}</p>
                      <p className="text-xs text-gray-400">Last active: {s.lastActive}</p>
                    </div>
                  </div>
                  <span className="text-2xl font-black" style={{ color: s.color }}>{s.progress}%</span>
                </div>

                {/* Progress bar */}
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <div className="h-full rounded-full transition-all" style={{ width: `${s.progress}%`, background: `linear-gradient(90deg,${s.color}99,${s.color})` }} />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{s.completed} of {s.total} lessons completed</span>
                  <span className="font-bold text-gray-500">{s.total - s.completed} remaining</span>
                </div>

                {/* Lesson mini-timeline */}
                <div className="flex gap-1.5 mt-4 flex-wrap">
                  {Array.from({ length: s.total }).map((_, i) => (
                    <div key={i}
                      className={`h-3 flex-1 min-w-3 rounded-full ${
                        i < s.completed ? '' : 'bg-gray-200'
                      }`}
                      style={i < s.completed ? { background: s.color } : {}}
                      title={`Lesson ${i + 1}: ${i < s.completed ? 'Completed' : 'Pending'}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Lesson 1</span>
                  <span>Lesson {s.total}</span>
                </div>
              </div>
            ))}

            {/* Assessment performance */}
            <h2 className="text-xl font-black text-nb-dark flex items-center gap-2 pt-2">📝 Assessment Performance</h2>
            <div className="rounded-3xl p-5 border-2 border-nb-yellow"
                 style={{ background: 'linear-gradient(135deg,#FFEB3C22,#6FC91115)' }}>
              <div className="flex items-center gap-4">
                <img src={scoreIcon} alt="" className="w-14 h-14 object-contain flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Average Assessment Score</p>
                  <p className="text-4xl font-black text-nb-dark">
                    {child.assessmentResults.length ? Math.round(child.assessmentResults.reduce((s, q) => s + q.score, 0) / child.assessmentResults.length) : 0}%
                  </p>
                  <p className="text-sm text-nb-green font-semibold mt-0.5">
                    {child.assessmentResults.filter(q => q.passed).length} passed · {child.assessmentResults.filter(q => !q.passed).length} need retry
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile card list */}
            <div className="space-y-2 sm:hidden">
              {child.assessmentResults.map((q, i) => (
                <div key={i} className="bg-white rounded-2xl border border-nb-olive/20 p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="font-bold text-nb-dark text-sm truncate">{q.title}</p>
                      <p className="text-xs text-gray-400">{q.subject} · {q.date}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${q.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      <img src={q.passed ? passIcon : retryIcon} alt="" className="w-3.5 h-3.5 object-contain" />
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${q.score}%`, background: q.score >= 70 ? '#36913F' : q.score >= 50 ? '#FFEB3C' : '#ef4444' }} />
                    </div>
                    <span className="font-black text-nb-dark text-sm">{q.score}%</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Table on sm+ */}
            <div className="hidden sm:block bg-white rounded-2xl border border-nb-olive/20 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-nb-cream border-b border-nb-olive/20">
                  <tr>
                    {['Assessment', 'Subject', 'Score', 'Result', 'Date'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-gray-500 font-black text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-nb-olive/10">
                  {child.assessmentResults.map((q, i) => (
                    <tr key={i} className="hover:bg-nb-cream/50 transition">
                      <td className="px-5 py-3 font-bold text-nb-dark">{q.title}</td>
                      <td className="px-5 py-3 text-gray-500">{q.subject}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${q.score}%`, background: q.score >= 70 ? '#36913F' : q.score >= 50 ? '#FFEB3C' : '#ef4444' }} />
                          </div>
                          <span className="font-black text-nb-dark">{q.score}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${q.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          <img src={q.passed ? passIcon : retryIcon} alt="" className="w-3 h-3 object-contain" /> {q.passed ? 'Passed' : 'Retry'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-400">{q.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MEMORY FUNDAMENTALS ── */}
        {tab === 'memory' && (
          <div className="tab-panel">
            <MemoryFundamentals role="parent" studentName={child.name.split(' ')[0]} />
          </div>
        )}

        {/* ── MEM PORTAL (coming soon) ── */}
        {tab === 'memportal' && (
          <div className="tab-panel">
            <ComingSoon title="Mem Portal" description="A dedicated space for memory training tools and exercises. We're building it now — check back soon!" />
          </div>
        )}

        {/* ── REWARDS ── */}
        {tab === 'rewards' && (
          <div className="tab-panel space-y-5">
            <h2 className="text-xl font-black text-nb-dark flex items-center gap-2"><img src={medalIcon} alt="" className="w-6 h-6 object-contain" /> Rewards & Achievements</h2>

            <div className="rounded-3xl p-6 shadow-lg"
                 style={{ background: 'linear-gradient(135deg,#FFEB3C,#91BA4F)' }}>
              <p className="text-nb-dark/70 font-semibold text-sm">Total Points Earned</p>
              <p className="text-5xl font-black text-nb-dark mt-1 flex items-center gap-2">{child.points.toLocaleString()} <img src={starYellow} alt="" className="w-10 h-10 object-contain" /></p>
              <p className="text-nb-dark/60 text-sm mt-2">Rank: Top 15% of class · {child.streak}-day learning streak 🔥</p>
            </div>

            <div className="bg-white rounded-2xl border border-nb-olive/20 p-5">
              <h3 className="font-black text-nb-dark mb-4 flex items-center gap-1.5"><img src={badgeIcon} alt="" className="w-6 h-6 object-contain" /> Badges Earned</h3>
              <div className="flex flex-wrap gap-3">
                {child.badges.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 bg-nb-cream border-2 border-nb-yellow rounded-2xl px-4 py-2.5 shadow-sm">
                    <img src={b.icon} alt="" className="w-6 h-6 object-contain" />
                    <span className="font-bold text-nb-dark text-sm">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-nb-olive/20 p-5">
              <h3 className="font-black text-nb-dark mb-4">📈 Weekly Points History</h3>
              <div className="flex items-end gap-2 h-28">
                {[120, 180, 95, 240, 160, 200, 180].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-nb-dark font-bold">{v}</span>
                    <div className="w-full rounded-t-lg" style={{ height: `${(v / 240) * 80}px`, background: 'linear-gradient(180deg,#FFEB3C,#6FC911)' }} />
                    <span className="text-[10px] text-gray-400">{['M','T','W','T','F','S','S'][i]}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">This week total: <span className="font-black text-nb-dark">1,175 pts</span></p>
            </div>
          </div>
        )}

        {/* ── MESSAGES ── */}
        {tab === 'messages' && (
          <div className="tab-panel space-y-4">
            <h2 className="text-xl font-black text-nb-dark">💬 Teacher Messages</h2>
            {child.teacherNotes.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-5xl mb-3">📭</div>
                <p className="font-bold">No messages yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {child.teacherNotes.map((note, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-nb-olive/20 p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-nb-dark flex-shrink-0"
                             style={{ background: '#FFEB3C' }}>
                          {note.teacher.split(' ').slice(-1)[0][0]}
                        </div>
                        <div>
                          <p className="font-black text-nb-dark text-sm">{note.teacher}</p>
                          <p className="text-xs text-gray-400">{note.subject} Teacher</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{note.date}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed bg-nb-cream rounded-xl p-4 border border-nb-olive/20">
                      "{note.message}"
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply box */}
            <div className="bg-white rounded-2xl border border-nb-olive/20 p-5">
              <h3 className="font-black text-nb-dark mb-3 text-sm">Send a Message to Teacher</h3>
              <select className="w-full px-3 py-2.5 rounded-xl border-2 border-nb-olive/20 text-sm mb-3 focus:outline-none focus:border-nb-green bg-nb-cream">
                <option>Select teacher…</option>
                {child.teacherNotes.map((n, i) => (
                  <option key={i}>{n.teacher} ({n.subject})</option>
                ))}
              </select>
              <textarea
                rows={3}
                placeholder="Type your message…"
                className="w-full px-3 py-2.5 rounded-xl border-2 border-nb-olive/20 text-sm resize-none focus:outline-none focus:border-nb-green bg-nb-cream"
              />
              <button className="mt-3 px-5 py-2.5 rounded-xl font-black text-nb-dark text-sm shadow transition hover:shadow-md"
                      style={{ background: '#FFEB3C' }}>
                Send Message →
              </button>
            </div>
          </div>
        )}

        {/* ── DEADLINES ── */}
        {tab === 'deadlines' && (
          <div className="tab-panel space-y-4">
            <h2 className="text-xl font-black text-nb-dark">📅 Upcoming Deadlines</h2>
            {child.upcomingDeadlines.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-5xl mb-3">🎉</div>
                <p className="font-bold">No upcoming deadlines!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {child.upcomingDeadlines
                  .sort((a, b) => a.due.localeCompare(b.due))
                  .map((d, i) => (
                    <div key={i}
                      className={`bg-white rounded-2xl border-2 p-5 flex items-center justify-between gap-4 ${d.urgent ? 'border-red-200' : 'border-nb-olive/20'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${d.urgent ? 'bg-red-50 p-2.5' : 'bg-nb-cream text-2xl'}`}>
                          {d.urgent ? <img src={overdueIcon} alt="" className="w-full h-full object-contain" /> : '📋'}
                        </div>
                        <div>
                          <p className="font-black text-nb-dark">{d.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{d.subject}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-black block ${d.urgent ? 'bg-red-100 text-red-600' : 'bg-green-50 text-nb-green'}`}>
                          {d.urgent ? '🔴 Due Soon' : '🟢 Upcoming'}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">{d.due}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Reminder tip */}
            <div className="rounded-2xl p-4 border-2 border-nb-yellow flex items-start gap-3"
                 style={{ background: '#FFEB3C15' }}>
              <img src={lightBulbIcon} alt="" className="w-6 h-6 flex-shrink-0 object-contain" />
              <div>
                <p className="font-black text-nb-dark text-sm">Neurobix Parent Tip</p>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                  Encourage your child to review lessons for at least <strong>15 minutes daily</strong>. Consistent short sessions are more effective than long irregular ones — this is the core of the Neurobix memory method!
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="border-t border-nb-olive/20 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-gray-400 space-y-1">
          <p className="font-black text-nb-dark">Neurobix Method Pte Ltd</p>
          <p>6 Raffles Boulevard Rd, #02-34/35, Singapore 039594</p>
          <p>© 2025 All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
