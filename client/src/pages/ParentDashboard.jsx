import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoHorizontal from '../assets/Asset 1@3x.png'

const CHILDREN = [
  {
    id: 1,
    name: 'Ahmad bin Hassan',
    class: 'Primary 4A',
    avatar: 'AH',
    subjects: [
      { name: 'Mathematics', icon: '🔢', progress: 72, completed: 10, total: 14, color: '#3b82f6', lastActive: 'Today' },
      { name: 'English',     icon: '📖', progress: 55, completed: 6,  total: 12, color: '#9333ea', lastActive: 'Yesterday' },
      { name: 'Science',     icon: '🔬', progress: 40, completed: 4,  total: 10, color: '#36913F', lastActive: '3 days ago' },
    ],
    points: 1240,
    streak: 7,
    badges: ['⭐ Star Learner', '🏆 Quiz Champion', '🔥 7-Day Streak'],
    quizResults: [
      { title: 'Times Tables Challenge', subject: 'Mathematics', score: 90, date: '2025-05-06', passed: true },
      { title: 'Fractions Basics',       subject: 'Mathematics', score: 75, date: '2025-05-05', passed: true },
      { title: 'Spelling Bee Lvl 1',     subject: 'English',     score: 60, date: '2025-05-03', passed: false },
      { title: 'Solar System Quiz',      subject: 'Science',     score: 85, date: '2025-04-30', passed: true },
    ],
    recentActivity: [
      { icon: '✅', text: 'Completed "Multiplication Tables" lesson', time: 'Today, 3:15 PM', type: 'lesson' },
      { icon: '📝', text: 'Scored 75% on Fractions Basics quiz', time: 'Yesterday, 4:30 PM', type: 'quiz' },
      { icon: '🃏', text: 'Reviewed 12 flash cards in Mathematics', time: 'Yesterday, 3:00 PM', type: 'flashcard' },
      { icon: '⭐', text: 'Earned "Quiz Champion" badge', time: '3 days ago', type: 'badge' },
      { icon: '🔥', text: 'Achieved 7-day learning streak!', time: '4 days ago', type: 'streak' },
    ],
    teacherNotes: [
      { teacher: 'Ms Sarah Tan', subject: 'Mathematics', date: '2025-05-05', message: 'Ahmad is making excellent progress in multiplication. He should focus on fractions — I recommend reviewing the flash cards daily.' },
      { teacher: 'Mr Alif Ibrahim',  subject: 'Science',     date: '2025-04-28', message: 'Ahmad engages well in class. Encourage him to complete the Solar System video lesson at home this week.' },
    ],
    upcomingDeadlines: [
      { title: 'Fractions Basics Quiz (Retry)', subject: 'Mathematics', due: '2025-05-10', urgent: false },
      { title: 'Reading Comprehension',         subject: 'English',     due: '2025-05-12', urgent: false },
      { title: 'Solar System Video',            subject: 'Science',     due: '2025-05-09', urgent: true },
    ],
  },
  {
    id: 2,
    name: 'Nur Aisyah bte Hassan',
    class: 'Primary 2B',
    avatar: 'NA',
    subjects: [
      { name: 'Mathematics', icon: '🔢', progress: 50, completed: 5, total: 10, color: '#3b82f6', lastActive: '2 days ago' },
      { name: 'English',     icon: '📖', progress: 80, completed: 8, total: 10, color: '#9333ea', lastActive: 'Today' },
    ],
    points: 620,
    streak: 3,
    badges: ['⭐ Star Learner'],
    quizResults: [
      { title: 'Alphabet Quiz',    subject: 'English',     score: 95, date: '2025-05-06', passed: true },
      { title: 'Numbers 1–20',     subject: 'Mathematics', score: 70, date: '2025-05-04', passed: true },
    ],
    recentActivity: [
      { icon: '✅', text: 'Completed "Alphabet Flash Cards" lesson', time: 'Today, 2:00 PM', type: 'lesson' },
      { icon: '📝', text: 'Scored 95% on Alphabet Quiz', time: 'Yesterday, 1:00 PM', type: 'quiz' },
      { icon: '🃏', text: 'Reviewed 8 English flash cards', time: '2 days ago', type: 'flashcard' },
    ],
    teacherNotes: [
      { teacher: 'Ms Maria Wong', subject: 'English', date: '2025-05-04', message: 'Aisyah is doing very well in English. Her reading has improved greatly this month. Keep up the daily practice!' },
    ],
    upcomingDeadlines: [
      { title: 'Numbers 1–50 Quiz', subject: 'Mathematics', due: '2025-05-11', urgent: false },
    ],
  },
]

const SUBJECT_ACTIVITY_COLOR = {
  lesson:    'bg-green-100 text-green-700',
  quiz:      'bg-orange-100 text-orange-700',
  flashcard: 'bg-purple-100 text-purple-700',
  badge:     'bg-yellow-100 text-yellow-700',
  streak:    'bg-red-100 text-red-700',
}

export default function ParentDashboard() {
  const navigate = useNavigate()
  const [childIdx, setChildIdx] = useState(0)
  const [tab, setTab] = useState('overview')
  const child = CHILDREN[childIdx]

  const overallProgress = Math.round(
    child.subjects.reduce((sum, s) => sum + s.progress, 0) / child.subjects.length
  )

  const TABS = [
    { id: 'overview',   label: '📊 Overview' },
    { id: 'progress',   label: '📚 Progress' },
    { id: 'quizzes',    label: '📝 Quizzes' },
    { id: 'rewards',    label: '🏆 Rewards' },
    { id: 'messages',   label: '💬 Messages' },
    { id: 'deadlines',  label: '📅 Deadlines' },
  ]

  return (
    <div className="min-h-screen bg-nb-cream">

      {/* Navbar */}
      <nav className="bg-white border-b-2 border-nb-olive/20 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <img src={logoHorizontal} alt="Neurobix Method" className="h-9 w-auto object-contain" />
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-nb-olive/20 text-nb-dark">Parent Portal</span>
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-nb-dark text-sm"
                 style={{ background: '#FFEB3C' }}>EH</div>
            <button onClick={() => navigate('/login')} className="text-xs text-gray-400 hover:text-red-400 font-medium">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">

        {/* Child Selector */}
        <div className="bg-white rounded-2xl border border-nb-olive/20 p-4 flex items-center gap-4 flex-wrap">
          <p className="text-sm font-black text-nb-dark flex-shrink-0">My Children:</p>
          <div className="flex gap-2 flex-wrap flex-1">
            {CHILDREN.map((c, i) => (
              <button key={c.id} onClick={() => { setChildIdx(i); setTab('overview') }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border-2 transition-all ${
                  childIdx === i ? 'border-nb-green shadow-md' : 'border-nb-olive/20 hover:border-nb-olive bg-nb-cream/50'
                }`}
                style={childIdx === i ? { background: '#6FC91115' } : {}}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-nb-dark flex-shrink-0"
                     style={{ background: '#FFEB3C' }}>{c.avatar}</div>
                <div className="text-left">
                  <p className="text-sm font-black text-nb-dark">{c.name}</p>
                  <p className="text-[10px] text-gray-400">{c.class}</p>
                </div>
                {childIdx === i && <span className="text-nb-green text-sm">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="bg-white rounded-2xl border border-nb-olive/20 overflow-hidden">
          <div className="flex overflow-x-auto">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-5 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-all flex-shrink-0 ${
                  tab === t.id ? 'border-nb-green text-nb-dark' : 'border-transparent text-gray-400 hover:text-nb-dark hover:bg-nb-cream/50'
                }`}
                style={tab === t.id ? { background: '#6FC91108' } : {}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="space-y-5">
            {/* Summary banner */}
            <div className="rounded-3xl p-6 text-white shadow-xl overflow-hidden relative"
                 style={{ background: 'linear-gradient(135deg,#6FC911,#396336)' }}>
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-green-200 text-sm font-semibold">Parent Overview</p>
                  <h1 className="text-2xl font-black mt-1">{child.name}</h1>
                  <p className="text-green-100 text-sm mt-0.5">{child.class} · Neurobix Method</p>
                  <div className="flex gap-3 mt-4 flex-wrap">
                    {[
                      [`${overallProgress}%`, 'Avg. Progress'],
                      [`${child.streak} 🔥`, 'Day Streak'],
                      [`${child.points} ⭐`, 'Total Points'],
                      [`${child.badges.length}`, 'Badges'],
                    ].map(([v, l]) => (
                      <div key={l} className="bg-white/20 rounded-2xl px-4 py-2.5 text-center backdrop-blur-sm">
                        <p className="text-lg font-black">{v}</p>
                        <p className="text-[11px] text-green-100">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-nb-dark flex-shrink-0 shadow-lg"
                     style={{ background: '#FFEB3C' }}>{child.avatar}</div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-nb-olive/20 p-5">
                <p className="text-2xl mb-1">📚</p>
                <p className="text-3xl font-black text-nb-dark">
                  {child.subjects.reduce((s, x) => s + x.completed, 0)}/{child.subjects.reduce((s, x) => s + x.total, 0)}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">Lessons completed</p>
              </div>
              <div className="bg-white rounded-2xl border border-nb-olive/20 p-5">
                <p className="text-2xl mb-1">📝</p>
                <p className="text-3xl font-black text-nb-dark">
                  {Math.round(child.quizResults.reduce((s, q) => s + q.score, 0) / child.quizResults.length)}%
                </p>
                <p className="text-sm text-gray-500 mt-0.5">Avg. quiz score</p>
              </div>
              <div className="bg-white rounded-2xl border border-nb-olive/20 p-5 col-span-2 sm:col-span-1">
                <p className="text-2xl mb-1">✅</p>
                <p className="text-3xl font-black text-nb-dark">
                  {child.quizResults.filter(q => q.passed).length}/{child.quizResults.length}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">Quizzes passed</p>
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
                <h3 className="font-black text-red-700 mb-3">⚠️ Urgent — Action Needed</h3>
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
          <div className="space-y-4">
            <h2 className="text-xl font-black text-nb-dark">📚 Subject Progress</h2>
            {child.subjects.map(s => (
              <div key={s.name} className="bg-white rounded-2xl border border-nb-olive/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                         style={{ background: s.color + '20' }}>{s.icon}</div>
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
          </div>
        )}

        {/* ── QUIZZES ── */}
        {tab === 'quizzes' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-nb-dark">📝 Quiz Performance</h2>
            {/* Average score card */}
            <div className="rounded-3xl p-5 border-2 border-nb-yellow"
                 style={{ background: 'linear-gradient(135deg,#FFEB3C22,#6FC91115)' }}>
              <div className="flex items-center gap-4">
                <div className="text-5xl">📊</div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Average Quiz Score</p>
                  <p className="text-4xl font-black text-nb-dark">
                    {Math.round(child.quizResults.reduce((s, q) => s + q.score, 0) / child.quizResults.length)}%
                  </p>
                  <p className="text-sm text-nb-green font-semibold mt-0.5">
                    {child.quizResults.filter(q => q.passed).length} passed · {child.quizResults.filter(q => !q.passed).length} need retry
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-nb-olive/20 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-nb-cream border-b border-nb-olive/20">
                  <tr>
                    {['Quiz', 'Subject', 'Score', 'Result', 'Date'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-gray-500 font-black text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-nb-olive/10">
                  {child.quizResults.map((q, i) => (
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
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${q.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {q.passed ? '✅ Passed' : '❌ Retry'}
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

        {/* ── REWARDS ── */}
        {tab === 'rewards' && (
          <div className="space-y-5">
            <h2 className="text-xl font-black text-nb-dark">🏆 Rewards & Achievements</h2>

            <div className="rounded-3xl p-6 shadow-lg"
                 style={{ background: 'linear-gradient(135deg,#FFEB3C,#91BA4F)' }}>
              <p className="text-nb-dark/70 font-semibold text-sm">Total Points Earned</p>
              <p className="text-5xl font-black text-nb-dark mt-1">{child.points.toLocaleString()} ⭐</p>
              <p className="text-nb-dark/60 text-sm mt-2">Rank: Top 15% of class · {child.streak}-day learning streak 🔥</p>
            </div>

            <div className="bg-white rounded-2xl border border-nb-olive/20 p-5">
              <h3 className="font-black text-nb-dark mb-4">🎖️ Badges Earned</h3>
              <div className="flex flex-wrap gap-3">
                {child.badges.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 bg-nb-cream border-2 border-nb-yellow rounded-2xl px-4 py-2.5 shadow-sm">
                    <span className="text-xl">{b.split(' ')[0]}</span>
                    <span className="font-bold text-nb-dark text-sm">{b.split(' ').slice(1).join(' ')}</span>
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
          <div className="space-y-4">
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
          <div className="space-y-4">
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
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${d.urgent ? 'bg-red-50' : 'bg-nb-cream'}`}>
                          {d.urgent ? '⚠️' : '📋'}
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
              <span className="text-xl flex-shrink-0">💡</span>
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
