import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../lib/api'
import { useSpeech } from '../lib/speech'
import { QuestionCard, hasAnswer, isCorrectAnswer } from './AssessmentQuestion'
import { starYellow, starOutline, retryIcon } from '../assets/icons'

const MODES = [
  { id: 'flashcards', icon: '🃏', label: 'Flashcards' },
  { id: 'learn',      icon: '🧠', label: 'Learn' },
  { id: 'test',       icon: '📝', label: 'Test' },
  { id: 'match',      icon: '⚡', label: 'Match' },
]

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function formatSeconds(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

// Auto-builds a question from one card, sampling distractors from the rest of the set —
// shared by Learn and Test mode so a flashcard set can be "quizzed" without a teacher
// having authored MCQ/fill-in questions for it.
function generateQuestion(card, allCards) {
  const typed = allCards.length < 4 || Math.random() < 0.35
  if (typed) {
    return { id: card.id, type: 'fill_in', text: card.front, answer: card.back, points: 1 }
  }
  const distractors = shuffleArray(allCards.filter(c => c.id !== card.id).map(c => c.back)).slice(0, 3)
  const options = shuffleArray([card.back, ...distractors])
  return { id: card.id, type: 'mcq', text: card.front, options, answer: options.indexOf(card.back), points: 1 }
}

/**
 * A Quizlet-style study set: a mode picker (Flashcards/Learn/Test/Match) over one shared
 * `cards` array. Used both for a lesson's flashcard deck and a student's personal library.
 *
 * `deckKey` must be a stable identifier for this exact set of cards (e.g. `lesson-18` or
 * `library`) — it namespaces the per-student progress/best-time persisted for this set.
 */
export default function StudySet({ title, subject, cards, deckKey, onExit, onComplete, onToggleLibrary, isInLibrary, onTestComplete }) {
  const { user, token } = useAuth()
  const [mode, setMode] = useState('flashcards')
  const [progress, setProgress] = useState({})

  useEffect(() => {
    let cancelled = false
    apiRequest(`/api/flashcard-progress?studentId=${user.id}`, { token }).then(rows => {
      if (cancelled) return
      const map = {}
      ;(rows || []).forEach(r => { map[r.cardId] = r })
      setProgress(map)
    })
    return () => { cancelled = true }
  }, [user.id])

  async function updateProgress(cardId, patch) {
    const updated = await apiRequest('/api/flashcard-progress', {
      method: 'POST',
      body: { studentId: user.id, cardId, ...patch },
      token,
    })
    setProgress(p => ({ ...p, [cardId]: updated }))
  }

  if (!cards || cards.length === 0) return (
    <div className="bg-white rounded-3xl border-2 border-dashed border-nb-olive/30 p-10 text-center">
      <p className="text-4xl mb-2">🃏</p>
      <p className="font-black text-nb-dark">No cards in this set yet</p>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {onExit && (
            <button onClick={onExit}
              className="text-sm font-bold text-gray-400 hover:text-nb-dark transition px-3 py-1.5 rounded-lg hover:bg-gray-100 flex-shrink-0">
              ← Back
            </button>
          )}
          {title && (
            <div className="min-w-0">
              {subject && <p className="text-[11px] font-black uppercase tracking-wide text-nb-green">{subject}</p>}
              <p className="font-black text-nb-dark text-sm truncate">{title}</p>
            </div>
          )}
        </div>
        <div className="flex gap-1 bg-nb-cream rounded-2xl p-1 flex-wrap">
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${mode === m.id ? 'bg-white text-nb-dark shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
              <span>{m.icon}</span> {m.label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'flashcards' && (
        <FlashcardsMode cards={cards} progress={progress} onUpdateProgress={updateProgress}
          onComplete={onComplete} onToggleLibrary={onToggleLibrary} isInLibrary={isInLibrary} />
      )}
      {mode === 'learn' && <LearnMode cards={cards} onUpdateProgress={updateProgress} />}
      {mode === 'test'  && <TestMode cards={cards} onComplete={onTestComplete} />}
      {mode === 'match' && <MatchMode cards={cards} deckKey={deckKey} studentId={user.id} />}
    </div>
  )
}

/* ─── Flashcards mode: flip, shuffle, audio, star, know-it ─── */
function FlashcardsMode({ cards, progress, onUpdateProgress, onComplete, onToggleLibrary, isInLibrary }) {
  const [deck, setDeck] = useState(cards)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [seen, setSeen] = useState(new Set())
  const [isShuffled, setIsShuffled] = useState(false)
  const { speak, cancel, isSpeaking } = useSpeech()

  const card = deck[index]
  const currentText = flipped ? card.back : card.front
  const cardProgress = progress[card.id]
  const saved = isInLibrary?.(card) ?? false

  function shuffleDeck() { setDeck(d => shuffleArray(d)); setIsShuffled(true); setIndex(0); setFlipped(false); setSeen(new Set()); cancel() }
  function restart() { setDeck([...cards]); setIsShuffled(false); setIndex(0); setFlipped(false); setSeen(new Set()); cancel() }
  function next() {
    setSeen(prev => new Set(prev).add(index))
    setFlipped(false); cancel()
    if (index + 1 < deck.length) setIndex(index + 1)
    else onComplete?.()
  }
  function prev() { setFlipped(false); cancel(); if (index > 0) setIndex(index - 1) }
  function markKnown(status) {
    const streak = status === 'known' ? (cardProgress?.correctStreak || 0) + 1 : 0
    onUpdateProgress(card.id, { status, correctStreak: streak })
    next()
  }

  return (
    <div className="space-y-4">
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
        <div className="text-sm text-gray-500 font-medium">Card {index + 1} / {deck.length} · {seen.size} reviewed ✓</div>
      </div>

      <div className="flex gap-1.5 justify-center">
        {deck.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all ${i === index ? 'w-6' : i < index ? 'w-2' : 'w-2 bg-gray-200'}`}
               style={i === index ? { background: '#36913F' } : i < index ? { background: '#91BA4F' } : {}} />
        ))}
      </div>

      <div onClick={() => { setFlipped(f => !f); cancel() }}
        className="cursor-pointer bg-white rounded-3xl shadow-lg border-2 p-10 min-h-[220px] flex flex-col items-center justify-center text-center transition-all hover:shadow-xl relative"
        style={{ borderColor: flipped ? '#6FC911' : '#91BA4F40' }}>

        <div className="absolute top-4 right-4 flex items-center gap-2">
          {onToggleLibrary && (
            <button onClick={e => { e.stopPropagation(); onToggleLibrary(card) }} title={saved ? 'Remove from My Saved Cards' : 'Save to My Saved Cards'}
              className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${saved ? 'border-nb-yellow' : 'border-gray-100 bg-nb-cream hover:border-nb-yellow'}`}
              style={saved ? { background: '#FFEB3C' } : {}}>
              <img src={saved ? starYellow : starOutline} alt="" className="w-4 h-4 object-contain" style={saved ? {} : { opacity: 0.5 }} />
            </button>
          )}
          <button onClick={e => { e.stopPropagation(); speak(currentText) }} title="Read aloud"
            className={`w-9 h-9 rounded-full flex items-center justify-center text-base border-2 transition-all ${isSpeaking(currentText) ? 'border-nb-green bg-green-50 animate-pulse' : 'border-gray-100 bg-nb-cream hover:border-nb-green'}`}>
            🔊
          </button>
        </div>

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

      {flipped ? (
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => markKnown('learning')}
            className="py-3.5 rounded-xl font-black text-red-500 border-2 border-red-200 bg-red-50 hover:bg-red-100 transition text-sm flex items-center justify-center gap-2">
            ↻ Still Learning
          </button>
          <button onClick={() => markKnown('known')}
            className="py-3.5 rounded-xl font-black text-white border-2 border-transparent shadow-md hover:opacity-90 transition text-sm flex items-center justify-center gap-2"
            style={{ background: '#36913F' }}>
            ✓ Know It
          </button>
        </div>
      ) : (
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
      )}
    </div>
  )
}

/* ─── Learn mode: adaptive rounds — wrong/new cards repeat until 2 correct in a row ─── */
function LearnMode({ cards, onUpdateProgress }) {
  const [queue, setQueue] = useState(() => shuffleArray(cards.map((_, i) => i)))
  const [streaks, setStreaks] = useState({})
  const [question, setQuestion] = useState(null)
  const [value, setValue] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 })

  const currentIdx = queue[0]
  const currentCard = currentIdx !== undefined ? cards[currentIdx] : null
  const masteredCount = cards.length - new Set(queue).size

  useEffect(() => {
    if (currentCard) {
      setQuestion(generateQuestion(currentCard, cards))
      setValue(null)
      setAnswered(false)
    }
  }, [currentIdx])

  if (queue.length === 0) return (
    <div className="bg-white rounded-3xl border-2 border-nb-olive/20 p-8 text-center space-y-3">
      <p className="text-5xl">🎉</p>
      <h3 className="text-2xl font-black text-nb-dark">All cards mastered!</h3>
      <p className="text-gray-500">{stats.correct} correct answer{stats.correct === 1 ? '' : 's'} · {stats.incorrect} needed another look</p>
    </div>
  )
  if (!question) return null

  function submit() {
    const correct = isCorrectAnswer(question, value)
    setAnswered(true)
    setStats(s => ({ correct: s.correct + (correct ? 1 : 0), incorrect: s.incorrect + (correct ? 0 : 1) }))
    const nextStreak = correct ? (streaks[currentIdx] || 0) + 1 : 0
    setStreaks(s => ({ ...s, [currentIdx]: nextStreak }))
    onUpdateProgress(currentCard.id, { status: correct && nextStreak >= 2 ? 'known' : 'learning', correctStreak: nextStreak })
  }
  function next() {
    const mastered = (streaks[currentIdx] || 0) >= 2
    setQueue(q => {
      const rest = q.slice(1)
      if (mastered) return rest
      const insertAt = Math.min(rest.length, 2)
      return [...rest.slice(0, insertAt), currentIdx, ...rest.slice(insertAt)]
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm font-semibold text-gray-500">
        <span>{masteredCount} / {cards.length} mastered</span>
        <span>{stats.correct} correct</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${(masteredCount / cards.length) * 100}%`, background: 'linear-gradient(90deg,#FFEB3C,#6FC911)' }} />
      </div>
      <QuestionCard q={question} value={value} onChange={setValue} answered={answered} />
      {!answered
        ? <button onClick={submit} disabled={!hasAnswer(question, value)}
            className="w-full py-4 text-nb-dark text-lg font-black rounded-2xl shadow-md disabled:opacity-40 transition hover:shadow-lg"
            style={{ background: '#FFEB3C' }}>Submit ✅</button>
        : <button onClick={next}
            className="w-full py-4 text-white text-lg font-black rounded-2xl shadow-md transition hover:opacity-90"
            style={{ background: '#36913F' }}>Continue →</button>
      }
    </div>
  )
}

/* ─── Test mode: one timed self-practice pass — never submitted/graded for points or the
   leaderboard, but does report its final score via onComplete so a caller (e.g. a Quiz
   row in My Courses) can show a "you've done this" marker — cosmetic only. ─── */
function TestMode({ cards, onComplete }) {
  const [questions] = useState(() => shuffleArray(cards.map(c => generateQuestion(c, cards))))
  const [current, setCurrent] = useState(0)
  const [value, setValue] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (done) return
    const t = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [done])

  function submit() {
    if (isCorrectAnswer(questions[current], value)) setScore(s => s + 1)
    setAnswered(true)
  }
  function next() {
    setAnswered(false); setValue(null)
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1)
      return
    }
    setDone(true)
    onComplete?.(score, questions.length)
  }

  if (done) return (
    <div className="bg-white rounded-3xl border-2 border-nb-olive/20 p-8 text-center space-y-3">
      <p className="text-5xl">{score === questions.length ? '🏆' : score >= questions.length / 2 ? '👍' : '📖'}</p>
      <h3 className="text-2xl font-black text-nb-dark">Test Complete!</h3>
      <p className="text-xl text-gray-600">Score: <span className="font-black text-nb-green">{score}/{questions.length}</span></p>
      <p className="text-sm text-gray-400">Time: {formatSeconds(seconds)}</p>
      <p className="text-xs text-gray-300">Self-practice only — this test isn't submitted or graded.</p>
    </div>
  )

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

/* ─── Match mode: click-to-pair speed game, best time saved locally per student+set ─── */
const ROUND_SIZE = 8

function bestTimeKey(studentId, deckKey) { return `nb_match_best_${studentId}_${deckKey}` }

function MatchMode({ cards, deckKey, studentId }) {
  const [roundCards] = useState(() => shuffleArray(cards).slice(0, Math.min(ROUND_SIZE, cards.length)))
  const [tiles] = useState(() => shuffleArray(roundCards.flatMap(c => ([
    { key: `${c.id}-front`, cardId: c.id, text: c.front },
    { key: `${c.id}-back`,  cardId: c.id, text: c.back },
  ]))))
  const [selected, setSelected] = useState([])
  const [wrongKeys, setWrongKeys] = useState([])
  const [matched, setMatched] = useState(new Set())
  const [startedAt] = useState(Date.now())
  const [elapsedMs, setElapsedMs] = useState(0)
  const [finished, setFinished] = useState(false)
  const [bestMs, setBestMs] = useState(() => {
    const raw = localStorage.getItem(bestTimeKey(studentId, deckKey))
    return raw ? Number(raw) : null
  })
  const [isNewBest, setIsNewBest] = useState(false)

  useEffect(() => {
    if (finished) return
    const t = setInterval(() => setElapsedMs(Date.now() - startedAt), 100)
    return () => clearInterval(t)
  }, [finished, startedAt])

  function selectTile(tile) {
    if (finished || matched.has(tile.cardId) || wrongKeys.length > 0) return
    if (selected.includes(tile.key)) return
    if (selected.length === 2) return

    const next = [...selected, tile.key]
    setSelected(next)
    if (next.length < 2) return

    const [k1, k2] = next
    const t1 = tiles.find(t => t.key === k1)
    const t2 = tiles.find(t => t.key === k2)
    if (t1.cardId === t2.cardId && t1.key !== t2.key) {
      const newMatched = new Set(matched).add(t1.cardId)
      setMatched(newMatched)
      setSelected([])
      if (newMatched.size === roundCards.length) {
        const finalMs = Date.now() - startedAt
        setElapsedMs(finalMs)
        setFinished(true)
        if (bestMs === null || finalMs < bestMs) {
          setIsNewBest(true)
          setBestMs(finalMs)
          localStorage.setItem(bestTimeKey(studentId, deckKey), String(finalMs))
        }
      }
    } else {
      setWrongKeys(next)
      setTimeout(() => { setWrongKeys([]); setSelected([]) }, 500)
    }
  }

  if (finished) return (
    <div className="bg-white rounded-3xl border-2 border-nb-olive/20 p-8 text-center space-y-3">
      <p className="text-5xl">⚡</p>
      <h3 className="text-2xl font-black text-nb-dark">Matched!</h3>
      <p className="text-xl text-gray-600">Time: <span className="font-black text-nb-green">{(elapsedMs / 1000).toFixed(1)}s</span></p>
      {isNewBest && <p className="font-bold text-amber-600">🏆 New best time!</p>}
      {bestMs !== null && <p className="text-sm text-gray-400">Best: {(bestMs / 1000).toFixed(1)}s</p>}
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm font-semibold text-gray-500">
        <span>{matched.size} / {roundCards.length} pairs</span>
        <span className="flex items-center gap-3">
          {bestMs !== null && <span className="text-gray-400">🏆 Best: {(bestMs / 1000).toFixed(1)}s</span>}
          <span>⏱ {(elapsedMs / 1000).toFixed(1)}s</span>
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {tiles.map(tile => {
          const isMatched = matched.has(tile.cardId)
          const isSelected = selected.includes(tile.key)
          const isWrong = wrongKeys.includes(tile.key)
          if (isMatched) return <div key={tile.key} className="min-h-[84px] rounded-xl border-2 border-dashed border-gray-100" />
          return (
            <button key={tile.key} onClick={() => selectTile(tile)}
              className={`min-h-[84px] p-2.5 rounded-xl border-2 font-bold text-sm text-center flex items-center justify-center transition-all ${
                isWrong ? 'border-red-300 bg-red-50 text-red-500' :
                isSelected ? 'border-nb-yellow shadow-md text-nb-dark' :
                'border-gray-200 bg-white text-gray-700 hover:border-nb-green'
              }`}
              style={isSelected && !isWrong ? { background: '#FFEB3C22' } : {}}>
              {tile.text}
            </button>
          )
        })}
      </div>
      <p className="text-[11px] text-gray-400 text-center">Tap a term, then tap its matching definition.</p>
    </div>
  )
}
