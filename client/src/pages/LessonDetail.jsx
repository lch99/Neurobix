import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LOCKED_IDS, STUDENT_TABS, useForceOpenIds } from '../data/lessons'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../lib/api'
import Navbar from '../components/Navbar'
import StudySet from '../components/StudySet'
import { QuestionCard, hasAnswer } from '../components/AssessmentQuestion'
import logoWhite from '../assets/Asset 1@3x 1_White.png'
import {
  lockIcon, brainIcon, passIcon, teacherIcon, durationIcon, starYellow,
  lightBulbIcon, playIcon, assessmentPassIcon,
} from '../assets/icons'

const TYPE_LABEL = { video: 'Video', flashcard: 'Flash Cards', assessment: 'Assessment', reading: 'Reading', activity: 'Activity' }

const FALLBACK_LESSON = {
  title: 'Lesson', subject: 'Subject', type: 'video', difficulty: 'Easy',
  teacherName: 'Teacher', points: 30, description: 'This lesson is coming soon!',
}

export default function LessonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()

  const [lesson, setLesson]       = useState(null)
  const [cards, setCards]         = useState([])
  const [assessment, setAssessment] = useState(null)
  const [ownerClass, setOwnerClass] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setCompleted(false)
    setAssessment(null)
    setCards([])
    setOwnerClass(null)

    async function load() {
      const found = await apiRequest(`/api/lessons/${id}`, { token })
      if (cancelled) return
      if (!found) {
        setLesson({ ...FALLBACK_LESSON, title: `Lesson ${id}` })
        setLoading(false)
        return
      }
      setLesson(found)
      if (found.classId) {
        const allClasses = await apiRequest('/api/classes', { token })
        if (!cancelled) setOwnerClass((allClasses || []).find(c => c.id === found.classId) || null)
      }
      if (found.type === 'flashcard') {
        const deck = await apiRequest(`/api/flashcards?lessonId=${id}`, { token })
        if (!cancelled) setCards(deck || [])
      } else if (found.type === 'assessment') {
        const a = await apiRequest(`/api/assessments/by-lesson/${id}`, { token })
        if (!cancelled) setAssessment(a)
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [id])

  const forceOpenIds = useForceOpenIds()
  const sequentialLocked = LOCKED_IDS.has(Number(id)) && !forceOpenIds.has(Number(id))
  // An archived class hides its lessons from students again unless Admin has force-opened a term.
  const archivedLocked = ownerClass?.status === 'archived' && !ownerClass?.forcedOpenTerm
  const isLocked = sequentialLocked || archivedLocked

  if (isLocked) {
    return (
      <div className="min-h-screen bg-nb-cream flex flex-col">
        <div className="bg-white border-b-2 border-nb-olive/20 sticky top-0 z-50 shadow-sm">
          <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-nb-green text-2xl font-bold">←</button>
            <p className="font-black text-nb-dark">{lesson?.title || 'Lesson'}</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl border-2 border-gray-200 p-10 max-w-sm w-full text-center shadow-lg">
            <img src={lockIcon} alt="" className="w-16 h-16 mx-auto mb-4 object-contain" />
            <h2 className="text-2xl font-black text-nb-dark">{archivedLocked ? 'Class Archived' : 'Lesson Locked'}</h2>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              {archivedLocked
                ? <>This class has been archived. Ask your teacher or Neurobix admin to reopen a term to access <strong>{lesson?.title || 'this lesson'}</strong> again.</>
                : <>You need to complete the previous lesson before unlocking <strong>{lesson?.title || 'this lesson'}</strong>.</>}
            </p>
            <div className="mt-4 p-3 rounded-xl text-xs font-semibold text-nb-dark border-2 border-nb-yellow flex items-center gap-2 text-left"
                 style={{ background: '#FFEB3C22' }}>
              <img src={brainIcon} alt="" className="w-6 h-6 object-contain flex-shrink-0" />
              {archivedLocked
                ? <span><strong>Neurobix tip:</strong> Your progress and certificates for this class are safe — they'll be right here once it reopens.</span>
                : <span><strong>Neurobix tip:</strong> Sequential learning helps your brain build knowledge step by step — like building blocks!</span>}
            </div>
            <button onClick={() => navigate('/lessons')}
              className="mt-6 w-full py-3 rounded-2xl font-black text-nb-dark shadow-md transition hover:shadow-lg"
              style={{ background: '#FFEB3C' }}>
              ← Back to Lessons
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading || !lesson) return (
    <div className="min-h-screen bg-nb-cream flex items-center justify-center">
      <p className="text-sm text-gray-400 font-semibold">Loading lesson…</p>
    </div>
  )

  const DIFF_COLOR = { Easy: 'bg-green-100 text-green-700', Medium: 'bg-yellow-100 text-yellow-700', Hard: 'bg-red-100 text-red-600' }

  function handleTabChange(tab) {
    if (tab === 'lessons') { navigate('/lessons'); return }
    navigate('/student', { state: { tab } })
  }

  return (
    <div className="min-h-screen bg-nb-cream">
      <Navbar role="student" userName="Ahmad bin Hassan" points={1240} avatar="AH"
              tabs={STUDENT_TABS} activeTab="lessons" onTabChange={handleTabChange} />

      {/* Hero (full-width) */}
      <div className="w-full text-white relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg,#6FC911,#396336)' }}>
        <img src={logoWhite} alt="" className="absolute -right-2 -top-2 h-24 w-auto opacity-20 select-none pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 py-6 relative">
          <p className="text-sm text-green-100/80 mb-3">
            <button onClick={() => navigate('/lessons')} className="hover:text-white font-semibold">Lessons</button>
            {' '}&gt;{' '}
            <span className="text-white font-semibold">{lesson.title}</span>
            {completed && (
              <span className="ml-3 bg-green-100 text-green-700 text-xs font-black px-3 py-1.5 rounded-full align-middle inline-flex items-center gap-1"><img src={passIcon} alt="" className="w-3.5 h-3.5 object-contain" /> Done!</span>
            )}
          </p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">{lesson.subject}</span>
            <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full">{TYPE_LABEL[lesson.type] || lesson.type}</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${DIFF_COLOR[lesson.difficulty] || DIFF_COLOR.Medium}`}>{lesson.difficulty || 'Medium'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight">{lesson.title}</h1>
          <p className="text-green-100 mt-2 text-sm leading-relaxed">{lesson.description}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* Info bar */}
        <div className="bg-white rounded-2xl border border-nb-olive/20 p-4 flex flex-wrap gap-4 sm:gap-8 justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-full bg-nb-cream flex items-center justify-center p-2 flex-shrink-0"><img src={teacherIcon} alt="" className="w-full h-full object-contain" /></span>
            <div>
              <p className="text-xs text-gray-400">Teacher</p>
              <p className="text-sm font-bold text-nb-dark">{lesson.teacherName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-full bg-nb-cream flex items-center justify-center p-2 flex-shrink-0"><img src={durationIcon} alt="" className="w-full h-full object-contain" /></span>
            <div>
              <p className="text-xs text-gray-400">Duration</p>
              <p className="text-sm font-bold text-nb-dark">{lesson.durationMinutes ? `${lesson.durationMinutes} min` : '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-full bg-nb-cream flex items-center justify-center p-2 flex-shrink-0"><img src={starYellow} alt="" className="w-full h-full object-contain" /></span>
            <div>
              <p className="text-xs text-gray-400">Points</p>
              <p className="text-sm font-bold text-nb-dark">+{lesson.points} pts</p>
            </div>
          </div>
        </div>

        {/* Objectives + Memory Tip — only shown when the teacher/curriculum has authored them */}
        {(lesson.objectives?.length > 0 || lesson.memoryTip) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {lesson.objectives?.length > 0 && (
              <div className="bg-white rounded-2xl border border-nb-olive/20 p-5">
                <h2 className="font-black text-nb-dark mb-3 flex items-center gap-1.5"><img src={lightBulbIcon} alt="" className="w-5 h-5 object-contain" /> What You'll Learn</h2>
                <ul className="space-y-2">
                  {lesson.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <span className="text-nb-green font-bold flex-shrink-0">✔</span>
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lesson.memoryTip && (
              <div className="rounded-2xl p-5 border-2" style={{ background: '#FFF7E9', borderColor: '#FFEB3C' }}>
                <h2 className="font-black text-nb-dark mb-3 flex items-center gap-1.5"><img src={brainIcon} alt="" className="w-5 h-5 object-contain" /> Neurobix Memory Tip</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{lesson.memoryTip}</p>
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        {lesson.type === 'video'      && <VideoContent    lesson={lesson} onComplete={() => setCompleted(true)} completed={completed} />}
        {lesson.type === 'flashcard'  && (
          <StudySet title={lesson.title} subject={lesson.subject} cards={cards}
            deckKey={`lesson-${lesson.id}`} onComplete={() => setCompleted(true)} />
        )}
        {lesson.type === 'assessment' && (assessment
          ? <AssessmentContent assessment={assessment} onComplete={() => setCompleted(true)} />
          : <p className="text-sm text-gray-400">This assessment has no questions yet.</p>)}
        {lesson.type === 'reading'    && <ReadingContent  text={lesson.readingSections} points={lesson.points} onComplete={() => setCompleted(true)} completed={completed} />}
        {lesson.type === 'activity'   && (
          <div className="bg-white rounded-3xl border-2 border-dashed border-nb-olive/30 p-10 text-center">
            <p className="text-4xl mb-2">🎨</p>
            <p className="font-black text-nb-dark">This activity is coming soon!</p>
            <p className="text-sm text-gray-400 mt-1">Check back after your teacher publishes the material.</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Video ─── */
function VideoContent({ lesson, onComplete, completed }) {
  const [watching, setWatching] = useState(false)
  const [progress, setProgress] = useState(0)

  function startWatch() {
    setWatching(true)
    let p = 0
    const interval = setInterval(() => {
      p += 5
      setProgress(p)
      if (p >= 100) { clearInterval(interval); onComplete() }
    }, 300)
  }

  return (
    <div className="space-y-4">
      <div className="bg-black rounded-3xl overflow-hidden aspect-video flex items-center justify-center relative shadow-xl">
        {!watching ? (
          <button onClick={startWatch} className="flex flex-col items-center gap-4 text-white hover:scale-105 transition-transform">
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl p-4"
                 style={{ background: 'linear-gradient(135deg,#FFEB3C,#6FC911)' }}>
              <img src={playIcon} alt="" className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-semibold opacity-70">Tap to play lesson</span>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4 text-white w-full px-8">
            <div className="text-6xl">🎬</div>
            <p className="text-sm font-semibold opacity-70">Now playing: {lesson.title}…</p>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-200"
                   style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#FFEB3C,#6FC911)' }} />
            </div>
            <span className="text-xs opacity-50">{progress}%</span>
          </div>
        )}
      </div>
      {completed && <CompletionBanner points={lesson.points} />}
    </div>
  )
}

// Matches StudySet's local helper exactly, so the elapsed-time readout looks identical
// whether you're taking an Assessment or a Quiz.
function formatSeconds(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/* ─── Assessment ─── */
function AssessmentContent({ assessment, onComplete }) {
  const { user, token } = useAuth()
  const questions = assessment.questions
  const [current, setCurrent] = useState(0)
  const [value, setValue] = useState(null)
  const [answers, setAnswers] = useState({})
  const [answered, setAnswered] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (result) return
    const t = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [result])

  if (!questions || questions.length === 0) return (
    <div className="bg-white rounded-3xl border-2 border-dashed border-nb-olive/30 p-10 text-center">
      <p className="text-4xl mb-2">📝</p>
      <p className="font-black text-nb-dark">No questions yet</p>
      <p className="text-sm text-gray-400 mt-1">Check back after your teacher adds questions to this assessment.</p>
    </div>
  )

  function submit() {
    setAnswers(prev => ({ ...prev, [questions[current].id]: value }))
    setAnswered(true)
  }

  async function next() {
    setAnswered(false)
    if (current + 1 < questions.length) {
      setValue(null)
      setCurrent(c => c + 1)
      return
    }
    setSubmitting(true)
    const finalAnswers = { ...answers, [questions[current].id]: value }
    const attempt = await apiRequest(`/api/assessments/${assessment.id}/attempts`, {
      method: 'POST',
      body: { studentId: user.id, studentName: user.name, answers: finalAnswers },
      token,
    })
    if (assessment.leaderboard) {
      const rows = await apiRequest(`/api/assessments/${assessment.id}/attempts`, { token })
      setLeaderboard(rows || [])
    }
    setResult(attempt)
    setSubmitting(false)
    onComplete()
  }

  if (submitting) return <p className="text-sm text-gray-400 text-center py-10">Grading…</p>

  if (result) {
    const pct = result.totalPoints > 0 ? result.score / result.totalPoints : 0
    const earned = Math.round(pct * assessment.rewardPoints)
    const passed = Math.round(pct * 100) >= assessment.passMark
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-3xl border-2 border-nb-olive/20 p-8 text-center space-y-4">
          <div className="flex justify-center">{pct === 1 ? <img src={assessmentPassIcon} alt="" className="w-24 h-24 object-contain" /> : <span className="text-7xl">{pct >= 0.5 ? '👍' : '📖'}</span>}</div>
          <h2 className="text-3xl font-black text-nb-dark">Assessment Complete!</h2>
          <p className="text-xl text-gray-600">Score: <span className="font-black text-nb-green">{result.score}/{result.totalPoints}</span></p>
          <p className="text-sm text-gray-400">Time: {formatSeconds(seconds)}</p>
          <p className={`text-sm font-bold ${passed ? 'text-nb-green' : 'text-amber-600'}`}>
            {passed ? '✅ ' : ''}Pass mark: {assessment.passMark}%{passed ? ' — Passed!' : ''}
          </p>
          {pct === 1 && <p className="font-bold text-amber-600">🎉 Perfect Score! You're a superstar!</p>}
          <p className="font-black text-nb-lime">+{earned} points earned!</p>
        </div>

        {assessment.leaderboard && (
          <div className="bg-white rounded-2xl border-2 border-nb-olive/20 p-5">
            <h3 className="font-black text-nb-dark mb-3 flex items-center gap-1.5">🏆 Leaderboard</h3>
            {leaderboard.length === 0 ? (
              <p className="text-sm text-gray-400">No attempts yet.</p>
            ) : (
              <div className="space-y-1.5">
                {leaderboard.slice(0, 10).map((a, i) => (
                  <div key={a.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm ${a.studentId === user.id ? 'text-nb-dark font-black' : 'text-gray-600'}`}
                    style={a.studentId === user.id ? { background: '#6FC91112' } : {}}>
                    <span>{i + 1}. {a.studentName}</span>
                    <span className="font-bold">{a.score}/{a.totalPoints}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const q = questions[current]
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm font-semibold text-gray-500">
        <span>Question {current + 1} of {questions.length}</span>
        <span>⏱ {formatSeconds(seconds)}</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${(current / questions.length) * 100}%`, background: 'linear-gradient(90deg,#FFEB3C,#6FC911)' }} />
      </div>
      <QuestionCard q={q} value={value} onChange={setValue} answered={answered} />
      {!answered
        ? <button onClick={submit} disabled={!hasAnswer(q, value)}
            className="w-full py-4 text-nb-dark text-lg font-black rounded-2xl shadow-md disabled:opacity-40 transition hover:shadow-lg"
            style={{ background: '#FFEB3C' }}>Submit Answer ✅</button>
        : <button onClick={next}
            className="w-full py-4 text-white text-lg font-black rounded-2xl shadow-md transition hover:opacity-90"
            style={{ background: '#36913F' }}>
            {current + 1 < questions.length ? 'Next Question →' : 'See Results 🎉'}
          </button>
      }
    </div>
  )
}

/* ─── Reading ─── */
function ReadingContent({ text = [], points, onComplete, completed }) {
  const [read, setRead] = useState(new Set())

  function markRead(i) {
    const next = new Set(read).add(i)
    setRead(next)
    if (next.size === text.length && !completed) onComplete()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm font-semibold text-gray-500">
        <span>📖 Reading Lesson</span>
        <span>{read.size}/{text.length} sections read</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${(read.size / (text.length || 1)) * 100}%`, background: 'linear-gradient(90deg,#FFEB3C,#6FC911)' }} />
      </div>
      {text.map((section, i) => (
        <div key={i} onClick={() => markRead(i)}
          className={`bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all hover:shadow-md ${read.has(i) ? 'border-nb-green' : 'border-nb-olive/20 hover:border-nb-olive/50'}`}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-black text-nb-dark text-base">{section.heading}</h3>
            {read.has(i) && <img src={passIcon} alt="" className="w-5 h-5 object-contain flex-shrink-0" />}
          </div>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">{section.body}</p>
          {!read.has(i) && <p className="text-xs mt-3 font-semibold" style={{ color: '#91BA4F' }}>👆 Tap after reading to mark done</p>}
        </div>
      ))}
      {completed && <CompletionBanner points={points} />}
    </div>
  )
}

/* ─── Shared: Completion Banner ─── */
function CompletionBanner({ points }) {
  return (
    <div className="rounded-2xl p-5 text-center border-2 border-nb-yellow shadow-md"
         style={{ background: 'linear-gradient(135deg,#FFEB3C22,#6FC91122)' }}>
      <p className="text-4xl mb-2">🎉</p>
      <p className="font-black text-nb-dark text-lg">Lesson Complete!</p>
      <p className="text-nb-green font-bold mt-1 flex items-center justify-center gap-1">+{points} points added to your total <img src={starYellow} alt="" className="w-4 h-4 object-contain" /></p>
      <p className="text-gray-500 text-sm mt-1">Keep going — you're doing amazing!</p>
    </div>
  )
}
