import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LOCKED_IDS, useForceOpenIds } from '../data/lessons'
import Navbar from '../components/Navbar'
import QuestionBody, { hasAnswer, isCorrectAnswer } from '../components/AssessmentQuestion'
import logoWhite from '../assets/Asset 1@3x 1_White.png'
import {
  lockIcon, brainIcon, passIcon, teacherIcon, durationIcon, starYellow,
  lightBulbIcon, playIcon, retryIcon, assessmentPassIcon,
} from '../assets/icons'

const TABS = [
  { id: 'home',       icon: '🏠', label: 'Home'       },
  { id: 'lessons',    icon: '📚', label: 'Lessons'    },
  { id: 'flashcards', icon: '🃏', label: 'Flash Cards' },
  { id: 'schedule',   icon: '📅', label: 'Schedule'   },
  { id: 'rewards',    icon: '🏆', label: 'Rewards'    },
]

const TYPE_LABEL = { video: 'Video', flashcard: 'Flash Cards', assessment: 'Assessment', reading: 'Reading' }

const LESSON_DATA = {
  18: {
    title: 'The Human Body',
    subject: 'Science', type: 'flashcard', duration: '16 min', difficulty: 'Medium', icon: '🃏',
    teacher: 'Mr Alif Ibrahim', points: 40,
    desc: 'Learn the major organs and their functions with labelled flash cards.',
    objectives: ['Name the major organs', 'Describe what each organ does', 'Recall organ facts in under 5 seconds'],
    memoryTip: 'Picture a "factory" inside your body — the heart is the pump room, the lungs are the air vents, the brain is the control room!',
    content: 'flashcard',
    cards: [
      { front: 'What pumps blood around your body?', back: 'Heart 🫀',  hint: 'It beats about 100,000 times a day!' },
      { front: 'What organ helps you breathe?',       back: 'Lungs',    hint: 'You have two of them!' },
      { front: 'What organ is your body\'s control room?', back: 'Brain', hint: 'It sends signals through your nerves.' },
      { front: 'What organ filters your blood?',      back: 'Kidneys',  hint: 'You have a pair of these too.' },
      { front: 'What organ digests your food?',       back: 'Stomach',  hint: 'It uses acid to break down food.' },
    ],
  },
  20: {
    title: 'States of Matter',
    subject: 'Science', type: 'assessment', duration: '12 min', difficulty: 'Easy', icon: '📝',
    teacher: 'Mr Alif Ibrahim', points: 40,
    desc: 'Solid, liquid, gas — test yourself on how matter changes state.',
    objectives: ['Identify the three states of matter', 'Explain melting, freezing and boiling', 'Give real-life examples of each state'],
    memoryTip: 'Solid = "stuck together and still". Liquid = "loose and flowing". Gas = "gone and spread out"! Say it out loud to lock it in.',
    content: 'assessment',
    questions: [
      { id: 2001, type: 'mcq',       text: 'What state of matter is ice?', options: ['Solid','Liquid','Gas','Plasma'], answer: 0 },
      { id: 2002, type: 'true_false', text: 'Water turns into steam when it freezes.', answer: false },
      { id: 2003, type: 'fill_in',   text: 'Solid → Liquid is called ___.', answer: 'melting' },
      { id: 2004, type: 'drag_drop', text: 'Sort each example into its state of matter', options: {
          buckets: ['Solid', 'Liquid', 'Gas'],
          items: [
            { label: 'Ice cube', bucket: 'Solid' },
            { label: 'Steam',    bucket: 'Gas' },
            { label: 'Juice',    bucket: 'Liquid' },
            { label: 'Rock',     bucket: 'Solid' },
          ] } },
    ],
  },
  7: {
    title: 'The Solar System',
    subject: 'Science', type: 'video', duration: '18 min', difficulty: 'Easy', icon: '🎬',
    teacher: 'Mr Alif Ibrahim', points: 50,
    desc: 'Journey through the 8 planets! Remember them with the Neurobix mnemonic memory trick.',
    objectives: ['Name all 8 planets in order', 'Know key facts about each planet', 'Use mnemonics to memorise them'],
    memoryTip: '"My Very Educated Mother Just Served Us Nachos" — Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. Say it 3 times fast! 🪐',
    content: 'video',
  },
}

export default function LessonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const lesson = LESSON_DATA[id] || {
    title: `Lesson ${id}`, subject: 'Subject', type: 'video', duration: '10 min', difficulty: 'Easy',
    icon: '📚', teacher: 'Teacher', points: 30, desc: 'This lesson is coming soon!',
    objectives: ['Stay tuned!'], memoryTip: 'Review regularly for best results.',
    content: 'video',
  }
  const [completed, setCompleted] = useState(false)

  const forceOpenIds = useForceOpenIds()
  const isLocked = LOCKED_IDS.has(Number(id)) && !forceOpenIds.has(Number(id))

  if (isLocked) {
    return (
      <div className="min-h-screen bg-nb-cream flex flex-col">
        <div className="bg-white border-b-2 border-nb-olive/20 sticky top-0 z-50 shadow-sm">
          <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-nb-green text-2xl font-bold">←</button>
            <p className="font-black text-nb-dark">{lesson.title}</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl border-2 border-gray-200 p-10 max-w-sm w-full text-center shadow-lg">
            <img src={lockIcon} alt="" className="w-16 h-16 mx-auto mb-4 object-contain" />
            <h2 className="text-2xl font-black text-nb-dark">Lesson Locked</h2>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              You need to complete the previous lesson before unlocking <strong>{lesson.title}</strong>.
            </p>
            <div className="mt-4 p-3 rounded-xl text-xs font-semibold text-nb-dark border-2 border-nb-yellow flex items-center gap-2 text-left"
                 style={{ background: '#FFEB3C22' }}>
              <img src={brainIcon} alt="" className="w-6 h-6 object-contain flex-shrink-0" /> <span><strong>Neurobix tip:</strong> Sequential learning helps your brain build knowledge step by step — like building blocks!</span>
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

  const DIFF_COLOR = { Easy: 'bg-green-100 text-green-700', Medium: 'bg-yellow-100 text-yellow-700', Hard: 'bg-red-100 text-red-600' }

  function handleTabChange(tab) {
    if (tab === 'lessons') { navigate('/lessons'); return }
    navigate('/student', { state: { tab } })
  }

  return (
    <div className="min-h-screen bg-nb-cream">
      <Navbar role="student" userName="Ahmad bin Hassan" points={1240} avatar="AH"
              tabs={TABS} activeTab="lessons" onTabChange={handleTabChange} />

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
            <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full">{TYPE_LABEL[lesson.content] || lesson.type}</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${DIFF_COLOR[lesson.difficulty]}`}>{lesson.difficulty}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight">{lesson.title}</h1>
          <p className="text-green-100 mt-2 text-sm leading-relaxed">{lesson.desc}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* Info bar */}
        <div className="bg-white rounded-2xl border border-nb-olive/20 p-4 flex flex-wrap gap-4 sm:gap-8 justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-full bg-nb-cream flex items-center justify-center p-2 flex-shrink-0"><img src={teacherIcon} alt="" className="w-full h-full object-contain" /></span>
            <div>
              <p className="text-xs text-gray-400">Teacher</p>
              <p className="text-sm font-bold text-nb-dark">{lesson.teacher}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-full bg-nb-cream flex items-center justify-center p-2 flex-shrink-0"><img src={durationIcon} alt="" className="w-full h-full object-contain" /></span>
            <div>
              <p className="text-xs text-gray-400">Duration</p>
              <p className="text-sm font-bold text-nb-dark">{lesson.duration}</p>
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

        {/* Objectives + Memory Tip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

          <div className="rounded-2xl p-5 border-2" style={{ background: '#FFF7E9', borderColor: '#FFEB3C' }}>
            <h2 className="font-black text-nb-dark mb-3 flex items-center gap-1.5"><img src={brainIcon} alt="" className="w-5 h-5 object-contain" /> Neurobix Memory Tip</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{lesson.memoryTip}</p>
          </div>
        </div>

        {/* Main Content */}
        {lesson.content === 'video'     && <VideoContent    lesson={lesson} onComplete={() => setCompleted(true)} completed={completed} />}
        {lesson.content === 'flashcard' && <FlashCardContent cards={lesson.cards} points={lesson.points} onComplete={() => setCompleted(true)} completed={completed} />}
        {lesson.content === 'assessment' && <AssessmentContent questions={lesson.questions} points={lesson.points} onComplete={() => setCompleted(true)} completed={completed} />}
        {lesson.content === 'reading'   && <ReadingContent  text={lesson.text} points={lesson.points} onComplete={() => setCompleted(true)} completed={completed} />}
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

/* ─── Flash Cards ─── */
function FlashCardContent({ cards, points, onComplete, completed }) {
  const [deck, setDeck] = useState(cards)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [seen, setSeen] = useState(new Set())
  const [isShuffled, setIsShuffled] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => () => window.speechSynthesis?.cancel(), [])

  function shuffleDeck() {
    setDeck(d => [...d].sort(() => Math.random() - 0.5))
    setIsShuffled(true)
    setIndex(0)
    setFlipped(false)
    setSeen(new Set())
    window.speechSynthesis?.cancel()
  }

  function restart() {
    setDeck([...cards])
    setIsShuffled(false)
    setIndex(0)
    setFlipped(false)
    setSeen(new Set())
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }

  function speak(text) {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const clean = text.replace(/[\u{1F000}-\u{1FFFF}]/gu, '').trim()
    const utter = new SpeechSynthesisUtterance(clean)
    utter.rate = 0.85
    utter.onstart = () => setSpeaking(true)
    utter.onend = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utter)
  }

  function next() {
    setSeen(prev => new Set(prev).add(index))
    setFlipped(false)
    window.speechSynthesis?.cancel()
    setSpeaking(false)
    if (index + 1 < deck.length) setIndex(index + 1)
    else if (!completed) onComplete()
  }

  function prev() {
    setFlipped(false)
    window.speechSynthesis?.cancel()
    setSpeaking(false)
    if (index > 0) setIndex(index - 1)
  }

  const card = deck[index]
  const currentText = flipped ? card.back : card.front

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2">
          <button onClick={shuffleDeck}
            className={`px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all ${isShuffled ? 'border-nb-green bg-green-50 text-nb-green' : 'border-gray-200 text-gray-500 hover:border-nb-olive'}`}>
            🔀 Shuffle{isShuffled ? ' ✓' : ''}
          </button>
          <button onClick={restart}
            className="px-4 py-2 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-500 hover:border-nb-olive transition-all flex items-center gap-1.5">
            <img src={retryIcon} alt="" className="w-3.5 h-3.5 object-contain" /> Restart
          </button>
        </div>
        <div className="text-sm text-gray-500 font-medium">
          Card {index + 1} / {deck.length} · {seen.size} reviewed ✓
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 justify-center">
        {deck.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all ${i === index ? 'w-6' : i < index ? 'w-2' : 'w-2 bg-gray-200'}`}
               style={i === index ? { background: '#36913F' } : i < index ? { background: '#91BA4F' } : {}} />
        ))}
      </div>

      {/* Card */}
      <div onClick={() => { setFlipped(f => !f); window.speechSynthesis?.cancel(); setSpeaking(false) }}
        className="cursor-pointer bg-white rounded-3xl shadow-lg border-2 p-10 min-h-[220px] flex flex-col items-center justify-center text-center transition-all hover:shadow-xl relative"
        style={{ borderColor: flipped ? '#6FC911' : '#91BA4F40' }}>

        {/* Audio button */}
        <button
          onClick={e => { e.stopPropagation(); speak(currentText) }}
          title="Read aloud"
          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-base border-2 transition-all ${speaking ? 'border-nb-green bg-green-50 animate-pulse' : 'border-gray-100 bg-nb-cream hover:border-nb-green'}`}>
          🔊
        </button>

        {!flipped ? (
          <>
            <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: '#36913F' }}>Question</p>
            <p className="text-2xl font-black text-nb-dark">{card.front}</p>
            <p className="text-xs text-gray-400 mt-5 bg-nb-cream px-3 py-1.5 rounded-full">👆 Tap to reveal answer</p>
          </>
        ) : (
          <>
            <p className="text-xs font-black uppercase tracking-widest mb-4 text-nb-lime">Answer</p>
            <p className="text-3xl font-black" style={{ color: '#36913F' }}>{card.back}</p>
            {card.hint && (
              <div className="mt-4 text-xs rounded-xl px-4 py-2 border font-medium" style={{ background: '#FFF7E9', borderColor: '#FFEB3C', color: '#396336' }}>
                🧠 {card.hint}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-4 bg-nb-cream px-3 py-1.5 rounded-full">👆 Tap to flip back</p>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button onClick={prev} disabled={index === 0}
          className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-500 font-bold hover:border-nb-olive transition disabled:opacity-30">
          ← Previous
        </button>
        <button onClick={next}
          className="flex-1 py-3 rounded-2xl font-black text-nb-dark shadow-md hover:shadow-lg transition"
          style={{ background: '#FFEB3C' }}>
          {index + 1 < deck.length ? 'Next →' : '✅ Finish!'}
        </button>
      </div>
      {completed && <CompletionBanner points={points} />}
    </div>
  )
}

/* ─── Assessment ─── */
function AssessmentContent({ questions, points, onComplete }) {
  const [current, setCurrent] = useState(0)
  const [value, setValue] = useState(null)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [done, setDone] = useState(false)

  function submit() {
    if (isCorrectAnswer(questions[current], value)) setScore(s => s + 1)
    setAnswered(true)
  }
  function next() {
    setAnswered(false); setValue(null)
    if (current + 1 < questions.length) setCurrent(c => c + 1)
    else { setDone(true); onComplete() }
  }

  if (done) return (
    <div className="bg-white rounded-3xl border-2 border-nb-olive/20 p-8 text-center space-y-4">
      <div className="flex justify-center">{score === questions.length ? <img src={assessmentPassIcon} alt="" className="w-24 h-24 object-contain" /> : <span className="text-7xl">{score >= questions.length / 2 ? '👍' : '📖'}</span>}</div>
      <h2 className="text-3xl font-black text-nb-dark">Assessment Complete!</h2>
      <p className="text-xl text-gray-600">Score: <span className="font-black text-nb-green">{score}/{questions.length}</span></p>
      {score === questions.length && <p className="font-bold text-amber-600">🎉 Perfect Score! You're a superstar!</p>}
      <p className="font-black text-nb-lime">+{Math.round((score / questions.length) * points)} points earned!</p>
    </div>
  )

  const q = questions[current]
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm font-semibold text-gray-500">
        <span>Question {current + 1} of {questions.length}</span>
        <span>Score: {score}</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${(current / questions.length) * 100}%`, background: 'linear-gradient(90deg,#FFEB3C,#6FC911)' }} />
      </div>
      <div className="bg-white rounded-2xl border-2 border-nb-olive/20 p-6 text-center">
        <p className="text-xl font-black text-nb-dark">{q.text}</p>
      </div>
      <QuestionBody q={q} value={value} onChange={setValue} answered={answered} />
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
