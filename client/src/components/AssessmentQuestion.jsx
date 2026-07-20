import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useSpeech } from '../lib/speech'

const EMPTY = {}

/* ── Grading helpers (shared across the assessment builder preview and in-lesson assessments) ── */

export function isCorrectAnswer(q, value) {
  switch (q.type) {
    case 'true_false':
    case 'mcq':
      return value === q.answer
    case 'fill_in':
    case 'image':
      return typeof value === 'string' && value.trim().toLowerCase() === String(q.answer ?? '').trim().toLowerCase()
    case 'match': {
      const pairs = q.options?.pairs || []
      if (!pairs.length || !value) return false
      return pairs.every((p, i) => value[i] === p.right)
    }
    default:
      return false
  }
}

export function hasAnswer(q, value) {
  switch (q.type) {
    case 'mcq':
    case 'true_false':
      return value !== null && value !== undefined
    case 'fill_in':
    case 'image':
      return typeof value === 'string' && value.trim().length > 0
    case 'match': {
      const pairs = q.options?.pairs || []
      return pairs.length > 0 && pairs.every((_, i) => value?.[i] !== undefined)
    }
    default:
      return false
  }
}

/* ── Question card: text + read-aloud + the type-specific body below it ──
   Shared by real assessments, and Study Set's Learn/Test modes, so audio only
   needed to be added in this one place to cover all three. ── */

export function QuestionCard({ q, value, onChange, answered }) {
  const { speak, isSpeaking } = useSpeech()
  return (
    <>
      <div className="bg-white rounded-2xl border-2 border-nb-olive/20 p-6 text-center relative">
        <button onClick={() => speak(q.text)} title="Read aloud"
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all ${isSpeaking(q.text) ? 'border-nb-green bg-green-50 animate-pulse' : 'border-gray-100 bg-nb-cream hover:border-nb-green'}`}>
          🔊
        </button>
        <p className="text-xl font-black text-nb-dark pr-8">{q.text}</p>
      </div>
      <QuestionBody q={q} value={value} onChange={onChange} answered={answered} speak={speak} isSpeaking={isSpeaking} />
    </>
  )
}

/* ── Question type dispatcher ── */

export default function QuestionBody({ q, value, onChange, answered, speak, isSpeaking }) {
  switch (q.type) {
    case 'true_false': return <TrueFalseBody q={q} value={value} onChange={onChange} answered={answered} />
    case 'fill_in':
    case 'image': return <FillInBody q={q} value={value} onChange={onChange} answered={answered} />
    case 'match': return <MatchBody q={q} value={value} onChange={onChange} answered={answered} />
    case 'mcq':
    default: return <McqBody q={q} value={value} onChange={onChange} answered={answered} speak={speak} isSpeaking={isSpeaking} />
  }
}

/* ── MCQ ── */
function McqBody({ q, value, onChange, answered, speak, isSpeaking }) {
  const options = q.options || []
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {options.map((opt, i) => {
        let cls = 'border-gray-200 bg-white text-gray-700 hover:border-nb-green'
        let style = {}
        if (answered) {
          cls = i === q.answer ? 'border-nb-green bg-green-50 text-nb-dark'
              : i === value ? 'border-red-300 bg-red-50 text-red-500'
              : 'border-gray-100 bg-gray-50 text-gray-300'
        } else if (value === i) {
          cls = 'border-nb-yellow text-nb-dark shadow-md'
          style = { background: '#FFEB3C' }
        }
        return (
          <button key={i} onClick={() => !answered && onChange(i)}
            className={`py-3.5 pl-4 pr-2.5 rounded-xl font-black border-2 transition-all flex items-center justify-between gap-2 ${cls}`} style={style}>
            <span>{opt}{answered && i === q.answer && ' ✅'}{answered && i === value && i !== q.answer && ' ❌'}</span>
            {speak && (
              <span onClick={e => { e.stopPropagation(); speak(opt) }} title="Read aloud"
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${isSpeaking?.(opt) ? 'opacity-100' : 'opacity-40 hover:opacity-80'}`}>
                🔊
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ── True / False ── */
function TrueFalseBody({ q, value, onChange, answered }) {
  return (
    <div className="flex gap-3">
      {[true, false].map(v => {
        let cls = 'border-gray-200 text-gray-400 hover:border-nb-olive'
        let style = {}
        if (answered) {
          cls = v === q.answer ? 'border-nb-green shadow-sm' : v === value ? 'border-red-300 text-red-500' : 'border-gray-100 text-gray-300'
          if (v === q.answer) style = { background: '#6FC91112', color: '#36913F' }
        } else if (value === v) {
          cls = 'border-nb-yellow shadow-sm text-nb-dark'
          style = { background: '#FFEB3C22' }
        }
        return (
          <button key={String(v)} onClick={() => !answered && onChange(v)}
            className={`flex-1 py-3.5 rounded-xl font-black text-sm border-2 transition ${cls}`} style={style}>
            {v ? '✓ True' : '✗ False'}{answered && v === q.answer && ' ✅'}
          </button>
        )
      })}
    </div>
  )
}

/* ── Fill in blank / image-based ── */
function FillInBody({ q, value, onChange, answered }) {
  const correct = answered && isCorrectAnswer(q, value)
  return (
    <div>
      {q.imageUrl && <img src={q.imageUrl} alt="" className="w-full max-h-48 object-contain rounded-xl mb-3 bg-nb-cream" />}
      <input value={value || ''} onChange={e => !answered && onChange(e.target.value)}
        disabled={answered}
        placeholder="Type your answer…"
        className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-bold focus:outline-none transition ${
          answered
            ? (correct ? 'border-nb-green bg-green-50 text-nb-dark' : 'border-red-300 bg-red-50 text-red-500')
            : 'border-gray-200 focus:border-nb-green bg-white'
        }`} />
      {answered && !correct && <p className="text-xs text-gray-400 mt-1.5">Correct answer: <span className="font-bold text-nb-dark">{q.answer}</span></p>}
    </div>
  )
}

/* ── Matching (draw lines) ── */
function seededShuffle(n, seed) {
  const idx = Array.from({ length: n }, (_, i) => i)
  let s = (seed || n || 1) * 9301 + 1
  for (let i = idx.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return idx
}

function MatchBody({ q, value, onChange, answered }) {
  const pairs = q.options?.pairs || []
  const rightOrder = useMemo(() => seededShuffle(pairs.length, q.id), [q.id, pairs.length])
  const connections = value || EMPTY // { [leftIdx]: rightText }

  const [selectedLeft, setSelectedLeft] = useState(null)
  const containerRef = useRef(null)
  const leftRefs = useRef([])
  const rightRefs = useRef([])
  const [lines, setLines] = useState([])
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const onResize = () => setTick(t => t + 1)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useLayoutEffect(() => {
    if (!containerRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const next = []
    Object.entries(connections).forEach(([leftIdxStr, rightText]) => {
      const leftIdx = Number(leftIdxStr)
      const rightPos = rightOrder.findIndex(origIdx => pairs[origIdx]?.right === rightText)
      const leftEl = leftRefs.current[leftIdx]
      const rightEl = rightPos >= 0 ? rightRefs.current[rightPos] : null
      if (!leftEl || !rightEl) return
      const lr = leftEl.getBoundingClientRect()
      const rr = rightEl.getBoundingClientRect()
      next.push({
        key: leftIdx,
        x1: lr.right - containerRect.left, y1: lr.top + lr.height / 2 - containerRect.top,
        x2: rr.left - containerRect.left, y2: rr.top + rr.height / 2 - containerRect.top,
        correct: pairs[leftIdx]?.right === rightText,
      })
    })
    setLines(next)
  }, [connections, rightOrder, pairs, answered, tick])

  function selectLeft(i) { if (!answered) setSelectedLeft(i) }
  function clickRight(rightPos) {
    if (answered || selectedLeft === null) return
    const rightText = pairs[rightOrder[rightPos]]?.right
    onChange({ ...connections, [selectedLeft]: rightText })
    setSelectedLeft(null)
  }
  function clearConnection(i, e) {
    e.stopPropagation()
    if (answered) return
    const next = { ...connections }
    delete next[i]
    onChange(next)
  }

  return (
    <div ref={containerRef} className="relative">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {lines.map(l => (
          <line key={l.key} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={answered ? (l.correct ? '#36913F' : '#ef4444') : '#FFC23C'}
            strokeWidth={3} strokeLinecap="round" />
        ))}
      </svg>
      <div className="grid grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-2.5 relative" style={{ zIndex: 2 }}>
        <div className="space-y-2.5">
          {pairs.map((p, i) => {
            const isConnected = connections[i] !== undefined
            const isSelected = selectedLeft === i
            let cls = 'border-gray-200 bg-white text-gray-700 hover:border-nb-green'
            let style = {}
            if (answered) {
              const correct = connections[i] === p.right
              cls = correct ? 'border-nb-green bg-green-50 text-nb-dark' : 'border-red-300 bg-red-50 text-red-500'
            } else if (isSelected) {
              cls = 'border-nb-yellow shadow-md text-nb-dark'; style = { background: '#FFEB3C22' }
            } else if (isConnected) {
              cls = 'border-nb-green/60 bg-green-50/60 text-nb-dark'
            }
            return (
              // A <div role="button"> (not a real <button>) — the ✕ clear control below is a
              // real <button>, and nested <button>s are invalid HTML / break React hydration.
              <div key={i} ref={el => { leftRefs.current[i] = el }}
                role="button" tabIndex={answered ? -1 : 0} aria-disabled={answered}
                onClick={() => selectLeft(i)}
                onKeyDown={e => { if (!answered && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); selectLeft(i) } }}
                className={`w-full text-left px-3 py-2.5 rounded-xl border-2 font-bold text-sm transition ${answered ? '' : 'cursor-pointer'} ${cls}`} style={style}>
                <span className="flex items-center justify-between gap-2">
                  <span>{p.left}</span>
                  {!answered && isConnected && (
                    <button onClick={e => clearConnection(i, e)} className="text-[10px] font-bold text-gray-400 hover:text-red-500">✕</button>
                  )}
                  {answered && (connections[i] === p.right ? '✅' : `❌ → ${p.right}`)}
                </span>
              </div>
            )
          })}
        </div>
        <div className="space-y-2.5">
          {rightOrder.map((origIdx, i) => (
            <button key={i} ref={el => { rightRefs.current[i] = el }}
              onClick={() => clickRight(i)} disabled={answered || selectedLeft === null}
              className="w-full text-left px-3 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-bold text-sm transition hover:border-nb-yellow disabled:hover:border-gray-200 disabled:opacity-70">
              {pairs[origIdx]?.right}
            </button>
          ))}
        </div>
      </div>
      {!answered && <p className="text-[11px] text-gray-400 mt-3 text-center">Tap an item on the left, then tap its match on the right to draw a line.</p>}
    </div>
  )
}
