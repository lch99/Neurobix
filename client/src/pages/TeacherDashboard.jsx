import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const CLASSES = [
  { id: 1, name: 'Primary 4A', subject: 'Mathematics', students: 28, lessons: 14, progress: 67 },
  { id: 2, name: 'Primary 4B', subject: 'Mathematics', students: 25, lessons: 14, progress: 50 },
  { id: 3, name: 'Primary 5A', subject: 'Science',     students: 30, lessons: 10, progress: 80 },
]

const STUDENTS = [
  // Primary 4A
  { id: 1,  name: 'Ahmad bin Hassan',    class: 'Primary 4A', progress: 85, points: 1240, status: 'active'  },
  { id: 2,  name: 'Siti Nur Aisyah',    class: 'Primary 4A', progress: 72, points: 980,  status: 'active'  },
  { id: 6,  name: 'Amirah bte Zulkifli',class: 'Primary 4A', progress: 68, points: 860,  status: 'active'  },
  { id: 7,  name: 'Tan Jun Wei',        class: 'Primary 4A', progress: 35, points: 420,  status: 'at_risk' },
  { id: 8,  name: 'Nadia Putri',        class: 'Primary 4A', progress: 91, points: 1380, status: 'active'  },
  { id: 9,  name: 'Darren Lim',         class: 'Primary 4A', progress: 55, points: 640,  status: 'active'  },
  // Primary 4B
  { id: 3,  name: 'Raj Kumar',          class: 'Primary 4B', progress: 60, points: 740,  status: 'active'  },
  { id: 4,  name: 'Mei Ling',           class: 'Primary 4B', progress: 42, points: 520,  status: 'at_risk' },
  { id: 10, name: 'Farid bin Ismail',   class: 'Primary 4B', progress: 78, points: 1020, status: 'active'  },
  { id: 11, name: 'Priya Nair',         class: 'Primary 4B', progress: 30, points: 310,  status: 'at_risk' },
  { id: 12, name: 'Justin Ng',          class: 'Primary 4B', progress: 65, points: 790,  status: 'active'  },
  // Primary 5A
  { id: 5,  name: 'Hafiz Zulkifli',    class: 'Primary 5A', progress: 90, points: 1560, status: 'active'  },
  { id: 13, name: 'Sarah bte Malik',   class: 'Primary 5A', progress: 83, points: 1190, status: 'active'  },
  { id: 14, name: 'Kevin Tan',         class: 'Primary 5A', progress: 47, points: 580,  status: 'at_risk' },
  { id: 15, name: 'Nur Hidayah',       class: 'Primary 5A', progress: 76, points: 930,  status: 'active'  },
  { id: 16, name: 'Ethan Loh',         class: 'Primary 5A', progress: 88, points: 1310, status: 'active'  },
]

const LESSONS = [
  { id: 1,  title: 'Addition & Subtraction', subject: 'Mathematics', type: 'video',     status: 'published', class: 'Primary 4A' },
  { id: 2,  title: 'Multiplication Tables',  subject: 'Mathematics', type: 'flashcard', status: 'published', class: 'Primary 4A' },
  { id: 7,  title: 'The Solar System',       subject: 'Science',     type: 'video',     status: 'draft',     class: 'Primary 5A' },
  { id: 19, title: 'Forces & Motion',        subject: 'Science',     type: 'video',     status: 'scheduled', class: 'Primary 5A' },
]

const TYPE_ICON = { video:'🎬', flashcard:'🃏', quiz:'📝', reading:'📄', activity:'🎨' }
const STATUS_STYLE = { published: 'bg-green-100 text-green-700', draft: 'bg-gray-100 text-gray-500', scheduled: 'bg-blue-100 text-blue-700' }

export default function TeacherDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [lessons, setLessons] = useState(LESSONS)
  const [showLessonModal, setShowLessonModal] = useState(false)

  function handleAddLesson(newLesson) {
    setLessons(l => [newLesson, ...l])
  }

  return (
    <div className="min-h-screen bg-nb-cream">
      {showLessonModal && <AddLessonModal onClose={() => setShowLessonModal(false)} onAdd={handleAddLesson} />}
      <Navbar role="teacher" userName="Ms Sarah Tan" />

      {/* Sub-tabs */}
      <div className="bg-white border-b-2 border-nb-olive/20 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto py-2">
          {[
            { id: 'overview',    label: '📊 Overview'    },
            { id: 'classes',     label: '🏫 Classes'     },
            { id: 'lessons',     label: '📚 Lessons'     },
            { id: 'flashcards',  label: '🃏 Flash Cards'  },
            { id: 'quizbuilder', label: '📝 Quiz Builder' },
            { id: 'schedule',    label: '📅 Schedule'    },
            { id: 'students',    label: '👩‍🎓 Students'   },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                tab === t.id ? 'text-nb-dark' : 'text-gray-500 hover:bg-nb-cream'
              }`}
              style={tab === t.id ? { background: '#FFEB3C' } : {}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Students', value: 83,   icon: '👩‍🎓', bg: 'bg-blue-50',   text: 'text-blue-700' },
                { label: 'Active Classes', value: 3,    icon: '📚',  bg: 'bg-green-50',  text: 'text-nb-green' },
                { label: 'Lessons Live',   value: 14,   icon: '✅',  bg: 'bg-nb-cream',  text: 'text-nb-dark' },
                { label: 'Avg. Progress',  value: '66%',icon: '📊',  bg: 'bg-amber-50',  text: 'text-amber-700' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-nb-olive/20`}>
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className={`text-3xl font-black ${s.text}`}>{s.value}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* At Risk */}
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
              <h3 className="font-black text-red-700 mb-3">⚠️ Students Needing Attention</h3>
              {STUDENTS.filter(s => s.status === 'at_risk').map(s => (
                <div key={s.id} className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm">
                  <div>
                    <p className="font-bold text-sm text-nb-dark">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.class}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-red-500">{s.progress}% progress</p>
                    <button className="text-xs font-semibold hover:underline" style={{ color: '#36913F' }}>Send reminder →</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Class Progress */}
            <div>
              <h3 className="font-black text-nb-dark mb-3">Class Progress</h3>
              <div className="space-y-3">
                {CLASSES.map(c => (
                  <div key={c.id} className="bg-white rounded-2xl border border-nb-olive/20 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-black text-nb-dark">{c.name}</span>
                        <span className="ml-2 text-xs text-gray-400">{c.subject}</span>
                      </div>
                      <span className="text-sm font-black" style={{ color: '#36913F' }}>{c.progress}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${c.progress}%`, background: 'linear-gradient(90deg,#6FC911,#396336)' }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{c.students} students</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* CLASSES */}
        {tab === 'classes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-nb-dark">My Classes</h2>
              <button className="px-4 py-2 text-nb-dark text-sm font-black rounded-xl shadow hover:shadow-md transition"
                      style={{ background: '#FFEB3C' }}>+ New Class</button>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {CLASSES.map(c => (
                <div key={c.id} className="bg-white rounded-2xl border border-nb-olive/20 p-5 hover:shadow-md transition cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-3 shadow-sm"
                       style={{ background: 'linear-gradient(135deg,#91BA4F,#396336)' }}>📚</div>
                  <h3 className="font-black text-nb-dark">{c.name}</h3>
                  <p className="text-sm text-gray-500">{c.subject}</p>
                  <div className="mt-3 flex gap-4 text-sm text-gray-400">
                    <span>👩‍🎓 {c.students}</span>
                    <span>📖 {c.lessons} lessons</span>
                  </div>
                  <div className="mt-3 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.progress}%`, background: 'linear-gradient(90deg,#6FC911,#396336)' }} />
                  </div>
                  <p className="text-xs font-black mt-1" style={{ color: '#36913F' }}>{c.progress}% complete</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LESSONS */}
        {tab === 'lessons' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-nb-dark">Lessons</h2>
              <button onClick={() => setShowLessonModal(true)}
                className="px-4 py-2 text-nb-dark text-sm font-black rounded-xl shadow hover:shadow-md transition"
                style={{ background: '#FFEB3C' }}>+ Add Lesson</button>
            </div>
            <div className="bg-white rounded-2xl border border-nb-olive/20 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-nb-cream border-b border-nb-olive/20">
                  <tr>
                    {['Title','Class','Type','Status',''].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-gray-500 font-black text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-nb-olive/10">
                  {lessons.map(l => (
                    <tr key={l.id} className="hover:bg-nb-cream/50 transition">
                      <td className="px-5 py-3 font-bold text-nb-dark">{TYPE_ICON[l.type]} {l.title}</td>
                      <td className="px-5 py-3 text-gray-500">{l.class}</td>
                      <td className="px-5 py-3 capitalize text-gray-500">{l.type}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[l.status]}`}>{l.status}</span>
                        {l.status === 'scheduled' && l.releaseDate && (
                          <span className="ml-2 text-[10px] text-gray-400 font-bold">📅 {l.releaseDate.replace('T', ' ')}</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button className="text-xs font-bold hover:text-nb-dark transition" style={{ color: '#36913F' }}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FLASH CARDS */}
        {tab === 'flashcards' && <FlashCardEditor />}

        {/* QUIZ BUILDER */}
        {tab === 'quizbuilder' && <QuizBuilder />}

        {/* SCHEDULE */}
        {tab === 'schedule' && <ScheduleView lessons={lessons} onEdit={() => setShowLessonModal(true)} />}

        {/* STUDENTS — broken down by class */}
        {tab === 'students' && (
          <StudentsTab students={STUDENTS} classes={CLASSES} />
        )}
      </div>
    </div>
  )
}

/* ── Flash Card Editor ── */
function FlashCardEditor() {
  const INIT_DECKS = [
    {
      id: 1, title: 'Multiplication Tables', class: 'Primary 4A', subject: 'Mathematics',
      cards: [
        { id: 1, front: 'What is 7 × 8?',   back: '56',  hint: 'Think: 7 × 7 = 49, then +7' },
        { id: 2, front: 'What is 12 × 12?', back: '144', hint: 'A dozen dozens!'              },
        { id: 3, front: 'What is 9 × 6?',   back: '54',  hint: '9 × 5 = 45, then +9'         },
      ],
    },
    {
      id: 2, title: 'Spelling: Common Words', class: 'Primary 4A', subject: 'English',
      cards: [
        { id: 1, front: 'Spell: Beautiful', back: 'B-E-A-U-T-I-F-U-L', hint: '"Big Elephants Are Ugly"' },
        { id: 2, front: 'Spell: Wednesday', back: 'W-E-D-N-E-S-D-A-Y', hint: 'Wed-nes-day!'             },
      ],
    },
  ]

  const [decks, setDecks]         = useState(INIT_DECKS)
  const [activeDeckId, setActiveDeckId] = useState(null)
  const [previewIdx, setPreviewIdx]     = useState(null)
  const [previewFlipped, setPreviewFlipped] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newForm, setNewForm]       = useState({ title: '', class: 'Primary 4A', subject: 'Mathematics' })
  const [saved, setSaved]           = useState(false)

  const deck = decks.find(d => d.id === activeDeckId) || null

  function addCard() {
    setDecks(prev => prev.map(d => d.id === activeDeckId
      ? { ...d, cards: [...d.cards, { id: Date.now(), front: '', back: '', hint: '' }] }
      : d))
  }
  function removeCard(cardId) {
    setDecks(prev => prev.map(d => d.id === activeDeckId
      ? { ...d, cards: d.cards.filter(c => c.id !== cardId) }
      : d))
  }
  function updateCard(cardId, field, value) {
    setDecks(prev => prev.map(d => d.id === activeDeckId
      ? { ...d, cards: d.cards.map(c => c.id === cardId ? { ...c, [field]: value } : c) }
      : d))
  }
  function createDeck() {
    if (!newForm.title.trim()) return
    const nd = { id: Date.now(), ...newForm, cards: [{ id: 1, front: '', back: '', hint: '' }] }
    setDecks(p => [nd, ...p])
    setActiveDeckId(nd.id)
    setIsCreating(false)
    setNewForm({ title: '', class: 'Primary 4A', subject: 'Mathematics' })
  }
  function saveDeck() { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  /* ── Preview mode ── */
  if (previewIdx !== null && deck) {
    const card = deck.cards[previewIdx] || deck.cards[0]
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <button onClick={() => { setPreviewIdx(null); setPreviewFlipped(false) }}
            className="text-sm font-bold text-gray-400 hover:text-nb-dark">← Back to Editor</button>
          <p className="text-sm font-bold text-gray-400">Preview · {previewIdx + 1} / {deck.cards.length}</p>
        </div>
        <div className="max-w-lg mx-auto space-y-4">
          <div className="flex gap-2 justify-center">
            {deck.cards.map((_, i) => (
              <div key={i} onClick={() => { setPreviewIdx(i); setPreviewFlipped(false) }}
                className="h-2.5 rounded-full cursor-pointer transition-all"
                style={{ width: i === previewIdx ? 32 : 10, background: i === previewIdx ? '#36913F' : '#d1d5db' }} />
            ))}
          </div>
          <div onClick={() => setPreviewFlipped(f => !f)}
            className="cursor-pointer bg-white rounded-3xl border-2 select-none hover:shadow-xl transition-all"
            style={{ borderColor: previewFlipped ? '#6FC911' : '#91BA4F44', height: 200,
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              padding:'24px 32px', overflow:'hidden', textAlign:'center' }}>
            {!previewFlipped ? (
              <>
                <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color:'#91BA4F' }}>Question</p>
                <p className="font-black text-nb-dark text-xl">{card.front || '(empty front)'}</p>
                <p className="text-sm text-gray-300 mt-3">👆 Tap to flip</p>
              </>
            ) : (
              <>
                <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color:'#6FC911' }}>Answer</p>
                <p className="font-black text-2xl" style={{ color:'#36913F' }}>{card.back || '(empty back)'}</p>
                <p className="text-sm text-gray-300 mt-3">👆 Tap to flip back</p>
              </>
            )}
          </div>
          {card.hint && (
            <p className="rounded-xl p-3 text-center text-sm font-semibold text-nb-dark" style={{ background:'#FFEB3C33' }}>
              🧠 {card.hint}
            </p>
          )}
          <div className="flex gap-3">
            <button onClick={() => { setPreviewIdx((previewIdx - 1 + deck.cards.length) % deck.cards.length); setPreviewFlipped(false) }}
              className="flex-1 py-3 rounded-2xl border-2 border-gray-200 font-black text-gray-500 hover:border-nb-olive transition">← Prev</button>
            <button onClick={() => { setPreviewIdx((previewIdx + 1) % deck.cards.length); setPreviewFlipped(false) }}
              className="flex-1 py-3 rounded-2xl font-black text-nb-dark" style={{ background:'#FFEB3C' }}>Next →</button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Deck editor ── */
  if (deck) return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveDeckId(null)} className="text-sm font-bold text-gray-400 hover:text-nb-dark">← All Decks</button>
          <div>
            <h2 className="text-xl font-black text-nb-dark">{deck.title}</h2>
            <p className="text-xs text-gray-400">{deck.class} · {deck.subject} · {deck.cards.length} cards</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setPreviewIdx(0); setPreviewFlipped(false) }}
            className="px-4 py-2 text-nb-green border-2 border-nb-green text-sm font-black rounded-xl hover:bg-nb-green hover:text-white transition">
            👁 Preview
          </button>
          <button onClick={saveDeck}
            className="px-4 py-2 text-nb-dark text-sm font-black rounded-xl shadow hover:shadow-md transition"
            style={{ background: saved ? '#6FC911' : '#FFEB3C', color: saved ? 'white' : '#396336' }}>
            {saved ? '✓ Saved!' : '💾 Save Deck'}
          </button>
        </div>
      </div>

      {/* Card rows */}
      <div className="space-y-3">
        {deck.cards.map((card, idx) => (
          <div key={card.id} className="bg-white rounded-2xl border-2 border-nb-olive/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Card {idx + 1}</span>
              <button onClick={() => removeCard(card.id)}
                className="text-xs font-bold text-red-400 hover:text-red-600 transition">✕ Remove</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wide mb-1">Front (Question)</label>
                <textarea rows={3} value={card.front}
                  onChange={e => updateCard(card.id, 'front', e.target.value)}
                  placeholder="e.g. What is 7 × 8?"
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm resize-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wide mb-1">Back (Answer)</label>
                <textarea rows={3} value={card.back}
                  onChange={e => updateCard(card.id, 'back', e.target.value)}
                  placeholder="e.g. 56"
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm resize-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-nb-olive uppercase tracking-wide mb-1">🧠 Memory Hint (记忆法)</label>
                <textarea rows={3} value={card.hint}
                  onChange={e => updateCard(card.id, 'hint', e.target.value)}
                  placeholder="e.g. 7 × 7 = 49, then +7"
                  className="w-full px-3 py-2 rounded-xl border-2 border-nb-yellow/40 focus:outline-none focus:border-nb-olive bg-nb-cream text-sm resize-none" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addCard}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-nb-olive/40 text-nb-green font-bold hover:border-nb-green hover:bg-white transition">
        + Add Card
      </button>
    </div>
  )

  /* ── Deck list ── */
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-nb-dark">🃏 Flash Card Decks</h2>
        <button onClick={() => setIsCreating(true)}
          className="px-4 py-2 text-nb-dark text-sm font-black rounded-xl shadow hover:shadow-md transition"
          style={{ background: '#FFEB3C' }}>+ New Deck</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {decks.map(d => (
          <div key={d.id} onClick={() => setActiveDeckId(d.id)}
            className="bg-white rounded-2xl border-2 border-nb-olive/20 p-5 hover:shadow-lg hover:border-nb-green/40 hover:-translate-y-0.5 transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background:'#FFEB3C' }}>🃏</div>
              <span className="text-xs font-bold text-nb-green bg-green-50 px-2.5 py-1 rounded-full">{d.cards.length} cards</span>
            </div>
            <p className="font-black text-nb-dark">{d.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{d.class} · {d.subject}</p>
            <div className="flex gap-1.5 mt-3">
              {d.cards.slice(0, 5).map((_, i) => (
                <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background:'#FFEB3C' }} />
              ))}
              {d.cards.length < 5 && Array.from({ length: 5 - d.cards.length }).map((_, i) => (
                <div key={i} className="flex-1 h-1.5 rounded-full bg-gray-100" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create deck modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background:'rgba(0,0,0,0.45)' }}
             onClick={e => e.target === e.currentTarget && setIsCreating(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-nb-dark">New Flash Card Deck</h2>
              <button onClick={() => setIsCreating(false)} className="text-gray-400 text-2xl">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Deck Title *</label>
                <input value={newForm.title} onChange={e => setNewForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Multiplication Tables"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Class</label>
                  <select value={newForm.class} onChange={e => setNewForm(f => ({ ...f, class: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm">
                    <option>Primary 4A</option>
                    <option>Primary 4B</option>
                    <option>Primary 5A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Subject</label>
                  <select value={newForm.subject} onChange={e => setNewForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm">
                    <option>Mathematics</option>
                    <option>English</option>
                    <option>Science</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setIsCreating(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm">Cancel</button>
                <button onClick={createDeck} disabled={!newForm.title.trim()}
                  className="flex-1 py-3 rounded-xl font-black text-nb-dark text-sm shadow-md disabled:opacity-40 transition"
                  style={{ background:'#FFEB3C' }}>Create Deck →</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Add Lesson Modal ── */
function AddLessonModal({ onClose, onAdd }) {
  const CLASS_SUBJECT = { 'Primary 4A': 'Mathematics', 'Primary 4B': 'Mathematics', 'Primary 5A': 'Science' }

  const [form, setForm] = useState({
    title: '', class: 'Primary 4A', subject: 'Mathematics',
    type: 'video', status: 'draft', releaseDate: '', deadline: '', fileName: '',
  })
  const [error, setError] = useState('')

  function set(k, v) {
    setError('')
    if (k === 'class') setForm(f => ({ ...f, class: v, subject: CLASS_SUBJECT[v] || 'Mathematics' }))
    else setForm(f => ({ ...f, [k]: v }))
  }

  function submit(e) {
    e.preventDefault()
    if (!form.title.trim()) { setError('Please enter a lesson title.'); return }
    if (form.status === 'scheduled' && !form.releaseDate) { setError('Please pick a release date for scheduled lessons.'); return }
    if ((form.type === 'video' || form.type === 'reading') && !form.fileName) { setError('Please upload a file for video / reading lessons.'); return }
    onAdd({ ...form, id: Date.now() })
    onClose()
  }

  const MATERIAL_TYPES = [
    { value: 'video',     icon: '🎬', label: 'Video',       desc: 'MP4 lesson recording' },
    { value: 'flashcard', icon: '🃏', label: 'Flash Cards', desc: 'Front/back memory cards' },
    { value: 'quiz',      icon: '📝', label: 'Quiz',        desc: 'Auto-graded questions' },
    { value: 'reading',   icon: '📄', label: 'Reading',     desc: 'PDF or text material' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.45)' }}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-7 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-nb-dark">Upload New Lesson</h2>
            <p className="text-xs text-gray-400 mt-0.5">Pick a material type, upload content, and schedule release.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
        )}

        <form onSubmit={submit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Lesson Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. Fractions — Introduction"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
          </div>

          {/* Class + Subject */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Class</label>
              <select value={form.class} onChange={e => set('class', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm">
                <option>Primary 4A</option>
                <option>Primary 4B</option>
                <option>Primary 5A</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Subject (auto)</label>
              <div className="px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50 text-sm text-gray-500 font-semibold">
                {form.subject}
              </div>
            </div>
          </div>

          {/* Material Type */}
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Material Type *</label>
            <div className="grid grid-cols-2 gap-2">
              {MATERIAL_TYPES.map(t => (
                <button type="button" key={t.value} onClick={() => set('type', t.value)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    form.type === t.value
                      ? 'border-nb-green shadow-sm'
                      : 'border-gray-100 bg-white hover:border-nb-olive'
                  }`}
                  style={form.type === t.value ? { background: '#6FC91112' } : {}}>
                  <span className="text-2xl flex-shrink-0">{t.icon}</span>
                  <div>
                    <p className={`text-sm font-black ${form.type === t.value ? 'text-nb-dark' : 'text-gray-500'}`}>{t.label}</p>
                    <p className="text-[10px] text-gray-400">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* File upload — for video and reading */}
          {(form.type === 'video' || form.type === 'reading') && (
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">
                {form.type === 'video' ? 'Upload Video File *' : 'Upload PDF / Document *'}
              </label>
              {form.fileName ? (
                <div className="border-2 border-nb-green rounded-xl p-4 bg-green-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{form.type === 'video' ? '🎬' : '📄'}</span>
                    <div>
                      <p className="text-sm font-black text-nb-dark">{form.fileName}</p>
                      <p className="text-xs text-nb-green">✓ Ready to upload</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => set('fileName', '')}
                    className="text-xs font-bold text-red-500 hover:text-red-700">Remove</button>
                </div>
              ) : (
                <label className="block border-2 border-dashed border-nb-olive/40 rounded-xl p-6 text-center bg-nb-cream hover:border-nb-green hover:bg-nb-cream/80 transition cursor-pointer">
                  <input type="file"
                    accept={form.type === 'video' ? 'video/mp4,video/*' : 'application/pdf,.pdf'}
                    onChange={e => set('fileName', e.target.files[0]?.name || '')}
                    className="hidden" />
                  <p className="text-3xl mb-2">{form.type === 'video' ? '🎬' : '📄'}</p>
                  <p className="text-sm font-bold text-gray-600">Click to upload or drag & drop</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {form.type === 'video' ? 'MP4 · Max 2 GB · stored on AWS S3' : 'PDF · Max 50 MB'}
                  </p>
                </label>
              )}
            </div>
          )}

          {/* Quiz / Flash card placeholder */}
          {form.type === 'quiz' && (
            <div className="rounded-xl p-4 border-2 border-nb-yellow/60 bg-nb-yellow/10">
              <p className="text-sm font-black text-nb-dark mb-1">📝 Quiz Builder</p>
              <p className="text-xs text-gray-500">After creating, you'll add questions in the Quiz Builder (multiple choice, T/F, fill-in-blank, image-based). Pass mark configurable per quiz.</p>
            </div>
          )}
          {form.type === 'flashcard' && (
            <div className="rounded-xl p-4 border-2 border-nb-yellow/60 bg-nb-yellow/10">
              <p className="text-sm font-black text-nb-dark mb-1">🃏 Flash Card Editor</p>
              <p className="text-xs text-gray-500">After creating, you'll add card pairs (front/back) with optional images and memory hints in the Flash Card Editor.</p>
            </div>
          )}

          {/* Publish Status */}
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Publish Status *</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'draft',     icon: '📝', label: 'Draft'     },
                { value: 'published', icon: '✅', label: 'Publish'   },
                { value: 'scheduled', icon: '📅', label: 'Schedule'  },
              ].map(s => (
                <button type="button" key={s.value} onClick={() => set('status', s.value)}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-xs font-black transition ${
                    form.status === s.value
                      ? 'border-nb-green text-nb-dark shadow-sm'
                      : 'border-gray-100 text-gray-400 bg-white hover:border-nb-olive'
                  }`}
                  style={form.status === s.value ? { background: '#6FC91112' } : {}}>
                  <span className="text-xl">{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Schedule fields */}
          {form.status === 'scheduled' && (
            <div className="rounded-xl border-2 border-blue-200 p-4 bg-blue-50 space-y-3">
              <p className="text-sm font-black text-blue-800">📅 Release Schedule</p>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Release Date & Time *</label>
                <input type="datetime-local" value={form.releaseDate} onChange={e => set('releaseDate', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-white text-sm" />
                <p className="text-[10px] text-gray-500 mt-1">Lesson will be hidden until this date/time. Students get an in-app + email notification when it goes live.</p>
              </div>
            </div>
          )}

          {/* Deadline (optional) */}
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Completion Deadline (optional)</label>
            <input type="datetime-local" value={form.deadline} onChange={e => set('deadline', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
            <p className="text-[10px] text-gray-500 mt-1">Lessons not completed by this date will be marked as Overdue.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-gray-300 transition">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3 rounded-xl font-black text-nb-dark text-sm shadow-md transition hover:shadow-lg"
              style={{ background: '#FFEB3C' }}>
              Create Lesson →
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Quiz Builder ── */
function QuizBuilder() {
  const INIT_QUIZZES = [
    {
      id: 1, title: 'Times Tables Challenge', class: 'Primary 4A', subject: 'Mathematics',
      passMark: 70, leaderboard: true, status: 'published',
      questions: [
        { id: 1, type: 'mcq',   text: 'What is 6 × 7?',   options: ['36','42','48','54'], answer: 1 },
        { id: 2, type: 'mcq',   text: 'What is 9 × 8?',   options: ['63','72','81','90'], answer: 1 },
        { id: 3, type: 'tf',    text: '7 × 7 = 49',       answer: true },
        { id: 4, type: 'fitb',  text: '12 × 12 = ___',    answer: '144' },
      ],
    },
    {
      id: 2, title: 'Fractions Basics', class: 'Primary 4A', subject: 'Mathematics',
      passMark: 60, leaderboard: false, status: 'draft',
      questions: [
        { id: 1, type: 'mcq', text: 'What is the top number in a fraction called?', options: ['Denominator','Numerator','Divisor','Factor'], answer: 1 },
        { id: 2, type: 'mcq', text: 'Which fraction is bigger: 1/2 or 1/4?', options: ['1/4','1/2','Equal','Cannot tell'], answer: 1 },
      ],
    },
  ]

  const [quizzes, setQuizzes]       = useState(INIT_QUIZZES)
  const [activeId, setActiveId]     = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newForm, setNewForm]       = useState({ title: '', class: 'Primary 4A', subject: 'Mathematics', passMark: 70, leaderboard: false })
  const [saved, setSaved]           = useState(false)

  const quiz = quizzes.find(q => q.id === activeId) || null

  const Q_TYPES = [
    { value: 'mcq',   label: 'Multiple Choice', icon: '⚪' },
    { value: 'tf',    label: 'True / False',    icon: '✓✗' },
    { value: 'fitb',  label: 'Fill in Blank',   icon: '___' },
    { value: 'image', label: 'Image-Based',     icon: '🖼' },
  ]

  function addQuestion() {
    setQuizzes(prev => prev.map(q => q.id === activeId
      ? { ...q, questions: [...q.questions, { id: Date.now(), type: 'mcq', text: '', options: ['','','',''], answer: 0 }] }
      : q))
  }
  function removeQuestion(qid) {
    setQuizzes(prev => prev.map(q => q.id === activeId
      ? { ...q, questions: q.questions.filter(x => x.id !== qid) }
      : q))
  }
  function updateQuestion(qid, field, value) {
    setQuizzes(prev => prev.map(q => q.id === activeId
      ? { ...q, questions: q.questions.map(x => x.id === qid ? { ...x, [field]: value } : x) }
      : q))
  }
  function updateOption(qid, optIdx, value) {
    setQuizzes(prev => prev.map(q => q.id === activeId
      ? { ...q, questions: q.questions.map(x => {
          if (x.id !== qid) return x
          const opts = [...(x.options || ['','','',''])]
          opts[optIdx] = value
          return { ...x, options: opts }
        })}
      : q))
  }
  function createQuiz() {
    if (!newForm.title.trim()) return
    const nq = { id: Date.now(), ...newForm, status: 'draft', questions: [] }
    setQuizzes(p => [nq, ...p])
    setActiveId(nq.id)
    setIsCreating(false)
    setNewForm({ title: '', class: 'Primary 4A', subject: 'Mathematics', passMark: 70, leaderboard: false })
  }
  function saveQuiz() { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  function publishQuiz() {
    setQuizzes(prev => prev.map(q => q.id === activeId ? { ...q, status: 'published' } : q))
  }

  const STATUS_STYLE = { published: 'bg-green-100 text-green-700', draft: 'bg-gray-100 text-gray-500', scheduled: 'bg-blue-100 text-blue-700' }

  /* ── Quiz detail editor ── */
  if (quiz) return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveId(null)} className="text-sm font-bold text-gray-400 hover:text-nb-dark">← All Quizzes</button>
          <div>
            <h2 className="text-xl font-black text-nb-dark">{quiz.title}</h2>
            <p className="text-xs text-gray-400">{quiz.class} · {quiz.subject} · {quiz.questions.length} questions · Pass: {quiz.passMark}%</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[quiz.status]}`}>{quiz.status}</span>
          {quiz.status === 'draft' && (
            <button onClick={publishQuiz}
              className="px-4 py-2 text-white text-sm font-black rounded-xl shadow hover:opacity-90 transition"
              style={{ background: '#36913F' }}>
              ✅ Publish
            </button>
          )}
          <button onClick={saveQuiz}
            className="px-4 py-2 text-sm font-black rounded-xl shadow hover:shadow-md transition"
            style={{ background: saved ? '#6FC911' : '#FFEB3C', color: saved ? 'white' : '#396336' }}>
            {saved ? '✓ Saved!' : '💾 Save'}
          </button>
        </div>
      </div>

      {/* Quiz settings bar */}
      <div className="bg-white rounded-2xl border border-nb-olive/20 p-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-xs font-black text-gray-500 uppercase tracking-wide">Pass Mark</label>
          <input type="number" min="1" max="100"
            value={quiz.passMark}
            onChange={e => setQuizzes(prev => prev.map(q => q.id === activeId ? { ...q, passMark: Number(e.target.value) } : q))}
            className="w-16 px-2 py-1.5 rounded-lg border-2 border-nb-olive/20 text-sm font-black focus:outline-none focus:border-nb-green" />
          <span className="text-sm text-gray-400">%</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-black text-gray-500 uppercase tracking-wide">Leaderboard</label>
          <button onClick={() => setQuizzes(prev => prev.map(q => q.id === activeId ? { ...q, leaderboard: !q.leaderboard } : q))}
            className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${quiz.leaderboard ? '' : 'bg-gray-200'}`}
            style={quiz.leaderboard ? { background: '#36913F' } : {}}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${quiz.leaderboard ? 'left-5' : 'left-0.5'}`} />
          </button>
          <span className="text-xs text-gray-400">{quiz.leaderboard ? 'Enabled' : 'Disabled'}</span>
        </div>
        <p className="text-xs text-gray-400 ml-auto hidden sm:block">Results visible to student, teacher &amp; parent · Auto-graded on submit</p>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-2xl border-2 border-nb-olive/20 p-5">
            <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Q{idx + 1}</span>
              <div className="flex gap-1.5 flex-wrap">
                {Q_TYPES.map(t => (
                  <button key={t.value} onClick={() => updateQuestion(q.id, 'type', t.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${q.type === t.value ? 'border-nb-green text-nb-dark shadow-sm' : 'border-gray-200 text-gray-400 hover:border-nb-olive'}`}
                    style={q.type === t.value ? { background: '#6FC91112' } : {}}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
              <button onClick={() => removeQuestion(q.id)} className="text-xs font-bold text-red-400 hover:text-red-600 ml-auto">✕ Remove</button>
            </div>

            {/* Question text */}
            <input value={q.text} onChange={e => updateQuestion(q.id, 'text', e.target.value)}
              placeholder="Type question here…"
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm mb-3" />

            {/* Image upload for image-based */}
            {q.type === 'image' && (
              <label className="block border-2 border-dashed border-nb-olive/40 rounded-xl p-4 text-center bg-nb-cream hover:border-nb-green cursor-pointer mb-3">
                <input type="file" accept="image/*" className="hidden" />
                <p className="text-2xl mb-1">🖼</p>
                <p className="text-xs font-bold text-gray-500">Upload question image</p>
              </label>
            )}

            {/* MCQ options */}
            {q.type === 'mcq' && (
              <div className="grid grid-cols-2 gap-2">
                {(q.options || ['','','','']).map((opt, i) => (
                  <div key={i} className={`flex items-center gap-2 rounded-xl border-2 p-2 transition ${q.answer === i ? 'border-nb-green' : 'border-gray-100'}`}
                       style={q.answer === i ? { background: '#6FC91110' } : {}}>
                    <button onClick={() => updateQuestion(q.id, 'answer', i)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${q.answer === i ? 'border-nb-green' : 'border-gray-300'}`}
                      style={q.answer === i ? { background: '#36913F' } : {}}>
                      {q.answer === i && <span className="text-white text-[8px] font-black">✓</span>}
                    </button>
                    <input value={opt} onChange={e => updateOption(q.id, i, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      className="flex-1 min-w-0 bg-transparent text-sm focus:outline-none text-nb-dark" />
                  </div>
                ))}
              </div>
            )}

            {/* True/False */}
            {q.type === 'tf' && (
              <div className="flex gap-3">
                {[true, false].map(v => (
                  <button key={String(v)} onClick={() => updateQuestion(q.id, 'answer', v)}
                    className={`flex-1 py-2.5 rounded-xl font-black text-sm border-2 transition ${q.answer === v ? 'border-nb-green shadow-sm' : 'border-gray-200 text-gray-400 hover:border-nb-olive'}`}
                    style={q.answer === v ? { background: '#6FC91112', color: '#36913F' } : {}}>
                    {v ? '✓ True' : '✗ False'}
                  </button>
                ))}
              </div>
            )}

            {/* Fill in the blank */}
            {(q.type === 'fitb' || q.type === 'image') && (
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wide mb-1">Correct Answer</label>
                <input value={q.answer || ''} onChange={e => updateQuestion(q.id, 'answer', e.target.value)}
                  placeholder="e.g. 144"
                  className="w-full px-3 py-2 rounded-xl border-2 border-nb-yellow/60 focus:outline-none focus:border-nb-green bg-nb-cream text-sm font-bold" />
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={addQuestion}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-nb-olive/40 text-nb-green font-bold hover:border-nb-green hover:bg-white transition">
        + Add Question
      </button>
    </div>
  )

  /* ── Quiz list ── */
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-nb-dark">📝 Quiz Builder</h2>
        <button onClick={() => setIsCreating(true)}
          className="px-4 py-2 text-nb-dark text-sm font-black rounded-xl shadow hover:shadow-md transition"
          style={{ background: '#FFEB3C' }}>+ New Quiz</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {quizzes.map(q => (
          <div key={q.id} onClick={() => setActiveId(q.id)}
            className="bg-white rounded-2xl border-2 border-nb-olive/20 p-5 hover:shadow-lg hover:border-nb-green/40 hover:-translate-y-0.5 transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: '#FFF7E9' }}>📝</div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[q.status]}`}>{q.status}</span>
            </div>
            <p className="font-black text-nb-dark">{q.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{q.class} · {q.subject}</p>
            <div className="flex gap-3 mt-3 text-xs text-gray-400">
              <span>❓ {q.questions.length} questions</span>
              <span>🎯 Pass: {q.passMark}%</span>
              {q.leaderboard && <span>🏅 Leaderboard</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Create quiz modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: 'rgba(0,0,0,0.45)' }}
             onClick={e => e.target === e.currentTarget && setIsCreating(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-nb-dark">New Quiz</h2>
              <button onClick={() => setIsCreating(false)} className="text-gray-400 text-2xl">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Quiz Title *</label>
                <input value={newForm.title} onChange={e => setNewForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Fractions Quiz"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Class</label>
                  <select value={newForm.class} onChange={e => setNewForm(f => ({ ...f, class: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm">
                    <option>Primary 4A</option><option>Primary 4B</option><option>Primary 5A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Subject</label>
                  <select value={newForm.subject} onChange={e => setNewForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm">
                    <option>Mathematics</option><option>English</option><option>Science</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Pass Mark (%)</label>
                  <input type="number" min="1" max="100" value={newForm.passMark}
                    onChange={e => setNewForm(f => ({ ...f, passMark: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <button type="button" onClick={() => setNewForm(f => ({ ...f, leaderboard: !f.leaderboard }))}
                    className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${newForm.leaderboard ? '' : 'bg-gray-200'}`}
                    style={newForm.leaderboard ? { background: '#36913F' } : {}}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${newForm.leaderboard ? 'left-5' : 'left-0.5'}`} />
                  </button>
                  <span className="text-xs text-gray-500 font-bold">Leaderboard</span>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setIsCreating(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm">Cancel</button>
                <button onClick={createQuiz} disabled={!newForm.title.trim()}
                  className="flex-1 py-3 rounded-xl font-black text-nb-dark text-sm shadow-md disabled:opacity-40 transition"
                  style={{ background: '#FFEB3C' }}>Create Quiz →</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Schedule View ── */
function ScheduleView({ lessons, onEdit }) {
  const SCHEDULE_LESSONS = [
    { id: 1,  title: 'Addition & Subtraction',  class: 'Primary 4A', subject: 'Mathematics', status: 'published',  releaseDate: null,         deadline: null,         completionRate: 85 },
    { id: 2,  title: 'Multiplication Tables',    class: 'Primary 4A', subject: 'Mathematics', status: 'published',  releaseDate: null,         deadline: '2026-05-25', completionRate: 60 },
    { id: 19, title: 'Forces & Motion',          class: 'Primary 5A', subject: 'Science',     status: 'scheduled',  releaseDate: '2026-05-24T09:00', deadline: '2026-06-01', completionRate: 0  },
    { id: 7,  title: 'The Solar System',         class: 'Primary 5A', subject: 'Science',     status: 'draft',      releaseDate: null,         deadline: null,         completionRate: 0  },
    { id: 20, title: 'States of Matter',         class: 'Primary 5A', subject: 'Science',     status: 'scheduled',  releaseDate: '2026-05-27T10:00', deadline: '2026-06-05', completionRate: 0  },
    { id: 6,  title: 'Grammar: Tenses',          class: 'Primary 4B', subject: 'English',     status: 'published',  releaseDate: null,         deadline: '2026-05-30', completionRate: 42 },
  ]

  const [filter, setFilter] = useState('all')

  const filtered = SCHEDULE_LESSONS.filter(l =>
    filter === 'all' || l.status === filter
  )

  const STATUS_STYLE = {
    published:  'bg-green-100 text-green-700',
    draft:      'bg-gray-100 text-gray-500',
    scheduled:  'bg-blue-100 text-blue-700',
  }
  const STATUS_ICON = { published: '✅', draft: '📝', scheduled: '📅' }

  const counts = {
    all:       SCHEDULE_LESSONS.length,
    published: SCHEDULE_LESSONS.filter(l => l.status === 'published').length,
    scheduled: SCHEDULE_LESSONS.filter(l => l.status === 'scheduled').length,
    draft:     SCHEDULE_LESSONS.filter(l => l.status === 'draft').length,
  }

  const today = new Date('2026-05-22')

  function isOverdue(deadline) {
    if (!deadline) return false
    return new Date(deadline) < today
  }
  function isDueSoon(deadline) {
    if (!deadline) return false
    const d = new Date(deadline)
    const diff = (d - today) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 3
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-black text-nb-dark">📅 Lesson Schedule</h2>
        <button onClick={onEdit}
          className="px-4 py-2 text-nb-dark text-sm font-black rounded-xl shadow hover:shadow-md transition"
          style={{ background: '#FFEB3C' }}>+ Schedule Lesson</button>
      </div>

      {/* Summary pills */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all',       label: `All (${counts.all})`,             color: 'bg-gray-100 text-gray-600'      },
          { key: 'published', label: `✅ Live (${counts.published})`,    color: 'bg-green-100 text-green-700'    },
          { key: 'scheduled', label: `📅 Scheduled (${counts.scheduled})`, color: 'bg-blue-100 text-blue-700'   },
          { key: 'draft',     label: `📝 Draft (${counts.draft})`,       color: 'bg-gray-100 text-gray-500'     },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition ${
              filter === f.key ? 'border-nb-green shadow-sm' : 'border-transparent hover:border-nb-olive/30'
            } ${f.color}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Upcoming scheduled notice */}
      {SCHEDULE_LESSONS.filter(l => l.status === 'scheduled').length > 0 && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
          <h3 className="font-black text-blue-800 text-sm mb-2">⏰ Upcoming Releases</h3>
          <div className="space-y-1.5">
            {SCHEDULE_LESSONS.filter(l => l.status === 'scheduled').map(l => (
              <div key={l.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 text-sm">
                <span className="font-bold text-nb-dark">{l.title}</span>
                <span className="text-xs text-blue-600 font-bold">📅 {l.releaseDate?.replace('T', ' ')}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-blue-500 mt-2">Students receive in-app + email notification when lesson goes live.</p>
        </div>
      )}

      {/* Overdue deadlines alert */}
      {SCHEDULE_LESSONS.some(l => isOverdue(l.deadline)) && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
          <h3 className="font-black text-red-700 text-sm mb-2">⚠️ Overdue Deadlines</h3>
          {SCHEDULE_LESSONS.filter(l => isOverdue(l.deadline)).map(l => (
            <div key={l.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 text-sm mb-1.5">
              <div>
                <span className="font-bold text-nb-dark">{l.title}</span>
                <span className="ml-2 text-xs text-gray-400">{l.class}</span>
              </div>
              <span className="text-xs text-red-600 font-black">Deadline: {l.deadline}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main table */}
      <div className="bg-white rounded-2xl border border-nb-olive/20 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-nb-cream border-b border-nb-olive/20">
            <tr>
              {['Lesson', 'Class', 'Status', 'Release Date', 'Deadline', 'Completion', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-gray-500 font-black text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-nb-olive/10">
            {filtered.map(l => (
              <tr key={l.id} className="hover:bg-nb-cream/50 transition">
                <td className="px-4 py-3 font-bold text-nb-dark">{l.title}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{l.class}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[l.status]}`}>
                    {STATUS_ICON[l.status]} {l.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {l.releaseDate ? l.releaseDate.replace('T', ' ') : <span className="text-gray-300">Immediate</span>}
                </td>
                <td className="px-4 py-3 text-xs">
                  {l.deadline ? (
                    <span className={`font-bold ${isOverdue(l.deadline) ? 'text-red-500' : isDueSoon(l.deadline) ? 'text-amber-600' : 'text-gray-500'}`}>
                      {isOverdue(l.deadline) ? '⚠️ ' : isDueSoon(l.deadline) ? '⏰ ' : ''}{l.deadline}
                    </span>
                  ) : <span className="text-gray-300">None</span>}
                </td>
                <td className="px-4 py-3">
                  {l.status === 'published' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${l.completionRate}%`, background: l.completionRate >= 70 ? '#36913F' : '#FFEB3C' }} />
                      </div>
                      <span className="text-xs font-black text-gray-600">{l.completionRate}%</span>
                    </div>
                  ) : <span className="text-xs text-gray-300">—</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs font-bold hover:text-nb-dark transition" style={{ color: '#36913F' }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notification reminder */}
      <div className="rounded-2xl p-4 border-2 border-nb-yellow flex items-start gap-3"
           style={{ background: '#FFEB3C10' }}>
        <span className="text-xl flex-shrink-0">📬</span>
        <div>
          <p className="font-black text-nb-dark text-sm">Student Notifications</p>
          <p className="text-xs text-gray-600 mt-0.5">Students automatically receive an in-app notification and email when a lesson goes live. Scheduled lessons trigger notifications at the exact release time.</p>
        </div>
      </div>
    </div>
  )
}

/* ── Students broken down by class ── */
function StudentsTab({ students, classes }) {
  const [search, setSearch] = useState('')
  const [collapsed, setCollapsed] = useState({})

  function toggleClass(name) {
    setCollapsed(c => ({ ...c, [name]: !c[name] }))
  }

  const filtered = search
    ? students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    : students

  return (
    <div className="space-y-5">
      {/* Header + search */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-black text-nb-dark">👩‍🎓 Students by Class</h2>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search student name..."
          className="px-4 py-2 rounded-xl border-2 border-nb-olive/20 text-sm focus:outline-none focus:border-nb-green bg-white w-64" />
      </div>

      {/* One section per class */}
      {classes.map(cls => {
        const classStudents = filtered.filter(s => s.class === cls.name)
        if (classStudents.length === 0 && search) return null
        const atRisk = classStudents.filter(s => s.status === 'at_risk').length
        const avgProgress = classStudents.length
          ? Math.round(classStudents.reduce((sum, s) => sum + s.progress, 0) / classStudents.length)
          : 0
        const isOpen = !collapsed[cls.name]

        return (
          <div key={cls.id} className="bg-white rounded-2xl border-2 border-nb-olive/20 overflow-hidden">
            {/* Class header — clickable to collapse */}
            <button
              onClick={() => toggleClass(cls.name)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-nb-cream/40 transition text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm"
                     style={{ background: 'linear-gradient(135deg,#FFEB3C,#91BA4F)' }}>🏫</div>
                <div>
                  <p className="font-black text-nb-dark">{cls.name}</p>
                  <p className="text-xs text-gray-400">{cls.subject} · {cls.students} students enrolled</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Mini stats */}
                <div className="hidden sm:flex gap-3 text-xs">
                  <span className="font-bold text-gray-500">Avg: <span className="font-black text-nb-green">{avgProgress}%</span></span>
                  {atRisk > 0 && (
                    <span className="font-bold text-red-500">⚠️ {atRisk} at risk</span>
                  )}
                </div>
                {/* Progress pill */}
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${cls.progress}%`, background: 'linear-gradient(90deg,#6FC911,#396336)' }} />
                  </div>
                  <span className="text-xs font-black text-nb-green">{cls.progress}%</span>
                </div>
                <span className="text-gray-400 text-sm font-bold">{isOpen ? '▲' : '▼'}</span>
              </div>
            </button>

            {/* Students table — collapsible */}
            {isOpen && (
              <div className="border-t border-nb-olive/20">
                {classStudents.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 py-6">No students match your search in this class.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-nb-cream/60">
                      <tr>
                        {['Student','Progress','Points','Status',''].map(h => (
                          <th key={h} className="text-left px-5 py-2.5 text-gray-400 font-black text-xs uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-nb-olive/10">
                      {classStudents.map(s => (
                        <tr key={s.id} className="hover:bg-nb-cream/40 transition">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-nb-dark flex-shrink-0"
                                   style={{ background: s.status === 'at_risk' ? '#fee2e2' : '#FFEB3C' }}>
                                {s.name[0]}
                              </div>
                              <span className="font-bold text-nb-dark">{s.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{
                                  width: `${s.progress}%`,
                                  background: s.progress >= 70 ? '#36913F' : s.progress >= 50 ? '#FFEB3C' : '#ef4444'
                                }} />
                              </div>
                              <span className="text-xs font-black text-gray-600">{s.progress}%</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 font-black text-amber-600">⭐ {s.points}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                              {s.status === 'at_risk' ? '⚠️ At Risk' : '✅ Active'}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button className="text-xs font-bold hover:text-nb-dark transition" style={{ color: '#36913F' }}>
                              View →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-nb-cream/40 border-t border-nb-olive/10">
                      <tr>
                        <td className="px-5 py-2.5 text-xs text-gray-400 font-semibold" colSpan={5}>
                          Showing {classStudents.length} of {cls.students} enrolled students
                          {atRisk > 0 && <span className="ml-3 text-red-500 font-bold">· {atRisk} need attention</span>}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
