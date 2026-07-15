import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import LessonBrowser from '../components/LessonBrowser'
import WeeklySchedule from '../components/WeeklySchedule'
import ComingSoon from '../components/ComingSoon'
import { brainWatermark } from '../components/BrainBackground'
import QuestionBody, { hasAnswer, isCorrectAnswer } from '../components/QuizQuestion'
import {
  mascotFemale, mascotMale, mascotRocket,
  subjectNumbers, subjectBook, subjectMicroscope,
  starYellow, starOutline, badgeIcon, badgeLockIcon, medalIcon, brainIcon, bookIcon, streakIcon,
  lightBulbIcon, lockIcon, flashcardIcon,
  passIcon, overdueIcon, inProgressIcon, retryIcon, quizPassIcon, scoreboardIcon,
  certMath, certEnglish, certScience, certDesign,
  previewIcon, downloadIcon,
} from '../assets/icons'
import rankBadge1 from '../assets/badges/rank-1.png'
import rankBadge2 from '../assets/badges/rank-2.png'
import rankBadge3 from '../assets/badges/rank-3.png'
import rankBadge4 from '../assets/badges/rank-4.png'
import rankBadge5 from '../assets/badges/rank-5.png'
import rankBadge6 from '../assets/badges/rank-6.png'
import rankBadge7 from '../assets/badges/rank-7.png'
import rankBadge8 from '../assets/badges/rank-8.png'
import rankBadge9 from '../assets/badges/rank-9.png'
import rankBadge10 from '../assets/badges/rank-10.png'

const FlameIcon = ({ className }) => (
  <svg viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2C18 2 9 10.5 9 19.5C9 25.3 13.3 30 18.5 30C24.2 30 28.5 25.6 28.5 20C28.5 16.5 27 13.5 25 11.5C25 11.5 25.5 15 23.5 17C23.5 17 23.5 11 18 2Z" fill="url(#flame-outer)"/>
    <path d="M18.5 14C18.5 14 14.5 18.5 14.5 22.5C14.5 25.5 16.7 28 19.5 28C22.5 28 25 25.6 25 22.5C25 20.5 24 18.7 22.7 17.5C22.7 17.5 23 19.5 21.8 20.7C21.8 20.7 21.8 17 18.5 14Z" fill="url(#flame-inner)"/>
    <defs>
      <linearGradient id="flame-outer" x1="18" y1="2" x2="18" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFC23C"/>
        <stop offset="0.5" stopColor="#FF8A1E"/>
        <stop offset="1" stopColor="#F4511E"/>
      </linearGradient>
      <linearGradient id="flame-inner" x1="19.5" y1="14" x2="19.5" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFE082"/>
        <stop offset="1" stopColor="#FFB300"/>
      </linearGradient>
    </defs>
  </svg>
)

const SUBJECTS = [
  { id: 1, name: 'Mathematics', icon: subjectNumbers,    color: '#3b82f6', progress: 72, lessons: 14, completed: 10 },
  { id: 2, name: 'English',     icon: subjectBook,       color: '#9333ea', progress: 55, lessons: 12, completed: 6  },
  { id: 3, name: 'Science',     icon: subjectMicroscope, color: '#36913F', progress: 40, lessons: 10, completed: 4  },
]

const SUBJECT_COLOR = {
  Mathematics: '#3b82f6',
  English:     '#9333ea',
  Science:     '#36913F',
}

const RECENT_LESSONS = [
  { id: 1, title: 'Addition & Subtraction', subject: 'Mathematics', tag: 'Maths',   desc: 'Use story method to remember key facts.',      progress: 100, status: 'completed',   icon: '➕' },
  { id: 3, title: 'Fraction Basics',        subject: 'Mathematics', tag: 'Maths',   desc: 'Understand fractions using stories & visuals.', progress: 60,  status: 'in_progress', icon: '🍕' },
  { id: 4, title: 'Alphabet Flash Cards',   subject: 'English',     tag: 'English', desc: 'Learn letters with picture associations.',      progress: 30,  status: 'in_progress', icon: '🔤' },
  { id: 7, title: 'The Solar System',       subject: 'Science',     tag: 'Science', desc: 'Explore planets with memory palace.',           progress: 25,  status: 'in_progress', icon: '🪐' },
  { id: 2, title: 'Reading Comprehension',  subject: 'English',     tag: 'English', desc: 'Improve reading with story-based techniques.',  progress: 0,   status: 'overdue',     icon: '📖' },
]

function StatusPill({ status }) {
  if (status === 'completed')
    return <span className="flex items-center gap-1 text-xs font-bold text-nb-green bg-nb-green/10 rounded-full px-3 py-1.5 whitespace-nowrap"><img src={passIcon} alt="" className="w-3.5 h-3.5 object-contain" /> Done</span>
  if (status === 'overdue')
    return <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 rounded-full px-3 py-1.5 whitespace-nowrap"><img src={overdueIcon} alt="" className="w-3.5 h-3.5 object-contain" /> Overdue</span>
  return <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 rounded-full px-3 py-1.5 whitespace-nowrap"><img src={inProgressIcon} alt="" className="w-3.5 h-3.5 object-contain" /> Continue</span>
}

const BADGES = [
  { icon: starYellow,   label: 'Star Learner',  earned: true  },
  { icon: medalIcon,    label: 'Quiz Champ',    earned: true  },
  { icon: streakIcon,   label: '7-Day Streak',  earned: true  },
  { icon: brainIcon,    label: 'Memory Master', earned: false },
  { icon: bookIcon,     label: 'Bookworm',      earned: false },
  { icon: mascotRocket, label: 'Fast Finisher', earned: false },
]

const TABS = [
  { id: 'home',       icon: '🏠', label: 'Home'       },
  { id: 'lessons',    icon: '📚', label: 'My Courses', dropdown: [
      { id: 'lessons', icon: '📚', label: 'Subjects' },
      { id: 'memory',  icon: '🧠', label: 'Memory Techniques' },
    ] },
  { id: 'flashcards', icon: '🃏', label: 'Flash Cards' },
  { id: 'quizzes',    icon: '📝', label: 'Quizzes'    },
  { id: 'shop',       icon: '🛍️', label: 'Shop'       },
  { id: 'rewards',    icon: '🏆', label: 'Rewards'    },
  { id: 'memportal',  icon: '🧠', label: 'Mem Portal' },
]

const OPEN_CLASSES = [
  { id: 10, name: 'Extra Maths Practice',  subject: 'Mathematics', level: 'Primary 4', slots: 12, enrolled: false },
  { id: 11, name: 'English Writing Club',  subject: 'English',     level: 'Primary 3–5', slots: 8, enrolled: false },
  { id: 12, name: 'Science Explorers',     subject: 'Science',     level: 'Primary 4–6', slots: 15, enrolled: true  },
]

const BADGE_THRESHOLDS = [500, 1000, 1500, 2000, 3000, 5000]

const REDEEM_ITEMS = [
  { id: 'r1', icon: '📅', name: '1-Week Extension',      category: 'Subscription', cost: 300,  desc: 'Adds 7 days to your active subscription plan. Credited automatically.' },
  { id: 'r2', icon: '📆', name: '1-Month Extension',     category: 'Subscription', cost: 1000, desc: 'Adds 30 days to your active subscription plan. Credited automatically.' },
  { id: 'r3', icon: '🏷️', name: '10% Renewal Discount', category: 'Voucher',       cost: 200,  desc: 'Receive a 10% discount code applied on your next subscription renewal.' },
  { id: 'r4', icon: '🎨', name: 'Sticker Pack (10 pcs)', category: 'Product',      cost: 150,  desc: 'Exclusive Neurobix memory stickers. Collect at the centre or posted to you.' },
  { id: 'r5', icon: <img src={flashcardIcon} alt="" className="w-9 h-9 object-contain" />, name: 'Bonus Flash Deck', category: 'Product', cost: 100,  desc: 'Unlock a bonus flash card deck for any subject instantly.' },
  { id: 'r6', icon: '⚡', name: 'Double XP — 3 Days',    category: 'Digital',      cost: 250,  desc: 'Earn 2× points on every lesson for the next 3 days.' },
]

export default function StudentDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [tab, setTab] = useState(location.state?.tab || 'home')
  const [certModal, setCertModal] = useState(null)
  const [openClasses, setOpenClasses] = useState(OPEN_CLASSES)
  const [studentPoints, setStudentPoints] = useState(1240)
  const [redeemConfirm, setRedeemConfirm] = useState(null)
  const [redeemedIds, setRedeemedIds]     = useState([])
  const [redeemToast, setRedeemToast]     = useState(null)

  return (
    <div className={`min-h-screen flex flex-col ${tab === 'home' ? 'bg-white' : 'bg-nb-cream'}`}>

      {/* ── Top bar ── */}
      <Navbar role="student" userName="Ahmad bin Hassan" points={studentPoints} avatar="AH"
              tabs={TABS} activeTab={tab} onTabChange={setTab} />

      {/* ── Welcome hero (full-width) ── */}
      {tab === 'home' && (
        <div className="tab-panel w-full text-white relative overflow-hidden"
             style={{
               backgroundColor: '#2A4D28',
               backgroundImage: `${brainWatermark('rgba(255,255,255,0.13)')}, linear-gradient(135deg,#3C9D45 0%,#2A4D28 100%)`,
               backgroundSize: '150px 150px, cover',
             }}>
          <div className="max-w-6xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8 relative">
            <div className="relative pr-24 sm:pr-36">
              <p className="text-white/85 font-semibold text-sm">Welcome back, Ahmad!</p>
              <h1 className="text-2xl sm:text-4xl font-bold mt-1">Ready to train your brain?</h1>
              <p className="text-white/80 text-sm mt-1.5">Every lesson makes your memory stronger!</p>
            </div>

            {/* Mascot duo */}
            <div className="absolute right-0 top-0 sm:right-2 sm:top-1 flex items-end pointer-events-none select-none">
              <img src={mascotFemale} alt="" className="h-16 sm:h-28 w-auto object-contain -mr-3 sm:-mr-5" />
              <img src={mascotMale} alt="" className="h-20 sm:h-32 w-auto object-contain" />
            </div>

            {/* Stat cards */}
            <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {[
                { icon: <img src={bookIcon} alt="" className="w-6 h-6 object-contain" />, value: '10',    label: 'Lessons', sub: '10/14 completed' },
                { icon: <FlameIcon className="w-6 h-6" />, value: '7',     label: 'Streak',  sub: 'Days in a total' },
                { icon: <img src={badgeIcon} alt="" className="w-8 h-8 object-contain" />, value: '3',     label: 'Badges',  sub: 'Keep collecting!' },
                { icon: <img src={starYellow} alt="" className="w-6 h-6 object-contain" />, value: studentPoints.toLocaleString(), label: 'Points', sub: 'Keep growing!' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-3 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl flex-shrink-0">{s.icon}</span>
                    <div className="min-w-0">
                      <p className="text-lg sm:text-xl font-bold text-nb-dark leading-none">{s.value}</p>
                      <p className="text-xs font-semibold text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 text-center">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Page content ── */}
      <main className={`flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6 ${tab === 'home' || tab === 'rewards' || tab === 'lessons' ? 'pt-0' : 'pt-4 sm:pt-6'}`}>

        {/* ── HOME ── */}
        {tab === 'home' && (
          <div className="tab-panel space-y-6">

            {/* My Subjects */}
            <div className="bg-nb-cream w-screen relative left-1/2 right-1/2 -mx-[50vw] py-4 sm:py-5">
              <div className="max-w-6xl w-full mx-auto px-3 sm:px-6">
                <h2 className="text-xl sm:text-2xl font-bold text-nb-dark mb-3">My Subjects</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SUBJECTS.map(s => (
                    <div key={s.id} onClick={() => navigate('/lessons')}
                      className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center p-2.5 flex-shrink-0"
                             style={{ background: s.color + '1A' }}><img src={s.icon} alt="" className="w-full h-full object-contain" /></div>
                        <div className="min-w-0">
                          <p className="font-bold text-nb-dark">{s.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {s.completed}/{s.lessons} lessons done
                            <span className="font-bold ml-1.5" style={{ color: s.color }}>{s.progress}%</span>
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${s.progress}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Continue Learning + sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Continue Learning — 2/3 */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-nb-dark">Continue Learning</h2>
                  <button onClick={() => navigate('/lessons')}
                    className="text-sm font-bold text-nb-green border-2 border-nb-green/40 rounded-full px-4 py-1.5 hover:bg-nb-green hover:text-white transition">
                    View All Courses ›
                  </button>
                </div>
                <div className="space-y-3">
                  {RECENT_LESSONS.map(l => {
                    const c = SUBJECT_COLOR[l.subject]
                    const barColor = l.status === 'completed' ? '#36913F' : l.status === 'overdue' ? '#e5e7eb' : '#FBBF24'
                    return (
                      <div key={l.id} onClick={() => navigate(`/lessons/${l.id}`)}
                        className="bg-white rounded-2xl shadow-sm p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                             style={{ background: c + '1A' }}>{l.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-nb-dark text-sm sm:text-base">{l.title}</p>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                  style={{ background: c + '1A', color: c }}>{l.tag}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{l.desc}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${l.progress}%`, background: barColor }} />
                            </div>
                            <span className={`text-[11px] font-semibold flex-shrink-0 ${l.status === 'completed' ? 'text-nb-green' : 'text-gray-400'}`}>
                              {l.progress}% Completed
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <StatusPill status={l.status} />
                          <span className="text-gray-300 text-lg">›</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Sidebar — 1/3 */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-5">
                {/* Memory Tip */}
                <div className="flex-1 rounded-2xl border-2 border-nb-yellow p-4" style={{ background: 'linear-gradient(135deg,#FFEB3C15,#ffffff)' }}>
                  <img src={lightBulbIcon} alt="" className="w-7 h-7 mb-1 object-contain" />
                  <p className="font-black text-nb-dark text-sm">Memory Tip</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                    Use the <strong>Story Method</strong> — turn facts into a funny story. Silly stories stick! 🧠
                  </p>
                </div>

                {/* Streak */}
                <div className="flex-1 rounded-2xl border-2 border-nb-green/50 p-5" style={{ background: '#F1F8EF' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0"><FlameIcon className="w-9 h-9" /></div>
                    <div>
                      <p className="text-2xl font-bold text-nb-dark leading-none">7 Days</p>
                      <p className="text-xs text-gray-500 mt-1">Learning Streak</p>
                      <p className="text-xs font-bold text-nb-green mt-0.5">Amazing! Keep it up!</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl mt-4 p-3 flex justify-between">
                    {[['Mon',true],['Tue',true],['Wed',true],['Thu',true],['Fri',true],['Sat',true],['Sun',false]].map(([d,done]) => (
                      <div key={d} className="flex flex-col items-center gap-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs ${done ? 'bg-nb-green' : 'bg-gray-300'}`}>✓</div>
                        <span className="text-[10px] text-gray-400 font-semibold">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Schedule */}
            <WeeklySchedule />

          </div>
        )}

        {/* ── LESSONS ── */}
        {tab === 'lessons' && (
          <div className="tab-panel space-y-5">
            <LessonBrowser />

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
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center p-2"
                           style={{ background: '#FFF7E9' }}><img src={bookIcon} alt="" className="w-full h-full object-contain" /></div>
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
        {tab === 'flashcards' && <div className="tab-panel"><FlashCardsView /></div>}

        {/* ── MEMORY TECHNIQUES (coming soon) ── */}
        {tab === 'memory' && (
          <div className="tab-panel">
            <ComingSoon description="A dedicated space to learn the Story Method, Memory Palace, mnemonics and other memory techniques that power every lesson. We're building it now — check back soon!" />
          </div>
        )}

        {/* ── QUIZZES ── */}
        {tab === 'quizzes' && <div className="tab-panel"><QuizzesView /></div>}

        {/* ── SHOP ── */}
        {tab === 'shop' && <div className="tab-panel"><ShopView /></div>}

        {/* ── REWARDS ── */}
        {tab === 'rewards' && (() => {
          const nextThreshold = BADGE_THRESHOLDS.find(t => t > studentPoints) || BADGE_THRESHOLDS[BADGE_THRESHOLDS.length - 1]
          const prevThreshold = (() => { const p = BADGE_THRESHOLDS.filter(t => t <= studentPoints); return p.length ? p[p.length - 1] : 0 })()
          const barPct = Math.min(100, Math.round(((studentPoints - prevThreshold) / (nextThreshold - prevThreshold)) * 100))
          const ptsToNext = nextThreshold - studentPoints

          return (
          <div className="tab-panel space-y-6">
            {/* Points banner (full-width) */}
            <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] p-5 sm:py-7 shadow-xl"
                 style={{ background: 'linear-gradient(135deg,#FFEB3C,#91BA4F)' }}>
              <div className="max-w-6xl mx-auto px-3 sm:px-6">
                <p className="text-nb-dark/60 font-semibold text-sm">Total Points Balance</p>
                <p className="text-4xl sm:text-5xl font-black text-nb-dark mt-1 flex items-center gap-2">{studentPoints.toLocaleString()} <img src={starYellow} alt="" className="w-9 h-9 sm:w-11 sm:h-11 object-contain" /></p>
                <div className="mt-4 h-3 bg-white/40 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all" style={{ width: `${barPct}%` }} />
                </div>
                <p className="text-nb-dark/60 text-sm mt-1.5">
                  {ptsToNext > 0 ? `Only ${ptsToNext} pts away from the next badge!` : 'All badges unlocked! You\'re a legend! 🏆'}
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-black text-nb-dark flex items-center gap-2"><img src={medalIcon} alt="" className="w-7 h-7 object-contain" /> My Rewards</h2>

            {/* ── Redeem Points ── */}
            <div className="bg-white rounded-2xl border-2 border-nb-olive/20 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base sm:text-lg font-black text-nb-dark">🎁 Redeem Points</h3>
                <span className="text-sm font-bold text-nb-green flex items-center gap-1"><img src={starYellow} alt="" className="w-4 h-4 object-contain" /> {studentPoints.toLocaleString()} available</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">Use your earned points to extend your subscription, grab vouchers, or redeem products.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {REDEEM_ITEMS.map(item => {
                  const isRedeemed  = redeemedIds.includes(item.id)
                  const canAfford   = studentPoints >= item.cost
                  const CAT_COLOR   = { Subscription: '#3b82f6', Voucher: '#f59e0b', Product: '#36913F', Digital: '#9333ea' }
                  const catColor    = CAT_COLOR[item.category] || '#91BA4F'
                  return (
                    <div key={item.id}
                      className={`rounded-2xl border-2 p-4 flex flex-col gap-3 transition-all ${isRedeemed ? 'border-nb-green bg-green-50' : 'border-nb-olive/20 bg-nb-cream/40'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                             style={{ background: catColor + '1A' }}>
                          {item.icon}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full flex-shrink-0"
                              style={{ background: catColor + '1A', color: catColor }}>
                          {item.category}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-nb-dark text-sm leading-snug">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-auto">
                        <span className="flex items-center gap-1 font-black text-nb-dark">
                          <img src={starYellow} alt="" className="w-4 h-4 object-contain" />
                          <span>{item.cost.toLocaleString()}</span>
                          <span className="text-xs text-gray-400 font-semibold">pts</span>
                        </span>
                        {isRedeemed ? (
                          <span className="text-xs font-black text-nb-green bg-green-100 px-3 py-1.5 rounded-xl">✓ Redeemed</span>
                        ) : (
                          <button
                            onClick={() => canAfford ? setRedeemConfirm(item) : setRedeemToast('Not enough points! Keep completing lessons to earn more. ⭐')}
                            className={`px-3 py-1.5 rounded-xl font-black text-sm border-2 transition-all ${
                              canAfford ? 'border-transparent text-nb-dark shadow hover:shadow-md' : 'border-gray-200 text-gray-300 cursor-not-allowed'
                            }`}
                            style={canAfford ? { background: '#FFEB3C' } : {}}>
                            {canAfford ? 'Redeem' : <span className="flex items-center gap-1">Need more <img src={starYellow} alt="" className="w-3.5 h-3.5 object-contain" /></span>}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <p className="text-xs text-gray-400 text-center mt-4">
                Subscription extensions are applied automatically · Voucher codes emailed to parent · Physical products collected at the centre
              </p>
            </div>

            {/* Earn more points tip */}
            <div className="rounded-2xl p-4 border-2 border-nb-yellow flex items-start gap-3"
                 style={{ background: '#FFEB3C10' }}>
              <span className="text-xl flex-shrink-0">💡</span>
              <div>
                <p className="font-black text-nb-dark text-sm">How to earn more points?</p>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                  Complete lessons (+50 pts), pass quizzes (+30 pts per question), maintain your daily streak (+20 pts/day),
                  and earn badges (+100 pts each). Points can only be redeemed above, not spent in the Shop.
                </p>
              </div>
            </div>

            {/* Certificates of Completion */}
            <div className="bg-white rounded-2xl border-2 border-nb-olive/20 p-4 sm:p-5">
              <h3 className="text-base sm:text-lg font-black text-nb-dark mb-4">🎓 Certificates of Completion</h3>
              <div className="space-y-3">
                <div className="bg-nb-cream rounded-2xl p-4 border-2 border-nb-yellow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center p-2 flex-shrink-0"
                         style={{ background: '#FFEB3C' }}><img src={certMath} alt="" className="w-full h-full object-contain" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-nb-dark text-sm">Mathematics — Primary 4</p>
                      <p className="text-xs text-gray-400 mt-0.5">All 14 lessons · All quizzes passed · Issued 2025-05-10</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setCertModal('Mathematics')}
                      className="flex-1 py-2 rounded-xl font-bold text-nb-green border-2 border-nb-green/30 text-xs hover:bg-nb-green hover:text-white transition flex items-center justify-center gap-1.5">
                      <img src={previewIcon} alt="" className="w-3.5 h-3.5 object-contain" /> Preview
                    </button>
                    <button className="flex-1 py-2 rounded-xl font-black text-nb-dark text-xs shadow flex items-center justify-center gap-1.5"
                            style={{ background: '#FFEB3C' }}><img src={downloadIcon} alt="" className="w-3.5 h-3.5 object-contain" /> PDF</button>
                  </div>
                </div>
                {[{name:'English', pct:55, done:6, total:12, icon: certEnglish}, {name:'Science', pct:40, done:4, total:10, icon: certScience}].map(s => (
                  <div key={s.name} className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200 opacity-60">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="relative w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center p-2 flex-shrink-0 grayscale">
                        <img src={s.icon} alt="" className="w-full h-full object-contain" />
                        <img src={lockIcon} alt="" className="absolute -bottom-1 -right-1 w-4 h-4 object-contain bg-white rounded-full p-0.5 shadow" />
                      </div>
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
                <h3 className="text-base sm:text-lg font-black text-nb-dark mb-3 flex items-center gap-1.5"><img src={badgeIcon} alt="" className="w-6 h-6 object-contain" /> Badges</h3>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {BADGES.map(b => (
                    <div key={b.label}
                      className={`rounded-2xl p-3 text-center border-2 transition-all ${b.earned ? 'bg-white border-nb-yellow shadow-md hover:scale-105' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
                      <img src={b.icon} alt="" className="w-9 h-9 sm:w-11 sm:h-11 mx-auto mb-1 sm:mb-2 object-contain" />
                      <p className="text-[10px] sm:text-xs font-black text-gray-700 leading-tight">{b.label}</p>
                      {!b.earned && <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 flex items-center justify-center gap-0.5"><img src={badgeLockIcon} alt="" className="w-2.5 h-2.5 object-contain" /> Locked</p>}
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
                        <span className="font-black text-nb-dark flex items-center gap-1.5"><img src={s.icon} alt="" className="w-4 h-4 object-contain" /> {s.name}</span>
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
          )
        })()}

        {/* ── MEM PORTAL (coming soon) ── */}
        {tab === 'memportal' && (
          <div className="tab-panel">
            <ComingSoon title="Mem Portal" description="A dedicated space for memory training tools and exercises. We're building it now — check back soon!" />
          </div>
        )}
      </main>

      {/* ── Redeem Confirm Modal ── */}
      {redeemConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
             style={{ background: 'rgba(0,0,0,0.5)' }}
             onClick={e => e.target === e.currentTarget && setRedeemConfirm(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-sm p-6 sm:p-8 space-y-5">
            <div className="text-center">
              <div className="text-5xl mb-3">{redeemConfirm.icon}</div>
              <h3 className="text-xl font-black text-nb-dark">{redeemConfirm.name}</h3>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">{redeemConfirm.desc}</p>
            </div>
            <div className="space-y-2">
              <div className="bg-nb-cream rounded-2xl p-4 flex items-center justify-between">
                <span className="font-semibold text-gray-500 text-sm">Points cost</span>
                <span className="font-black text-nb-dark flex items-center gap-1"><img src={starYellow} alt="" className="w-4 h-4 object-contain" /> {redeemConfirm.cost.toLocaleString()} pts</span>
              </div>
              <div className="bg-nb-cream rounded-2xl p-4 flex items-center justify-between">
                <span className="font-semibold text-gray-500 text-sm">Balance after</span>
                <span className="font-black text-nb-dark flex items-center gap-1"><img src={starYellow} alt="" className="w-4 h-4 object-contain" /> {(studentPoints - redeemConfirm.cost).toLocaleString()} pts</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setRedeemConfirm(null)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm">
                Cancel
              </button>
              <button
                onClick={() => {
                  setStudentPoints(p => p - redeemConfirm.cost)
                  setRedeemedIds(ids => [...ids, redeemConfirm.id])
                  setRedeemConfirm(null)
                  setRedeemToast(`🎉 "${redeemConfirm.name}" redeemed! Our team will process it within 1–2 school days.`)
                  setTimeout(() => setRedeemToast(null), 3500)
                }}
                className="flex-1 py-3 rounded-xl font-black text-nb-dark text-sm shadow-md"
                style={{ background: '#FFEB3C' }}>
                Confirm Redeem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Redeem Toast ── */}
      {redeemToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-nb-dark text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-sm text-center max-w-xs">
          {redeemToast}
        </div>
      )}

      {/* ── Certificate Preview Modal ── */}
      {certModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
             style={{ background: 'rgba(0,0,0,0.6)' }}
             onClick={e => e.target === e.currentTarget && setCertModal(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-xl overflow-hidden">
            {/* Certificate */}
            <div className="relative p-6 sm:p-10 text-center"
                 style={{ background: 'linear-gradient(135deg,#396336 0%,#36913F 50%,#6FC911 100%)' }}>
              <img src={certDesign} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 select-none pointer-events-none" />
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
                  <span className="flex items-center gap-1"><img src={lockIcon} alt="" className="w-3 h-3 object-contain opacity-70" /> Cert #NM-2025-0041</span>
                </div>
              </div>
            </div>
            <div className="p-4 flex gap-3">
              <button onClick={() => setCertModal(null)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm">
                Close
              </button>
              <button className="flex-1 py-3 rounded-xl font-black text-nb-dark text-sm shadow-md flex items-center justify-center gap-1.5"
                      style={{ background: '#FFEB3C' }}>
                <img src={downloadIcon} alt="" className="w-4 h-4 object-contain" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Shop ─── */
function ShopView() {
  const SHOP_ITEMS = [
    { id: 1,  name: 'Brain Booster Sticker Pack',  category: 'Physical',     icon: '🎨', price: 8,   desc: 'A set of 20 fun Neurobix memory-themed stickers.',            stock: 50  },
    { id: 2,  name: 'Neurobix Notebook',           category: 'Physical',     icon: '📓', price: 12,  desc: 'Branded A5 notebook for memory maps and notes.',              stock: 30  },
    { id: 3,  name: 'Pencil & Ruler Set',          category: 'Physical',     icon: '✏️', price: 10,  desc: 'Colour pencil set (12 colours) + a Neurobix ruler.',          stock: 20  },
    { id: 4,  name: 'Extra Flash Card Deck',       category: 'Digital',      icon: '🃏', price: 6,   desc: 'Unlock a premium flash card deck for any subject.',           stock: 999 },
    { id: 5,  name: 'Custom Profile Badge Pack',   category: 'Digital',      icon: '🏅', price: 5,   desc: 'Choose a special badge to display on your profile.',          stock: 999 },
    { id: 6,  name: 'Double XP Pass — 1 Month',    category: 'Subscription', icon: '⚡', price: 15,  desc: 'Earn 2× points on all lessons for 30 days. Auto-renews.',     stock: 999, billing: 'month' },
    { id: 7,  name: 'Neurobix Water Bottle',       category: 'Physical',     icon: '🥤', price: 18,  desc: 'Stainless steel water bottle with Neurobix logo.',            stock: 15  },
    { id: 8,  name: 'Mystery Reward Box',          category: 'Physical',     icon: '🎁', price: 20,  desc: 'A surprise box of goodies — collected at the centre.',        stock: 10  },
  ]

  const SHOP_CLASSES = [
    {
      id: 'cls1', subject: 'Mathematics', level: 'P4', icon: subjectNumbers, color: '#3b82f6',
      name: 'Primary 4 Mathematics Intensive',
      teacher: 'Ms Sarah Tan', sessions: '2 sessions / week', duration: '1.5 hrs each',
      price: 49, billing: 'month',
      slots: 4,
      desc: 'Master P4 Maths using the Neurobix memory method. Covers all MOE topics with weekly quizzes and flashcard drills.',
    },
    {
      id: 'cls2', subject: 'English', level: 'P4', icon: subjectBook, color: '#9333ea',
      name: 'Primary 4 English Excellence',
      teacher: 'Ms Sarah Tan', sessions: '2 sessions / week', duration: '1 hr each',
      price: 45, billing: 'month',
      slots: 6,
      desc: 'Build strong comprehension and writing skills with story-based memory techniques for vocabulary and grammar.',
    },
    {
      id: 'cls3', subject: 'Science', level: 'P5', icon: subjectMicroscope, color: '#36913F',
      name: 'Primary 5 Science Explorer',
      teacher: 'Ms Sarah Tan', sessions: '1 session / week', duration: '2 hrs each',
      price: 52, billing: 'month',
      slots: 3,
      desc: 'Deep-dive into P5 Science using visual memory maps, concept linking and hands-on experiment recall.',
    },
    {
      id: 'cls4', subject: 'All Subjects', level: 'P4–P6', icon: brainIcon, color: '#f59e0b',
      name: 'Memory Booster — All Subjects',
      teacher: 'Ms Sarah Tan', sessions: '3 sessions / week', duration: '1 hr each',
      price: 99, billing: 'month',
      slots: 2,
      desc: 'The complete Neurobix experience — Maths, English and Science bundled together at a special rate.',
      badge: 'Best Value',
    },
  ]

  const CATEGORIES = ['All', 'Classes', 'Subscription', 'Digital', 'Physical']
  const CAT_COLOR   = { Subscription: '#f59e0b', Digital: '#3b82f6', Physical: '#36913F' }

  const [filter, setFilter]           = useState('All')
  const [bought, setBought]           = useState([])
  const [enrolled, setEnrolled]       = useState([])
  const [toast, setToast]             = useState(null)
  const [confirmItem, setConfirmItem] = useState(null)
  const [confirmClass, setConfirmClass] = useState(null)
  const [payMethod, setPayMethod]     = useState('card')

  const showItems   = filter === 'All' || filter === 'Subscription' || filter === 'Digital' || filter === 'Physical'
  const showClasses = filter === 'All' || filter === 'Classes'
  const visibleItems = filter === 'All' ? SHOP_ITEMS : SHOP_ITEMS.filter(i => i.category === filter)

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 3000) }

  function purchase(item) {
    setBought(b => [...b, item.id])
    setConfirmItem(null)
    showToast(`🎉 ${item.name} purchased! Check with your teacher for physical items.`)
  }

  function enrol(cls) {
    setEnrolled(e => [...e, cls.id])
    setConfirmClass(null)
    showToast(`🎓 Enrolled in "${cls.name}"! You'll receive a confirmation email shortly.`)
  }

  const FILTER_LABEL = { All: '🛍️ All', Classes: '🏫 Classes', Subscription: '⚡ Subscriptions', Digital: '💻 Digital', Physical: '📦 Physical' }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-nb-dark">🛍️ Neurobix Shop</h2>
        <p className="text-sm text-gray-400 font-semibold mt-0.5">Enrol in classes or purchase products & subscriptions with real money.</p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-4 py-2 rounded-full font-black text-sm border-2 transition-all ${
              filter === c
                ? 'border-nb-green bg-nb-green text-white shadow-sm'
                : 'border-gray-200 text-gray-500 bg-white hover:border-nb-olive'
            }`}>
            {FILTER_LABEL[c]}
          </button>
        ))}
      </div>

      {/* ── Classes section ── */}
      {showClasses && (
        <div className="space-y-3">
          {filter === 'All' && (
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-nb-dark">🏫 Classes</h3>
              <span className="text-xs text-gray-400 font-semibold">Monthly subscription · Billed via Stripe</span>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SHOP_CLASSES.map(cls => {
              const isEnrolled = enrolled.includes(cls.id)
              return (
                <div key={cls.id}
                  className={`bg-white rounded-2xl border-2 p-5 flex flex-col gap-3 transition-all relative overflow-hidden ${
                    isEnrolled ? 'border-nb-green' : 'border-nb-olive/20 hover:shadow-md hover:-translate-y-0.5'
                  }`}>

                  {cls.badge && (
                    <div className="absolute top-0 right-0 text-[10px] font-black text-white px-3 py-1 rounded-bl-xl"
                         style={{ background: '#f59e0b' }}>
                      {cls.badge}
                    </div>
                  )}

                  {/* Subject + teacher */}
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center p-3 flex-shrink-0"
                         style={{ background: cls.color + '1A' }}>
                      <img src={cls.icon} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-nb-dark text-sm leading-snug">{cls.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">👩‍🏫 {cls.teacher}</p>
                    </div>
                  </div>

                  {/* Meta tags */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-black px-2 py-1 rounded-full"
                          style={{ background: cls.color + '1A', color: cls.color }}>
                      {cls.subject}
                    </span>
                    <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                      {cls.level}
                    </span>
                    <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                      {cls.sessions}
                    </span>
                    <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                      ⏱ {cls.duration}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed flex-1">{cls.desc}</p>

                  {cls.slots <= 3 && !isEnrolled && (
                    <p className="text-[11px] text-red-500 font-bold">🔴 Only {cls.slots} slot{cls.slots !== 1 ? 's' : ''} left!</p>
                  )}

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between gap-3 mt-auto pt-1 border-t border-gray-100">
                    <div>
                      <span className="text-xl font-black text-nb-dark">S${cls.price}</span>
                      <span className="text-xs text-gray-400 font-semibold">/{cls.billing}</span>
                    </div>
                    {isEnrolled ? (
                      <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-sm bg-nb-green/10 text-nb-green border-2 border-nb-green/30">
                        ✓ Enrolled
                      </span>
                    ) : (
                      <button onClick={() => setConfirmClass(cls)}
                        className="px-4 py-2 rounded-xl font-black text-nb-dark text-sm shadow hover:shadow-md transition-all border-transparent"
                        style={{ background: '#FFEB3C' }}>
                        Enrol Now →
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Products & subscriptions section ── */}
      {showItems && visibleItems.length > 0 && (
        <div className="space-y-3">
          {filter === 'All' && <h3 className="text-lg font-black text-nb-dark">🛒 Products & Subscriptions</h3>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleItems.map(item => {
              const alreadyBought = bought.includes(item.id)
              return (
                <div key={item.id}
                  className={`bg-white rounded-2xl border-2 p-5 flex flex-col gap-3 transition-all ${
                    alreadyBought ? 'border-nb-green' : 'border-nb-olive/20 hover:shadow-md hover:-translate-y-0.5'
                  }`}>
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                         style={{ background: (CAT_COLOR[item.category] || '#91BA4F') + '1A' }}>
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                          style={{ background: (CAT_COLOR[item.category] || '#91BA4F') + '1A', color: CAT_COLOR[item.category] || '#91BA4F' }}>
                      {item.category}
                    </span>
                  </div>

                  <div className="flex-1">
                    <p className="font-black text-nb-dark text-sm leading-snug">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>

                  {item.category === 'Physical' && item.stock < 20 && (
                    <p className="text-[11px] text-amber-600 font-bold">⚠️ Only {item.stock} left!</p>
                  )}

                  <div className="flex items-center justify-between gap-3 mt-auto">
                    <div>
                      <span className="font-black text-nb-dark text-base">S${item.price}</span>
                      {item.billing && <span className="text-xs text-gray-400 font-semibold">/{item.billing}</span>}
                    </div>
                    {alreadyBought ? (
                      <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-sm bg-nb-green/10 text-nb-green border-2 border-nb-green/30">
                        ✓ Purchased
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmItem(item)}
                        className="px-4 py-2 rounded-xl font-black text-sm border-2 border-transparent text-nb-dark shadow hover:shadow-md transition-all"
                        style={{ background: '#FFEB3C' }}>
                        Buy Now
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Class enrol modal ── */}
      {confirmClass && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
             style={{ background: 'rgba(0,0,0,0.55)' }}
             onClick={e => e.target === e.currentTarget && setConfirmClass(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md p-6 sm:p-8 space-y-5">
            <div className="text-center">
              <img src={confirmClass.icon} alt="" className="w-16 h-16 mx-auto mb-3 object-contain" />
              <h3 className="text-lg font-black text-nb-dark">{confirmClass.name}</h3>
              <p className="text-sm text-gray-400 mt-1">👩‍🏫 {confirmClass.teacher} · {confirmClass.level}</p>
            </div>

            <div className="bg-nb-cream rounded-2xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Sessions</span><span className="font-bold text-nb-dark">{confirmClass.sessions}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-bold text-nb-dark">{confirmClass.duration}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Billing</span><span className="font-bold text-nb-dark">Monthly · cancel anytime</span></div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-1">
                <span className="font-black text-nb-dark">Total today</span>
                <span className="font-black text-nb-dark text-base">S${confirmClass.price}.00</span>
              </div>
            </div>

            {/* Payment method */}
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Payment Method</p>
              <div className="flex gap-2">
                {[
                  { id: 'card', label: '💳 Credit / Debit Card' },
                  { id: 'paynow', label: '📱 PayNow' },
                ].map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black border-2 transition-all ${
                      payMethod === m.id ? 'border-nb-green text-nb-dark' : 'border-gray-200 text-gray-400 hover:border-nb-olive'
                    }`}
                    style={payMethod === m.id ? { background: '#6FC91115' } : {}}>
                    {m.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-center">
                Payments processed securely via Stripe · Auto-renews monthly
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setConfirmClass(null)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm">
                Cancel
              </button>
              <button onClick={() => enrol(confirmClass)}
                className="flex-1 py-3 rounded-xl font-black text-nb-dark text-sm shadow-md transition hover:shadow-lg"
                style={{ background: '#FFEB3C' }}>
                Confirm &amp; Pay →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Product/subscription purchase confirm modal ── */}
      {confirmItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
             style={{ background: 'rgba(0,0,0,0.5)' }}
             onClick={e => e.target === e.currentTarget && setConfirmItem(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-sm p-6 sm:p-8 space-y-5">
            <div className="text-center">
              <div className="text-5xl mb-3">{confirmItem.icon}</div>
              <h3 className="text-xl font-black text-nb-dark">{confirmItem.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{confirmItem.desc}</p>
            </div>
            <div className="bg-nb-cream rounded-2xl p-4 flex items-center justify-between">
              <span className="font-semibold text-gray-500 text-sm">{confirmItem.billing ? 'Billed' : 'Price'}</span>
              <span className="font-black text-nb-dark">S${confirmItem.price}{confirmItem.billing ? `/${confirmItem.billing}` : ''}</span>
            </div>

            {/* Payment method */}
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Payment Method</p>
              <div className="flex gap-2">
                {[
                  { id: 'card', label: '💳 Credit / Debit Card' },
                  { id: 'paynow', label: '📱 PayNow' },
                ].map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black border-2 transition-all ${
                      payMethod === m.id ? 'border-nb-green text-nb-dark' : 'border-gray-200 text-gray-400 hover:border-nb-olive'
                    }`}
                    style={payMethod === m.id ? { background: '#6FC91115' } : {}}>
                    {m.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-center">
                Payments processed securely via Stripe{confirmItem.billing ? ' · Auto-renews' : ''}
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setConfirmItem(null)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm">
                Cancel
              </button>
              <button onClick={() => purchase(confirmItem)}
                className="flex-1 py-3 rounded-xl font-black text-nb-dark text-sm shadow-md"
                style={{ background: '#FFEB3C' }}>
                Confirm &amp; Pay →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-nb-dark text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-sm whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  )
}

/* ─── Flash Cards ─── */
function FlashCardsView() {
  const ALL_DECKS = [
    { id: 1, subject: 'Mathematics', title: 'Multiplication Tables', icon: '🔢', cards: [
      { front: 'What is 7 × 8?',    back: '56',     hint: 'Think: 7 × 7 = 49, then +7'     },
      { front: 'What is 12 × 12?',  back: '144',    hint: 'A dozen dozens!'                  },
      { front: 'What is 9 × 6?',    back: '54',     hint: '9 × 5 = 45, then +9'             },
      { front: 'What is 4 × 7?',    back: '28',     hint: 'Imagine 4 weeks = 28 days'        },
      { front: 'What is √49?',      back: '7',      hint: '7 × 7 = 49'                       },
    ]},
    { id: 2, subject: 'Mathematics', title: 'Fractions', icon: '📐', cards: [
      { front: '1/2 + 1/4 = ?',      back: '3/4',      hint: 'Convert to same denominator' },
      { front: 'What is 3/4 of 20?', back: '15',        hint: '20 ÷ 4 × 3 = 15'            },
      { front: '1/3 as a decimal?',  back: '0.333…',    hint: 'Repeating decimal'           },
    ]},
    { id: 3, subject: 'English', title: 'Spelling & Vocabulary', icon: '📖', cards: [
      { front: 'Spell: Beautiful',   back: 'B-E-A-U-T-I-F-U-L', hint: '"Big Elephants Are Ugly"' },
      { front: 'Opposite of: Happy', back: 'Sad / Unhappy',       hint: 'Prefix un- = opposite'   },
      { front: 'Plural of: Mouse',   back: 'Mice',                hint: 'Irregular plural!'        },
      { front: 'Synonym of: Big',    back: 'Large / Huge / Vast', hint: 'All mean the same!'       },
    ]},
    { id: 4, subject: 'English', title: 'Grammar: Tenses', icon: '✏️', cards: [
      { front: 'Past tense of "run"', back: 'Ran',        hint: 'Irregular verb'     },
      { front: 'Past tense of "eat"', back: 'Ate',        hint: 'Irregular verb'     },
      { front: 'Future of "I go"',    back: 'I will go',  hint: 'Add "will" before'  },
    ]},
    { id: 5, subject: 'Science', title: 'The Solar System', icon: '🪐', cards: [
      { front: 'Closest planet to the Sun?', back: 'Mercury',   hint: 'My Very Educated Mother…' },
      { front: 'The Red Planet?',            back: 'Mars',      hint: '4th planet from the Sun'   },
      { front: 'Largest planet?',            back: 'Jupiter',   hint: '5th planet, a gas giant'   },
      { front: 'How many planets?',          back: '8 planets', hint: 'Pluto is a dwarf planet!'  },
    ]},
    { id: 6, subject: 'Science', title: 'States of Matter', icon: '🔬', cards: [
      { front: 'What gas do plants absorb?',  back: 'Carbon Dioxide (CO₂)', hint: 'They breathe what we exhale!' },
      { front: 'Water at 100°C becomes?',     back: 'Steam (gas)',           hint: 'Boiling point of water'       },
      { front: 'Solid → Liquid is called?',   back: 'Melting',               hint: 'Ice → water'                  },
    ]},
  ]

  const SUBJECT_CFG = {
    Mathematics: { color: '#3b82f6', bg: '#EFF6FF', badge: 'bg-blue-100 text-blue-700',    icon: '🔢' },
    English:     { color: '#9333ea', bg: '#FAF5FF', badge: 'bg-purple-100 text-purple-700', icon: '📖' },
    Science:     { color: '#36913F', bg: '#F0FDF4', badge: 'bg-green-100 text-green-700',  icon: '🔬' },
  }

  const [subjectFilter, setSubjectFilter] = useState('All')
  const [activeDeck, setActiveDeck]       = useState(null)
  const [cards, setCards]                 = useState([])
  const [cardIdx, setCardIdx]             = useState(0)
  const [flipped, setFlipped]             = useState(false)
  const [known, setKnown]                 = useState(new Set())
  const [library, setLibrary]             = useState([])
  const [showLibrary, setShowLibrary]     = useState(false)

  const subjectCounts = {}
  ALL_DECKS.forEach(d => { subjectCounts[d.subject] = (subjectCounts[d.subject] || 0) + 1 })
  const filteredDecks = ALL_DECKS.filter(d => subjectFilter === 'All' || d.subject === subjectFilter)

  function enterDeck(deck) {
    setActiveDeck(deck); setCards([...deck.cards]); setCardIdx(0)
    setFlipped(false); setKnown(new Set())
  }
  function exitDeck() { setActiveDeck(null) }

  const card    = activeDeck ? cards[cardIdx] : null
  const cardKey = activeDeck ? `${activeDeck.id}-${cardIdx}` : ''
  const isSaved = library.some(c => c.key === cardKey)

  function markKnown()  { setKnown(s => new Set([...s, cardIdx])); goNext() }
  function goNext()     { setFlipped(false); setCardIdx(i => (i + 1) % cards.length) }
  function goPrev()     { setFlipped(false); setCardIdx(i => (i - 1 + cards.length) % cards.length) }
  function shuffle()    { setCards(c => [...c].sort(() => Math.random() - 0.5)); setCardIdx(0); setFlipped(false) }
  function restart()    { setCardIdx(0); setFlipped(false); setKnown(new Set()) }
  function toggleSave() {
    if (!activeDeck || !card) return
    if (isSaved) setLibrary(l => l.filter(c => c.key !== cardKey))
    else setLibrary(l => [...l, { key: cardKey, subject: activeDeck.subject, front: card.front, back: card.back, hint: card.hint }])
  }

  /* ── Saved library view ── */
  if (showLibrary) return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-nb-dark flex items-center gap-2"><img src={starYellow} alt="" className="w-6 h-6 object-contain" /> My Saved Cards</h2>
        <button onClick={() => setShowLibrary(false)}
          className="text-sm font-bold text-gray-400 hover:text-nb-dark transition px-3 py-1.5 rounded-lg hover:bg-gray-100">
          ← Back
        </button>
      </div>
      {library.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-3">📭</p>
          <p className="font-bold">No saved cards yet</p>
          <p className="text-sm mt-1">Tap ⭐ on any card while studying to save it here</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {library.map((c, i) => {
            const cfg = SUBJECT_CFG[c.subject]
            return (
              <div key={i} className="bg-white rounded-2xl border-2 border-nb-yellow overflow-hidden">
                <div className="h-1 w-full" style={{ background: cfg?.color }} />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${cfg?.badge}`}>{cfg?.icon} {c.subject}</span>
                    <button onClick={() => setLibrary(l => l.filter((_, j) => j !== i))}
                      className="text-xs text-red-400 font-bold hover:text-red-600">✕ Remove</button>
                  </div>
                  <p className="font-black text-nb-dark text-sm">{c.front}</p>
                  <p className="font-bold mt-2 text-sm" style={{ color: '#36913F' }}>{c.back}</p>
                  {c.hint && <p className="text-xs text-gray-400 mt-1.5 italic">🧠 {c.hint}</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  /* ── Study view ── */
  if (activeDeck && card) {
    const cfg      = SUBJECT_CFG[activeDeck.subject]
    const knownPct = cards.length > 0 ? (known.size / cards.length) * 100 : 0
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={exitDeck}
            className="text-sm font-bold text-gray-400 hover:text-nb-dark transition px-3 py-1.5 rounded-lg hover:bg-gray-100">
            ← Back
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: cfg?.color }}>{activeDeck.subject}</p>
            <p className="font-black text-nb-dark text-sm truncate">{activeDeck.title}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={shuffle} title="Shuffle"
              className="w-9 h-9 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-gray-300 transition">🔀</button>
            <button onClick={restart} title="Restart"
              className="w-9 h-9 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-gray-300 transition text-base font-black text-gray-400">↺</button>
          </div>
        </div>

        {/* Progress: know it (green) vs still learning (gray) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">{cardIdx + 1} / {cards.length}</span>
            <span className="text-xs font-bold" style={{ color: '#36913F' }}>
              {known.size} know it · {cards.length - known.size} still learning
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${knownPct}%`, background: '#36913F' }} />
          </div>
        </div>

        {/* Card position dots */}
        <div className="flex gap-1.5 justify-center flex-wrap">
          {cards.map((_, i) => (
            <div key={i} onClick={() => { setCardIdx(i); setFlipped(false) }}
              className="rounded-full cursor-pointer transition-all"
              style={{
                width: i === cardIdx ? 28 : 8, height: 8,
                background: known.has(i) ? '#36913F' : i === cardIdx ? cfg?.color || '#FFEB3C' : '#e5e7eb',
              }} />
          ))}
        </div>

        {/* Flip card */}
        <div
          onClick={() => setFlipped(f => !f)}
          className="cursor-pointer rounded-3xl border-2 select-none transition-all hover:shadow-xl flex flex-col items-center justify-center text-center"
          style={{
            minHeight: 220, padding: '24px 28px',
            borderColor: flipped ? cfg?.color || '#6FC911' : '#e5e7eb',
            background: flipped ? (cfg?.bg || '#F0FDF4') : '#fff',
          }}>
          {!flipped ? (
            <>
              <span className="text-[11px] font-black uppercase tracking-widest mb-3 text-gray-300">
                {activeDeck.subject} · {activeDeck.title}
              </span>
              <p className="font-black text-nb-dark leading-snug"
                 style={{ fontSize: card.front.length > 35 ? 16 : 22 }}>
                {card.front}
              </p>
              <span className="text-xs text-gray-300 mt-5">Tap to reveal answer</span>
            </>
          ) : (
            <>
              <span className="text-[11px] font-black uppercase tracking-widest mb-3" style={{ color: cfg?.color }}>
                Answer
              </span>
              <p className="font-black leading-snug" style={{ color: cfg?.color, fontSize: card.back.length > 20 ? 18 : 28 }}>
                {card.back}
              </p>
              {card.hint && (
                <p className="text-xs text-gray-400 mt-3 italic leading-snug max-w-xs">🧠 {card.hint}</p>
              )}
              <span className="text-xs text-gray-300 mt-3">Tap to flip back</span>
            </>
          )}
        </div>

        {/* Confidence buttons after flip · Nav before flip */}
        {flipped ? (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={goNext}
              className="py-4 rounded-xl font-black text-red-500 border-2 border-red-200 bg-red-50 hover:bg-red-100 transition text-sm flex items-center justify-center gap-2">
              <img src={retryIcon} alt="" className="w-4 h-4 object-contain" /> Still Learning
            </button>
            <button onClick={markKnown}
              className="py-4 rounded-xl font-black text-white border-2 border-transparent shadow-md hover:opacity-90 transition text-sm flex items-center justify-center gap-2"
              style={{ background: '#36913F' }}>
              ✓ Know It
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5">
            <button onClick={goPrev}
              className="py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 font-black hover:border-nb-olive transition text-sm">
              ← Prev
            </button>
            <button onClick={toggleSave}
              className={`py-3.5 rounded-xl font-black text-sm border-2 transition-all flex items-center justify-center gap-1.5 ${isSaved ? 'border-nb-yellow text-nb-dark' : 'border-gray-200 text-gray-400 hover:border-nb-yellow'}`}
              style={isSaved ? { background: '#FFEB3C' } : {}}>
              {isSaved ? <img src={starYellow} alt="" className="w-4 h-4 object-contain" /> : <img src={starOutline} alt="" className="w-4 h-4 object-contain opacity-50" />} {isSaved ? 'Saved' : 'Save'}
            </button>
            <button onClick={goNext}
              className="py-3.5 rounded-xl border-2 border-nb-green font-black text-nb-dark hover:bg-nb-green hover:text-white transition text-sm">
              Next →
            </button>
          </div>
        )}

        {/* All cards in set */}
        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">All Cards in Set</p>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {cards.map((c, i) => (
              <div key={i} onClick={() => { setCardIdx(i); setFlipped(false) }}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                  i === cardIdx ? 'border-nb-green shadow-sm' : 'bg-white border-gray-100 hover:border-nb-olive'
                }`}
                style={i === cardIdx ? { background: '#6FC91112' } : {}}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${known.has(i) ? 'bg-nb-green text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {known.has(i) ? '✓' : i + 1}
                </span>
                <p className="text-sm font-black text-nb-dark leading-snug flex-1">{c.front}</p>
                {i === cardIdx && flipped && (
                  <p className="text-xs font-bold flex-shrink-0" style={{ color: '#36913F' }}>{c.back}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ── Deck library ── */
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-black text-nb-dark flex items-center gap-2"><img src={flashcardIcon} alt="" className="w-6 h-6 object-contain" /> Flash Cards</h2>
          <p className="text-sm text-gray-400 font-semibold mt-0.5">Learn faster. Remember longer.</p>
        </div>
        <button onClick={() => setShowLibrary(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-nb-yellow text-nb-dark text-sm font-black hover:bg-nb-yellow transition flex-shrink-0">
          <img src={starYellow} alt="" className="w-4 h-4 object-contain" /> My Saved Cards
          {library.length > 0 && <span className="bg-nb-dark text-white text-[10px] px-1.5 py-0.5 rounded-full">{library.length}</span>}
        </button>
      </div>

      {/* Subject filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['All', 'Mathematics', 'English', 'Science'].map(s => {
          const active = subjectFilter === s
          const cfg    = SUBJECT_CFG[s]
          return (
            <button key={s} onClick={() => setSubjectFilter(s)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border-2 flex-shrink-0 ${
                active ? 'text-white border-transparent shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
              style={active ? { background: cfg?.color || '#36913F' } : {}}>
              {s === 'All' ? '📋' : cfg?.icon} {s}
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ml-0.5 ${active ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {s === 'All' ? ALL_DECKS.length : (subjectCounts[s] || 0)}
              </span>
            </button>
          )
        })}
      </div>

      {/* Subject banner when filtered */}
      {subjectFilter !== 'All' && (
        <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: SUBJECT_CFG[subjectFilter]?.bg }}>
          <span className="text-3xl">{SUBJECT_CFG[subjectFilter]?.icon}</span>
          <div>
            <p className="font-black text-nb-dark">{subjectFilter}</p>
            <p className="text-xs text-gray-500">{subjectCounts[subjectFilter] || 0} study sets · Primary 4A</p>
          </div>
        </div>
      )}

      {/* Deck cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredDecks.map(deck => {
          const cfg = SUBJECT_CFG[deck.subject]
          return (
            <div key={deck.id}
              className="bg-white rounded-2xl border-2 border-nb-olive/20 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group"
              onClick={() => enterDeck(deck)}>
              <div className="h-1.5 w-full" style={{ background: cfg?.color }} />
              <div className="p-4">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${cfg?.badge}`}>
                    {cfg?.icon} {deck.subject}
                  </span>
                </div>
                <p className="font-black text-nb-dark text-[15px] leading-snug mb-1 group-hover:text-nb-green transition-colors">
                  {deck.title}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">{deck.cards.length} terms · Primary 4A</p>
                  <span className="text-xs font-bold text-nb-green opacity-0 group-hover:opacity-100 transition-opacity">Study →</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* Per-quiz question sets, mixing every supported question type as a showcase */
const QUIZ_QUESTIONS = {
  1: [
    { id: 101, type: 'mcq',       text: 'What is 6 × 7?',   options: ['36','42','48','54'], answer: 1 },
    { id: 102, type: 'mcq',       text: 'What is 9 × 8?',   options: ['63','72','81','90'], answer: 1 },
    { id: 103, type: 'true_false', text: '7 × 7 = 48',                                       answer: false },
    { id: 104, type: 'fill_in',   text: '12 × 11 = ___',                                     answer: '132' },
  ],
  3: [
    { id: 301, type: 'mcq',       text: 'What is ½ of 20?', options: ['5','8','10','12'],    answer: 2 },
    { id: 302, type: 'true_false', text: '¼ is greater than ½',                               answer: false },
    { id: 303, type: 'fill_in',   text: 'Simplify 2/4 to its simplest form: ___',              answer: '1/2' },
    { id: 304, type: 'match',     text: 'Match each fraction to its decimal', options: { pairs: [
        { left: '1/2', right: '0.5' }, { left: '1/4', right: '0.25' }, { left: '3/4', right: '0.75' },
      ] } },
    { id: 305, type: 'drag_drop', text: 'Drag each fraction into the correct group', options: {
        buckets: ['Less than ½', 'Greater than ½'],
        items: [
          { label: '1/4', bucket: 'Less than ½' },
          { label: '3/4', bucket: 'Greater than ½' },
          { label: '1/8', bucket: 'Less than ½' },
          { label: '5/6', bucket: 'Greater than ½' },
        ] } },
  ],
  7: [
    { id: 701, type: 'mcq',       text: 'Which planet is closest to the Sun?', options: ['Venus','Mercury','Earth','Mars'], answer: 1 },
    { id: 702, type: 'true_false', text: 'Jupiter is the largest planet in our solar system.',  answer: true },
    { id: 703, type: 'match',     text: 'Match each planet to its nickname', options: { pairs: [
        { left: 'Mars', right: 'Red Planet' }, { left: 'Saturn', right: 'Ringed Planet' },
      ] } },
  ],
  6: [
    { id: 601, type: 'mcq',       text: 'Which is the past tense of "run"?', options: ['runned','ran','runs','running'], answer: 1 },
    { id: 602, type: 'fill_in',   text: 'She ___ (go) to school yesterday.',                    answer: 'went' },
    { id: 603, type: 'drag_drop', text: 'Sort each word into the correct tense', options: {
        buckets: ['Past', 'Present'],
        items: [
          { label: 'walked', bucket: 'Past' },
          { label: 'walks',  bucket: 'Present' },
          { label: 'ate',    bucket: 'Past' },
          { label: 'eats',   bucket: 'Present' },
        ] } },
  ],
}

/* ─── Quizzes ─── */
function QuizzesView() {
  const quizzes = [
    { id: 1, title: 'Times Tables Challenge', subject: 'Mathematics', bestScore: 90,   icon: '🔢', difficulty: 'Easy'   },
    { id: 3, title: 'Fractions Basics',       subject: 'Mathematics', bestScore: 75,   icon: '📐', difficulty: 'Medium' },
    { id: 7, title: 'Solar System Quiz',      subject: 'Science',     bestScore: null, icon: '🪐', difficulty: 'Easy'   },
    { id: 6, title: 'Grammar: Tenses',        subject: 'English',     bestScore: null, icon: '✏️', difficulty: 'Medium' },
  ]
  const DIFF_COLOR = { Easy: 'bg-green-100 text-green-700', Medium: 'bg-yellow-100 text-yellow-700', Hard: 'bg-red-100 text-red-600' }

  const [active, setActive]     = useState(null)
  const [current, setCurrent]   = useState(0)
  const [value, setValue]       = useState(null)
  const [score, setScore]       = useState(0)
  const [answered, setAnswered] = useState(false)
  const [done, setDone]         = useState(false)

  const questions = active ? (QUIZ_QUESTIONS[active.id] || []) : []

  function startQuiz(q) { setActive(q); setCurrent(0); setValue(null); setScore(0); setAnswered(false); setDone(false) }
  function submit() { if (isCorrectAnswer(questions[current], value)) setScore(s => s + 1); setAnswered(true) }
  function nextQ() { setAnswered(false); setValue(null); current + 1 < questions.length ? setCurrent(c => c + 1) : setDone(true) }

  if (active) {
    if (done) return (
      <div className="flex flex-col items-center py-8 gap-4 text-center">
        <div className="flex justify-center">{score === questions.length ? <img src={quizPassIcon} alt="" className="w-20 h-20 object-contain" /> : <span className="text-6xl">👍</span>}</div>
        <h2 className="text-2xl font-black text-nb-dark">Quiz Done!</h2>
        <p className="text-lg text-gray-500">Score: <span className="font-black text-nb-green">{score}/{questions.length}</span></p>
        {score === questions.length && <p className="text-amber-600 font-bold">Perfect! Amazing! ⭐</p>}
        <p className="font-bold text-nb-lime">+{score * 30} points!</p>
        <button onClick={() => setActive(null)}
          className="px-8 py-3 rounded-2xl font-black text-nb-dark shadow hover:shadow-md transition"
          style={{ background: '#FFEB3C' }}>← Back to Quizzes</button>
      </div>
    )

    const q = questions[current]
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setActive(null)} className="text-gray-400 text-sm font-bold">← Back</button>
          <span className="text-sm font-bold text-gray-400">{current + 1}/{questions.length}</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all"
               style={{ width: `${(current / questions.length) * 100}%`, background: 'linear-gradient(90deg,#FFEB3C,#6FC911)' }} />
        </div>
        <div className="bg-white rounded-2xl border border-nb-olive/20 p-5 text-center">
          <p className="text-xl font-black text-nb-dark">{q.text}</p>
        </div>
        <QuestionBody q={q} value={value} onChange={setValue} answered={answered} />
        {!answered
          ? <button onClick={submit} disabled={!hasAnswer(q, value)}
              className="w-full py-3.5 rounded-xl font-black text-nb-dark shadow disabled:opacity-40 transition"
              style={{ background: '#FFEB3C' }}>Submit ✅</button>
          : <button onClick={nextQ}
              className="w-full py-3.5 rounded-xl font-black text-white shadow transition hover:opacity-90"
              style={{ background: '#36913F' }}>
              {current + 1 < questions.length ? 'Next →' : 'See Results 🎉'}
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
  const RANK_BADGES = {
    1: rankBadge1, 2: rankBadge2, 3: rankBadge3, 4: rankBadge4, 5: rankBadge5,
    6: rankBadge6, 7: rankBadge7, 8: rankBadge8, 9: rankBadge9, 10: rankBadge10,
  }

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
              {quiz.bestScore !== null ? <span className="flex items-center gap-1.5"><img src={retryIcon} alt="" className="w-4 h-4 object-contain" /> Retry</span> : 'Start 🚀'}
            </button>
          </div>
        ))}
      </div>

      {/* Quiz Leaderboard */}
      <div className="bg-white rounded-2xl border-2 border-nb-olive/20 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-nb-dark flex items-center gap-1.5"><img src={scoreboardIcon} alt="" className="w-5 h-5 object-contain" /> Class Leaderboard — Primary 4A</h3>
          <span className="text-xs text-gray-400 font-semibold">Times Tables Challenge</span>
        </div>
        <div className="space-y-2.5">
          {LEADERBOARD.map(s => (
            <div key={s.rank}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition ${
                s.isMe ? 'border-nb-yellow shadow-md' : 'border-transparent bg-nb-cream/50'
              }`}
              style={s.isMe ? { background: '#FFEB3C20' } : {}}>
              <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                {RANK_BADGES[s.rank]
                  ? <img src={RANK_BADGES[s.rank]} alt={`Rank ${s.rank}`} className="w-9 h-9 object-contain" />
                  : <span className="text-sm font-black text-gray-400">#{s.rank}</span>}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`font-black text-sm truncate ${s.isMe ? 'text-nb-dark' : 'text-gray-600'}`}>
                  {s.name} {s.isMe && <span className="text-xs font-bold text-nb-green">(You)</span>}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-black text-nb-dark text-sm">{s.score}%</p>
                <p className="text-[10px] text-gray-400 flex items-center justify-end gap-0.5"><img src={starYellow} alt="" className="w-2.5 h-2.5 object-contain" /> {s.points} pts</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-3">Leaderboard updates after each quiz attempt · Visible to all class members</p>
      </div>
    </div>
  )
}
