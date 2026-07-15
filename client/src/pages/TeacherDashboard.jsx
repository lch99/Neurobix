import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ComingSoon from '../components/ComingSoon'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../lib/api'
import { TERMS } from '../data/lessons'
import { previewIcon, bookIcon, flashcardIcon } from '../assets/icons'

const CO_TEACHER_OPTIONS = ['Ms Sarah Tan', 'Mr Alif Ibrahim', 'Ms Maria Wong']

const TYPE_ICON = { video:'🎬', flashcard:'🃏', assessment:'📝', reading:'📄', activity:'🎨' }
const STATUS_STYLE = { published: 'bg-green-100 text-green-700', draft: 'bg-gray-100 text-gray-500', scheduled: 'bg-blue-100 text-blue-700' }

export default function TeacherDashboard() {
  const [tab, setTab] = useState('overview')

  return (
    <div className="min-h-screen bg-nb-cream">
      <Navbar role="teacher" userName="Ms Sarah Tan">
        <div className="max-w-7xl mx-auto px-2 flex gap-1 overflow-x-auto py-2 scrollbar-hide">
          {[
            { id: 'overview',    label: '📊 Overview'    },
            { id: 'classes',     label: '🏫 Classes'     },
            { id: 'lessons',     label: '📚 My Courses'  },
            { id: 'flashcards',  label: '🃏 Flash Cards'  },
            { id: 'memory',      label: '🧠 Memory Techniques' },
            { id: 'schedule',    label: '📅 Schedule'    },
            { id: 'students',    label: '👩‍🎓 Students'   },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 border-b-2 ${
                tab === t.id ? 'text-nb-dark border-nb-green' : 'text-gray-500 hover:bg-nb-cream border-transparent'
              }`}
              style={tab === t.id ? { background: '#FFEB3C' } : {}}>
              {t.label}
            </button>
          ))}
        </div>
      </Navbar>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">

        {/* OVERVIEW */}
        {tab === 'overview' && <div className="tab-panel"><OverviewTab /></div>}

        {/* CLASSES */}
        {tab === 'classes' && <div className="tab-panel"><ClassesTab /></div>}

        {/* LESSONS */}
        {tab === 'lessons' && <div className="tab-panel"><LessonsTab /></div>}

        {/* FLASH CARDS */}
        {tab === 'flashcards' && <div className="tab-panel"><FlashCardEditor /></div>}

        {/* MEMORY TECHNIQUES (coming soon) */}
        {tab === 'memory' && (
          <div className="tab-panel">
            <ComingSoon description="A dedicated space to create and assign memory-method content — mnemonics, memory palace exercises and story-method templates for your classes. We're building it now — check back soon!" />
          </div>
        )}

        {/* SCHEDULE */}
        {tab === 'schedule' && <div className="tab-panel"><ScheduleView /></div>}

        {/* STUDENTS — broken down by class */}
        {tab === 'students' && <div className="tab-panel"><StudentsTab /></div>}
      </div>
    </div>
  )
}

/* ── Flash Card Editor ── */
function FlashCardEditor() {
  const { token } = useAuth()
  const [decks, setDecks]         = useState([])
  const [classes, setClasses]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [activeDeckId, setActiveDeckId] = useState(null)
  const [cards, setCards]         = useState([])
  const [cardsLoading, setCardsLoading] = useState(false)
  const [previewIdx, setPreviewIdx]     = useState(null)
  const [previewFlipped, setPreviewFlipped] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newForm, setNewForm]       = useState({ title: '', classId: '' })
  const [saved, setSaved]           = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [lessonsData, classesData] = await Promise.all([
        apiRequest('/api/lessons', { token }),
        apiRequest('/api/classes', { token }),
      ])
      setDecks(lessonsData.filter(l => l.type === 'flashcard'))
      setClasses(classesData)
      setNewForm(f => ({ ...f, classId: f.classId || classesData[0]?.id || '' }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const deck = decks.find(d => d.id === activeDeckId) || null

  async function openDeck(id) {
    setActiveDeckId(id)
    setCardsLoading(true)
    setError('')
    try {
      const data = await apiRequest(`/api/flashcards?lessonId=${id}`, { token })
      setCards(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setCardsLoading(false)
    }
  }

  async function addCard() {
    try {
      const card = await apiRequest('/api/flashcards', { method: 'POST', body: { lessonId: activeDeckId, front: '', back: '', hint: '' }, token })
      setCards(cs => [...cs, card])
      setDecks(ds => ds.map(d => d.id === activeDeckId ? { ...d, cardCount: (d.cardCount || 0) + 1 } : d))
    } catch (err) {
      setError(err.message)
    }
  }
  async function removeCard(cardId) {
    try {
      await apiRequest(`/api/flashcards/${cardId}`, { method: 'DELETE', token })
      setCards(cs => cs.filter(c => c.id !== cardId))
      setDecks(ds => ds.map(d => d.id === activeDeckId ? { ...d, cardCount: Math.max(0, (d.cardCount || 0) - 1) } : d))
    } catch (err) {
      setError(err.message)
    }
  }
  function updateCard(cardId, field, value) {
    setCards(cs => cs.map(c => c.id === cardId ? { ...c, [field]: value } : c))
  }
  async function createDeck() {
    if (!newForm.title.trim() || !newForm.classId) return
    try {
      const created = await apiRequest('/api/lessons', { method: 'POST', body: { classId: Number(newForm.classId), title: newForm.title, type: 'flashcard', status: 'draft' }, token })
      setDecks(p => [created, ...p])
      setIsCreating(false)
      setNewForm({ title: '', classId: classes[0]?.id || '' })
      openDeck(created.id)
    } catch (err) {
      setError(err.message)
    }
  }
  async function saveDeck() {
    try {
      await Promise.all(cards.map(c => apiRequest(`/api/flashcards/${c.id}`, {
        method: 'PUT', body: { front: c.front, back: c.back, hint: c.hint }, token,
      })))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.message)
    }
  }

  /* ── Preview mode ── */
  if (previewIdx !== null && deck) {
    const card = cards[previewIdx] || cards[0]
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <button onClick={() => { setPreviewIdx(null); setPreviewFlipped(false) }}
            className="text-sm font-bold text-gray-400 hover:text-nb-dark">← Back to Editor</button>
          <p className="text-sm font-bold text-gray-400">Preview · {previewIdx + 1} / {cards.length}</p>
        </div>
        <div className="max-w-lg mx-auto space-y-4">
          <div className="flex gap-2 justify-center">
            {cards.map((_, i) => (
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
            <button onClick={() => { setPreviewIdx((previewIdx - 1 + cards.length) % cards.length); setPreviewFlipped(false) }}
              className="flex-1 py-3 rounded-2xl border-2 border-gray-200 font-black text-gray-500 hover:border-nb-olive transition">← Prev</button>
            <button onClick={() => { setPreviewIdx((previewIdx + 1) % cards.length); setPreviewFlipped(false) }}
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
            <p className="text-xs text-gray-400">{deck.className} · {deck.subject} · {cards.length} cards</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setPreviewIdx(0); setPreviewFlipped(false) }}
            className="px-4 py-2 text-nb-green border-2 border-nb-green text-sm font-black rounded-xl hover:bg-nb-green hover:text-white transition flex items-center gap-1.5">
            <img src={previewIcon} alt="" className="w-3.5 h-3.5 object-contain" /> Preview
          </button>
          <button onClick={saveDeck}
            className="px-4 py-2 text-nb-dark text-sm font-black rounded-xl shadow hover:shadow-md transition"
            style={{ background: saved ? '#6FC911' : '#FFEB3C', color: saved ? 'white' : '#396336' }}>
            {saved ? '✓ Saved!' : '💾 Save Deck'}
          </button>
        </div>
      </div>

      {/* Card rows */}
      {cardsLoading && <p className="text-sm text-gray-400">Loading cards...</p>}
      <div className="space-y-3">
        {cards.map((card, idx) => (
          <div key={card.id} className="bg-white rounded-2xl border-2 border-nb-olive/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Card {idx + 1}</span>
              <button onClick={() => removeCard(card.id)}
                className="text-xs font-bold text-red-400 hover:text-red-600 transition">✕ Remove</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wide mb-1">Front (Question)</label>
                <textarea rows={2} value={card.front}
                  onChange={e => updateCard(card.id, 'front', e.target.value)}
                  placeholder="e.g. What is 7 × 8?"
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm resize-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wide mb-1">Back (Answer)</label>
                <textarea rows={2} value={card.back}
                  onChange={e => updateCard(card.id, 'back', e.target.value)}
                  placeholder="e.g. 56"
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm resize-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-nb-olive uppercase tracking-wide mb-1">🧠 Memory Hint (记忆法)</label>
                <textarea rows={2} value={card.hint}
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
        <h2 className="text-xl font-black text-nb-dark flex items-center gap-2"><img src={flashcardIcon} alt="" className="w-6 h-6 object-contain" /> Flash Card Decks</h2>
        <button onClick={() => setIsCreating(true)} disabled={classes.length === 0}
          className="px-4 py-2 text-nb-dark text-sm font-black rounded-xl shadow hover:shadow-md transition disabled:opacity-40"
          style={{ background: '#FFEB3C' }}>+ New Deck</button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {loading && <p className="text-sm text-gray-400">Loading decks...</p>}
      {!loading && classes.length === 0 && (
        <p className="text-sm text-gray-400 bg-nb-cream rounded-xl p-4">Create a class first before adding flash card decks.</p>
      )}
      {!loading && decks.length === 0 && classes.length > 0 && (
        <p className="text-sm text-gray-400 bg-nb-cream rounded-xl p-4">No flash card decks yet. Click "+ New Deck" to create one.</p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {decks.map(d => (
          <div key={d.id} onClick={() => openDeck(d.id)}
            className="bg-white rounded-2xl border-2 border-nb-olive/20 p-5 hover:shadow-lg hover:border-nb-green/40 hover:-translate-y-0.5 transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center p-2.5" style={{ background:'#FFEB3C' }}><img src={flashcardIcon} alt="" className="w-full h-full object-contain" /></div>
              <span className="text-xs font-bold text-nb-green bg-green-50 px-2.5 py-1 rounded-full">{d.cardCount || 0} cards</span>
            </div>
            <p className="font-black text-nb-dark">{d.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{d.className} · {d.subject}</p>
            <div className="flex gap-1.5 mt-3">
              {Array.from({ length: Math.min(d.cardCount || 0, 5) }).map((_, i) => (
                <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background:'#FFEB3C' }} />
              ))}
              {(d.cardCount || 0) < 5 && Array.from({ length: 5 - (d.cardCount || 0) }).map((_, i) => (
                <div key={i} className="flex-1 h-1.5 rounded-full bg-gray-100" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create deck modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
             style={{ background:'rgba(0,0,0,0.45)' }}
             onClick={e => e.target === e.currentTarget && setIsCreating(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md p-5 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg sm:text-xl font-black text-nb-dark">New Flash Card Deck</h2>
              <button onClick={() => setIsCreating(false)} className="text-gray-400 text-2xl">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Deck Title *</label>
                <input value={newForm.title} onChange={e => setNewForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Multiplication Tables"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Class</label>
                <select value={newForm.classId} onChange={e => setNewForm(f => ({ ...f, classId: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm">
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} · {c.subject}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setIsCreating(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm">Cancel</button>
                <button onClick={createDeck} disabled={!newForm.title.trim() || !newForm.classId}
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

/* ── Lessons Tab (CRUD) ── */
function LessonsTab() {
  const { token } = useAuth()
  const [lessons, setLessons] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingLesson, setEditingLesson] = useState(null)
  const [editingAssessmentLesson, setEditingAssessmentLesson] = useState(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [lessonsData, classesData] = await Promise.all([
        apiRequest('/api/lessons', { token }),
        apiRequest('/api/classes', { token }),
      ])
      setLessons(lessonsData)
      setClasses(classesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(form) {
    if (editingLesson) {
      const updated = await apiRequest(`/api/lessons/${editingLesson.id}`, { method: 'PUT', body: form, token })
      setLessons(ls => ls.map(l => l.id === updated.id ? updated : l))
    } else {
      const created = await apiRequest('/api/lessons', { method: 'POST', body: form, token })
      setLessons(ls => [created, ...ls])
    }
    setShowModal(false)
    setEditingLesson(null)
  }

  async function handleDelete(lesson) {
    if (!window.confirm(`Delete "${lesson.title}"? This cannot be undone.`)) return
    await apiRequest(`/api/lessons/${lesson.id}`, { method: 'DELETE', token })
    setLessons(ls => ls.filter(l => l.id !== lesson.id))
  }

  if (editingAssessmentLesson) {
    return (
      <AssessmentEditor
        lesson={editingAssessmentLesson}
        onClose={() => setEditingAssessmentLesson(null)}
        onLessonUpdate={updated => setLessons(ls => ls.map(l => l.id === updated.id ? updated : l))}
      />
    )
  }

  return (
    <div className="space-y-4">
      {showModal && (
        <LessonModal
          initial={editingLesson}
          classes={classes}
          onClose={() => { setShowModal(false); setEditingLesson(null) }}
          onSave={handleSave}
        />
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-black text-nb-dark">Lessons</h2>
        <button onClick={() => { setEditingLesson(null); setShowModal(true) }}
          disabled={classes.length === 0}
          className="px-3 sm:px-4 py-2 text-nb-dark text-xs sm:text-sm font-black rounded-xl shadow hover:shadow-md transition disabled:opacity-40"
          style={{ background: '#FFEB3C' }}>+ Add Lesson</button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
      )}

      {!loading && classes.length === 0 && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
          Create a class first in the Classes tab before adding lessons.
        </p>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading lessons…</p>
      ) : (
        <>
          {/* Card list on mobile, table on sm+ */}
          <div className="space-y-2 sm:hidden">
            {lessons.length === 0 && (
              <div className="bg-white rounded-2xl border border-nb-olive/20 py-10 flex flex-col items-center gap-2 text-center">
                <img src={bookIcon} alt="" className="w-10 h-10 object-contain" />
                <p className="font-black text-nb-dark">No lessons yet</p>
                <p className="text-sm text-gray-400">Click "+ Add Lesson" to get started</p>
              </div>
            )}
            {lessons.map(l => (
              <div key={l.id} className="bg-white rounded-2xl border border-nb-olive/20 p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-bold text-nb-dark text-sm">{TYPE_ICON[l.type]} {l.title}</p>
                  <button onClick={() => { setEditingLesson(l); setShowModal(true) }}
                    className="text-xs font-bold flex-shrink-0" style={{ color: '#36913F' }}>Edit</button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-400">{l.className}</span>
                  <span className="text-xs text-gray-400 capitalize">{l.type}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLE[l.status]}`}>{l.status}</span>
                  {l.type === 'assessment' && (
                    <button onClick={() => setEditingAssessmentLesson(l)} className="text-xs font-bold" style={{ color: '#396336' }}>Questions →</button>
                  )}
                  <button onClick={() => handleDelete(l)} className="text-xs font-bold text-red-400 ml-auto">Delete</button>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden sm:block bg-white rounded-2xl border border-nb-olive/20 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-nb-cream border-b border-nb-olive/20">
                <tr>
                  {['Title','Class','Type','Status',''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-gray-500 font-black text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-nb-olive/10">
                {lessons.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <span className="text-4xl block mb-2">📚</span>
                      <p className="font-black text-nb-dark">No lessons yet</p>
                      <p className="text-sm text-gray-400 mt-1">Click "+ Add Lesson" to get started</p>
                    </td>
                  </tr>
                )}
                {lessons.map(l => (
                  <tr key={l.id} className="hover:bg-nb-cream/50 transition">
                    <td className="px-5 py-3 font-bold text-nb-dark">{TYPE_ICON[l.type]} {l.title}</td>
                    <td className="px-5 py-3 text-gray-500">{l.className}</td>
                    <td className="px-5 py-3 capitalize text-gray-500">{l.type}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[l.status]}`}>{l.status}</span>
                    </td>
                    <td className="px-5 py-3 text-right space-x-3">
                      {l.type === 'assessment' && (
                        <button onClick={() => setEditingAssessmentLesson(l)}
                          className="text-xs font-bold hover:opacity-80 transition" style={{ color: '#396336' }}>Questions →</button>
                      )}
                      <button onClick={() => { setEditingLesson(l); setShowModal(true) }}
                        className="text-xs font-bold hover:text-nb-dark transition" style={{ color: '#36913F' }}>Edit</button>
                      <button onClick={() => handleDelete(l)} className="text-xs font-bold text-red-400 hover:text-red-600 transition">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

/* ── Lesson Create/Edit Modal ── */
function LessonModal({ initial, classes, onClose, onSave }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    classId: initial?.classId || classes[0]?.id || '',
    type: initial?.type || 'video',
    difficulty: initial?.difficulty || 'Medium',
    durationMinutes: initial?.durationMinutes || '',
    description: initial?.description || '',
    status: initial?.status || 'draft',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function set(k, v) {
    setError('')
    setForm(f => ({ ...f, [k]: v }))
  }

  const MATERIAL_TYPES = [
    { value: 'video',     icon: '🎬', label: 'Video',       desc: 'MP4 lesson recording' },
    { value: 'flashcard', icon: '🃏', label: 'Flash Cards', desc: 'Front/back memory cards' },
    { value: 'assessment', icon: '📝', label: 'Assessment', desc: 'Auto-graded questions' },
    { value: 'reading',   icon: '📄', label: 'Reading',     desc: 'PDF or text material' },
    { value: 'activity',  icon: '🎨', label: 'Activity',    desc: 'Hands-on task' },
  ]

  async function submit(e) {
    e.preventDefault()
    if (!form.title.trim()) { setError('Please enter a lesson title.'); return }
    if (!form.classId) { setError('Please select a class.'); return }
    setSaving(true)
    try {
      await onSave({
        ...form,
        classId: Number(form.classId),
        durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : null,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
         style={{ background: 'rgba(0,0,0,0.45)' }}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-nb-dark">{initial ? 'Edit Lesson' : 'New Lesson'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Pick a material type and assign to a class.</p>
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

          {/* Class + Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Class</label>
              <select value={form.classId} onChange={e => set('classId', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm">
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Difficulty</label>
              <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
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

          {/* Duration */}
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Duration (minutes)</label>
            <input type="number" min="1" value={form.durationMinutes} onChange={e => set('durationMinutes', e.target.value)}
              placeholder="e.g. 20"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
            <textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Brief description of this lesson"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm resize-none" />
          </div>

          {/* Publish Status */}
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Publish Status *</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'draft',     icon: '📝', label: 'Draft'     },
                { value: 'published', icon: '✅', label: 'Publish'   },
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

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-gray-300 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-xl font-black text-nb-dark text-sm shadow-md transition hover:shadow-lg disabled:opacity-50"
              style={{ background: '#FFEB3C' }}>
              {saving ? 'Saving…' : initial ? 'Save Changes' : 'Create Lesson →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Assessment Editor — scoped to a single lesson (type === 'assessment') ── */
function AssessmentEditor({ lesson, onClose, onLessonUpdate }) {
  const { token } = useAuth()
  const [assessment, setAssessment] = useState(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [saved, setSaved]           = useState(false)

  useEffect(() => { load() }, [lesson.id])

  async function load() {
    setLoading(true)
    setError('')
    try {
      let data = await apiRequest(`/api/assessments/by-lesson/${lesson.id}`, { token })
      if (!data) {
        data = await apiRequest('/api/assessments', { method: 'POST', body: { lessonId: lesson.id }, token })
      }
      setAssessment(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const Q_TYPES = [
    { value: 'mcq',       label: 'Multiple Choice', icon: '⚪' },
    { value: 'true_false', label: 'True / False',    icon: '✓✗' },
    { value: 'fill_in',   label: 'Fill in Blank',   icon: '___' },
    { value: 'image',     label: 'Image-Based',     icon: '🖼' },
  ]

  function defaultAnswer(type) {
    if (type === 'mcq') return 0
    if (type === 'true_false') return true
    return ''
  }

  async function addQuestion() {
    try {
      const q = await apiRequest(`/api/assessments/${assessment.id}/questions`, {
        method: 'POST',
        body: { type: 'mcq', text: '', options: ['', '', '', ''], answer: 0, points: 1 },
        token,
      })
      setAssessment(prev => ({ ...prev, questions: [...prev.questions, q] }))
    } catch (err) {
      setError(err.message)
    }
  }
  async function removeQuestion(qid) {
    try {
      await apiRequest(`/api/assessment-questions/${qid}`, { method: 'DELETE', token })
      setAssessment(prev => ({ ...prev, questions: prev.questions.filter(x => x.id !== qid) }))
    } catch (err) {
      setError(err.message)
    }
  }
  function updateQuestion(qid, field, value) {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map(x => {
        if (x.id !== qid) return x
        if (field === 'type') {
          return { ...x, type: value, answer: defaultAnswer(value), options: value === 'mcq' ? (x.options || ['', '', '', '']) : x.options }
        }
        return { ...x, [field]: value }
      }),
    }))
  }
  function updateOption(qid, optIdx, value) {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map(x => {
        if (x.id !== qid) return x
        const opts = [...(x.options || ['', '', '', ''])]
        opts[optIdx] = value
        return { ...x, options: opts }
      }),
    }))
  }
  async function saveAssessment() {
    try {
      await apiRequest(`/api/assessments/${assessment.id}`, {
        method: 'PUT',
        body: { passMark: assessment.passMark, leaderboard: assessment.leaderboard },
        token,
      })
      await Promise.all(assessment.questions.map(q => apiRequest(`/api/assessment-questions/${q.id}`, {
        method: 'PUT',
        body: { type: q.type, text: q.text, imageUrl: q.imageUrl, options: q.options, answer: q.answer, points: q.points },
        token,
      })))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.message)
    }
  }
  async function publishLesson() {
    try {
      const updated = await apiRequest(`/api/lessons/${lesson.id}`, { method: 'PUT', body: { status: 'published' }, token })
      setAssessment(prev => ({ ...prev, status: updated.status }))
      onLessonUpdate?.(updated)
    } catch (err) {
      setError(err.message)
    }
  }

  const STATUS_STYLE = { published: 'bg-green-100 text-green-700', draft: 'bg-gray-100 text-gray-500', scheduled: 'bg-blue-100 text-blue-700' }

  if (loading || !assessment) return (
    <div className="space-y-4">
      <button onClick={onClose} className="text-sm font-bold text-gray-400 hover:text-nb-dark">← Back to Lessons</button>
      {error ? <p className="text-sm text-red-500">{error}</p> : <p className="text-sm text-gray-400">Loading assessment...</p>}
    </div>
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-sm font-bold text-gray-400 hover:text-nb-dark">← Back to Lessons</button>
          <div>
            <h2 className="text-xl font-black text-nb-dark">{assessment.title}</h2>
            <p className="text-xs text-gray-400">{assessment.className} · {assessment.subject} · {assessment.questions.length} questions · Pass: {assessment.passMark}%</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[assessment.status]}`}>{assessment.status}</span>
          {assessment.status === 'draft' && (
            <button onClick={publishLesson}
              className="px-4 py-2 text-white text-sm font-black rounded-xl shadow hover:opacity-90 transition"
              style={{ background: '#36913F' }}>
              ✅ Publish
            </button>
          )}
          <button onClick={saveAssessment}
            className="px-4 py-2 text-sm font-black rounded-xl shadow hover:shadow-md transition"
            style={{ background: saved ? '#6FC911' : '#FFEB3C', color: saved ? 'white' : '#396336' }}>
            {saved ? '✓ Saved!' : '💾 Save'}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Assessment settings bar */}
      <div className="bg-white rounded-2xl border border-nb-olive/20 p-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-xs font-black text-gray-500 uppercase tracking-wide">Pass Mark</label>
          <input type="number" min="1" max="100"
            value={assessment.passMark}
            onChange={e => setAssessment(prev => ({ ...prev, passMark: Number(e.target.value) }))}
            className="w-16 px-2 py-1.5 rounded-lg border-2 border-nb-olive/20 text-sm font-black focus:outline-none focus:border-nb-green" />
          <span className="text-sm text-gray-400">%</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-black text-gray-500 uppercase tracking-wide">Leaderboard</label>
          <button onClick={() => setAssessment(prev => ({ ...prev, leaderboard: !prev.leaderboard }))}
            className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${assessment.leaderboard ? '' : 'bg-gray-200'}`}
            style={assessment.leaderboard ? { background: '#36913F' } : {}}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${assessment.leaderboard ? 'left-5' : 'left-0.5'}`} />
          </button>
          <span className="text-xs text-gray-400">{assessment.leaderboard ? 'Enabled' : 'Disabled'}</span>
        </div>
        <p className="text-xs text-gray-400 ml-auto hidden sm:block">Results visible to student, teacher &amp; parent · Auto-graded on submit</p>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {assessment.questions.map((q, idx) => (
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
            <input value={q.text || ''} onChange={e => updateQuestion(q.id, 'text', e.target.value)}
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
            {q.type === 'true_false' && (
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
            {(q.type === 'fill_in' || q.type === 'image') && (
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
}

/* ── Schedule View ── */
function ScheduleView() {
  const { token } = useAuth()
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await apiRequest('/api/schedules', { token })
      setLessons(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function saveSchedule(lessonId, form) {
    try {
      const updated = await apiRequest(`/api/schedules/${lessonId}`, {
        method: 'PUT',
        body: { publishAt: form.publishAt || null, deadlineAt: form.deadlineAt || null, notifyEmail: form.notifyEmail },
        token,
      })
      setLessons(prev => prev.map(l => l.id === updated.id ? updated : l))
      setEditing(null)
    } catch (err) {
      setError(err.message)
    }
  }

  async function clearSchedule(lessonId) {
    try {
      const updated = await apiRequest(`/api/schedules/${lessonId}`, { method: 'DELETE', token })
      setLessons(prev => prev.map(l => l.id === updated.id ? updated : l))
      setEditing(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const filtered = lessons.filter(l => filter === 'all' || l.status === filter)

  const STATUS_STYLE = {
    published:  'bg-green-100 text-green-700',
    draft:      'bg-gray-100 text-gray-500',
    scheduled:  'bg-blue-100 text-blue-700',
  }
  const STATUS_ICON = { published: '✅', draft: '📝', scheduled: '📅' }

  const counts = {
    all:       lessons.length,
    published: lessons.filter(l => l.status === 'published').length,
    scheduled: lessons.filter(l => l.status === 'scheduled').length,
    draft:     lessons.filter(l => l.status === 'draft').length,
  }

  const today = new Date()

  function fmt(dateStr) {
    if (!dateStr) return null
    const d = new Date(dateStr)
    return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
  function fmtDate(dateStr) {
    if (!dateStr) return null
    const d = new Date(dateStr)
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  }
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
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {loading && <p className="text-sm text-gray-400">Loading schedule...</p>}
      {!loading && lessons.length === 0 && (
        <p className="text-sm text-gray-400 bg-nb-cream rounded-xl p-4">No lessons yet. Add lessons in the Lessons tab first.</p>
      )}

      {!loading && lessons.length > 0 && (
        <>
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
          {lessons.filter(l => l.status === 'scheduled').length > 0 && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
              <h3 className="font-black text-blue-800 text-sm mb-2">⏰ Upcoming Releases</h3>
              <div className="space-y-1.5">
                {lessons.filter(l => l.status === 'scheduled').map(l => (
                  <div key={l.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 text-sm">
                    <span className="font-bold text-nb-dark">{l.title}</span>
                    <span className="text-xs text-blue-600 font-bold">📅 {fmt(l.releaseDate)}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-blue-500 mt-2">Students receive in-app + email notification when lesson goes live.</p>
            </div>
          )}

          {/* Overdue deadlines alert */}
          {lessons.some(l => isOverdue(l.deadline)) && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
              <h3 className="font-black text-red-700 text-sm mb-2">⚠️ Overdue Deadlines</h3>
              {lessons.filter(l => isOverdue(l.deadline)).map(l => (
                <div key={l.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 text-sm mb-1.5">
                  <div>
                    <span className="font-bold text-nb-dark">{l.title}</span>
                    <span className="ml-2 text-xs text-gray-400">{l.className}</span>
                  </div>
                  <span className="text-xs text-red-600 font-black">Deadline: {fmtDate(l.deadline)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Card list on mobile */}
          <div className="space-y-2 sm:hidden">
            {filtered.map(l => (
              <div key={l.id} className="bg-white rounded-2xl border border-nb-olive/20 p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-bold text-nb-dark text-sm">{l.title}</p>
                  <button onClick={() => setEditing(l)} className="text-xs font-bold flex-shrink-0" style={{ color: '#36913F' }}>Edit</button>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-gray-400">{l.className}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLE[l.status]}`}>{STATUS_ICON[l.status]} {l.status}</span>
                  {l.deadline && (
                    <span className={`text-xs font-bold ${isOverdue(l.deadline) ? 'text-red-500' : isDueSoon(l.deadline) ? 'text-amber-600' : 'text-gray-400'}`}>
                      Due {fmtDate(l.deadline)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Table on sm+ */}
          <div className="hidden sm:block bg-white rounded-2xl border border-nb-olive/20 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-nb-cream border-b border-nb-olive/20">
                <tr>
                  {['Lesson', 'Class', 'Status', 'Release Date', 'Deadline', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-gray-500 font-black text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-nb-olive/10">
                {filtered.map(l => (
                  <tr key={l.id} className="hover:bg-nb-cream/50 transition">
                    <td className="px-4 py-3 font-bold text-nb-dark">{l.title}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{l.className}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[l.status]}`}>
                        {STATUS_ICON[l.status]} {l.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {l.releaseDate ? fmt(l.releaseDate) : <span className="text-gray-300">Immediate</span>}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {l.deadline ? (
                        <span className={`font-bold ${isOverdue(l.deadline) ? 'text-red-500' : isDueSoon(l.deadline) ? 'text-amber-600' : 'text-gray-500'}`}>
                          {isOverdue(l.deadline) ? '⚠️ ' : isDueSoon(l.deadline) ? '⏰ ' : ''}{fmtDate(l.deadline)}
                        </span>
                      ) : <span className="text-gray-300">None</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setEditing(l)} className="text-xs font-bold hover:text-nb-dark transition" style={{ color: '#36913F' }}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Notification reminder */}
      <div className="rounded-2xl p-4 border-2 border-nb-yellow flex items-start gap-3"
           style={{ background: '#FFEB3C10' }}>
        <span className="text-xl flex-shrink-0">📬</span>
        <div>
          <p className="font-black text-nb-dark text-sm">Student Notifications</p>
          <p className="text-xs text-gray-600 mt-0.5">Students automatically receive an in-app notification and email when a lesson goes live. Scheduled lessons trigger notifications at the exact release time.</p>
        </div>
      </div>

      {editing && (
        <ScheduleModal
          lesson={editing}
          onClose={() => setEditing(null)}
          onSave={saveSchedule}
          onClear={clearSchedule}
        />
      )}
    </div>
  )
}

/* ── Schedule edit modal ── */
function ScheduleModal({ lesson, onClose, onSave, onClear }) {
  function toLocalInput(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }
  function toDateInput(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }

  const [publishAt, setPublishAt] = useState(toLocalInput(lesson.releaseDate))
  const [deadlineAt, setDeadlineAt] = useState(toDateInput(lesson.deadline))
  const [notifyEmail, setNotifyEmail] = useState(lesson.notifyEmail)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await onSave(lesson.id, {
        publishAt: publishAt ? new Date(publishAt).toISOString() : null,
        deadlineAt: deadlineAt ? new Date(deadlineAt).toISOString() : null,
        notifyEmail,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
         style={{ background: 'rgba(0,0,0,0.45)' }}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md p-5 sm:p-7">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-black text-nb-dark">Schedule: {lesson.title}</h2>
          <button onClick={onClose} className="text-gray-400 text-2xl">×</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Release Date &amp; Time</label>
            <input type="datetime-local" value={publishAt} onChange={e => setPublishAt(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
            <p className="text-xs text-gray-400 mt-1">Leave blank to publish immediately.</p>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Deadline</label>
            <input type="date" value={deadlineAt} onChange={e => setDeadlineAt(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setNotifyEmail(v => !v)}
              className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${notifyEmail ? '' : 'bg-gray-200'}`}
              style={notifyEmail ? { background: '#36913F' } : {}}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${notifyEmail ? 'left-5' : 'left-0.5'}`} />
            </button>
            <span className="text-xs text-gray-500 font-bold">Notify students by email</span>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => onClear(lesson.id)}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm">Clear Schedule</button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-3 rounded-xl font-black text-nb-dark text-sm shadow-md disabled:opacity-40 transition"
              style={{ background: '#FFEB3C' }}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ADMIN_ANNOUNCEMENTS = [
  { id: 1, message: 'Term 3 report cards are due by Friday, 24 Jul 2026. Please finalise grades before then.', time: '2 days ago' },
  { id: 2, message: 'A new Flash Card icon set has been uploaded — refresh your browser to see it in the editor.', time: '5 days ago' },
  { id: 3, message: 'Reminder: Parent-Teacher meeting sign-up closes this Sunday. Add your available slots on the Schedule tab.', time: '1 week ago' },
]

/* ── Overview Tab ── */
function OverviewTab() {
  const { token } = useAuth()
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [classesData, studentsData] = await Promise.all([
        apiRequest('/api/classes', { token }),
        apiRequest('/api/students', { token }),
      ])
      setClasses(classesData || [])
      setStudents(studentsData || [])
    } catch (err) {
      setError(err.message || 'Failed to load overview')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-gray-400">Loading overview...</div>
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>

  const totalStudents = new Set(students.map(s => s.studentId)).size
  const totalLessons = classes.reduce((sum, c) => sum + (c.lessons || 0), 0)
  const avgClassSize = classes.length ? Math.round(totalStudents / classes.length) : 0

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Students', value: totalStudents,  icon: '👩‍🎓', bg: 'bg-blue-50',  text: 'text-blue-700' },
          { label: 'Active Classes', value: classes.length, icon: '📚',  bg: 'bg-green-50', text: 'text-nb-green' },
          { label: 'Total Lessons',  value: totalLessons,   icon: '✅',  bg: 'bg-nb-cream', text: 'text-nb-dark' },
          { label: 'Avg Class Size', value: avgClassSize,   icon: '📊',  bg: 'bg-amber-50', text: 'text-amber-700' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-nb-olive/20`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className={`text-2xl sm:text-3xl font-black ${s.text}`}>{s.value}</div>
            <div className="text-xs sm:text-sm text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Admin Announcements (memo board) */}
      <div className="bg-white rounded-2xl border border-nb-olive/20 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-nb-dark flex items-center gap-1.5">📢 Announcements</h3>
          <span className="text-xs text-gray-400 font-semibold">From Admin</span>
        </div>
        <div className="space-y-3">
          {ADMIN_ANNOUNCEMENTS.map(a => (
            <div key={a.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 bg-nb-dark">A</div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-black text-nb-dark">Admin</p>
                  <span className="text-xs text-gray-400">· {a.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{a.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Classes */}
      <div>
        <h3 className="font-black text-nb-dark mb-3">Your Classes</h3>
        {classes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-nb-olive/20 py-12 flex flex-col items-center gap-2 text-center">
            <span className="text-4xl">🏫</span>
            <p className="font-black text-nb-dark">No classes yet</p>
            <p className="text-sm text-gray-400">Create a class to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {classes.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-nb-olive/20 p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-black text-nb-dark">{c.name}</span>
                  <span className="ml-2 text-xs text-gray-400">{c.subject}</span>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 text-xs sm:text-sm">
                  <span className="text-gray-500">👩‍🎓 {c.students} students</span>
                  <span className="text-gray-500">📚 {c.lessons} lessons</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Students broken down by class ── */
function StudentsTab() {
  const { token } = useAuth()
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [collapsed, setCollapsed] = useState({})
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [classesData, studentsData] = await Promise.all([
        apiRequest('/api/classes', { token }),
        apiRequest('/api/students', { token }),
      ])
      setClasses(classesData || [])
      setStudents(studentsData || [])
    } catch (err) {
      setError(err.message || 'Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  async function removeStudent(enrollmentId) {
    if (!confirm('Remove this student from the class?')) return
    setRemovingId(enrollmentId)
    try {
      await apiRequest(`/api/students/${enrollmentId}`, { method: 'DELETE', token })
      setStudents(prev => prev.filter(s => s.enrollmentId !== enrollmentId))
    } catch (err) {
      setError(err.message || 'Failed to remove student')
    } finally {
      setRemovingId(null)
    }
  }

  function toggleClass(id) {
    setCollapsed(c => ({ ...c, [id]: !c[id] }))
  }

  if (loading) return <div className="text-center py-12 text-gray-400">Loading students...</div>
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>

  const filtered = search
    ? students.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()))
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

      {classes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-nb-olive/20 py-12 flex flex-col items-center gap-2 text-center">
          <span className="text-4xl">🏫</span>
          <p className="font-black text-nb-dark">No classes yet</p>
          <p className="text-sm text-gray-400">Create a class first to see its students here.</p>
        </div>
      ) : (
        <>
          {/* Global empty state when search matches nothing */}
          {search && filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-nb-olive/20 py-12 flex flex-col items-center gap-2 text-center">
              <span className="text-4xl">🔍</span>
              <p className="font-black text-nb-dark">No students found</p>
              <p className="text-sm text-gray-400">Try a different name</p>
            </div>
          )}

          {/* One section per class */}
          {classes.map(cls => {
            const classStudents = filtered.filter(s => s.classId === cls.id)
            if (classStudents.length === 0 && search) return null
            const isOpen = !collapsed[cls.id]

            return (
              <div key={cls.id} className="bg-white rounded-2xl border-2 border-nb-olive/20 overflow-hidden">
                {/* Class header — clickable to collapse */}
                <button
                  onClick={() => toggleClass(cls.id)}
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
                  <span className="text-gray-400 text-sm font-bold">{isOpen ? '▲' : '▼'}</span>
                </button>

                {/* Students — collapsible */}
                {isOpen && (
                  <div className="border-t border-nb-olive/20">
                    {classStudents.length === 0 ? (
                      <p className="text-center text-sm text-gray-400 py-6">
                        {search ? 'No students match your search in this class.' : 'No students enrolled in this class yet.'}
                      </p>
                    ) : (
                      <>
                        {/* Mobile card list */}
                        <div className="sm:hidden divide-y divide-nb-olive/10">
                          {classStudents.map(s => (
                            <div key={s.enrollmentId} className="px-4 py-3 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-nb-dark flex-shrink-0"
                                   style={{ background: '#FFEB3C' }}>
                                {s.name?.[0]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-nb-dark text-sm truncate">{s.name}</p>
                                <p className="text-xs text-gray-400 truncate">{s.email}</p>
                              </div>
                              <button onClick={() => removeStudent(s.enrollmentId)} disabled={removingId === s.enrollmentId}
                                className="text-xs font-bold text-red-500 hover:underline disabled:opacity-40 flex-shrink-0">
                                {removingId === s.enrollmentId ? '...' : 'Remove'}
                              </button>
                            </div>
                          ))}
                        </div>
                        {/* Table on sm+ */}
                        <table className="hidden sm:table w-full text-sm">
                          <thead className="bg-nb-cream/60">
                            <tr>
                              {['Student','Email','Level',''].map(h => (
                                <th key={h} className="text-left px-5 py-2.5 text-gray-400 font-black text-xs uppercase tracking-wide">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-nb-olive/10">
                            {classStudents.map(s => (
                              <tr key={s.enrollmentId} className="hover:bg-nb-cream/40 transition">
                                <td className="px-5 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-nb-dark flex-shrink-0"
                                         style={{ background: '#FFEB3C' }}>
                                      {s.name?.[0]}
                                    </div>
                                    <span className="font-bold text-nb-dark">{s.name}</span>
                                  </div>
                                </td>
                                <td className="px-5 py-3 text-gray-500">{s.email}</td>
                                <td className="px-5 py-3 text-gray-500">{s.level || '—'}</td>
                                <td className="px-5 py-3 text-right">
                                  <button onClick={() => removeStudent(s.enrollmentId)} disabled={removingId === s.enrollmentId}
                                    className="text-xs font-bold text-red-500 hover:underline disabled:opacity-40">
                                    {removingId === s.enrollmentId ? 'Removing...' : 'Remove →'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-nb-cream/40 border-t border-nb-olive/10">
                            <tr>
                              <td className="px-5 py-2.5 text-xs text-gray-400 font-semibold" colSpan={4}>
                                Showing {classStudents.length} of {cls.students} enrolled students
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                        <p className="sm:hidden px-4 py-2 text-xs text-gray-400 border-t border-nb-olive/10">
                          Showing {classStudents.length} of {cls.students} enrolled
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

/* ── Classes Tab (CRUD) ── */
function ClassesTab() {
  const { token } = useAuth()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingClass, setEditingClass] = useState(null)

  useEffect(() => {
    loadClasses()
  }, [])

  async function loadClasses() {
    setLoading(true)
    setError('')
    try {
      const data = await apiRequest('/api/classes', { token })
      setClasses(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(form) {
    if (editingClass) {
      const updated = await apiRequest(`/api/classes/${editingClass.id}`, { method: 'PUT', body: form, token })
      setClasses(cs => cs.map(c => c.id === updated.id ? updated : c))
    } else {
      const created = await apiRequest('/api/classes', { method: 'POST', body: form, token })
      setClasses(cs => [created, ...cs])
    }
    setShowModal(false)
    setEditingClass(null)
  }

  async function handleDelete(cls) {
    if (!window.confirm(`Delete "${cls.name}"? This cannot be undone.`)) return
    await apiRequest(`/api/classes/${cls.id}`, { method: 'DELETE', token })
    setClasses(cs => cs.filter(c => c.id !== cls.id))
  }

  async function handleArchiveToggle(cls) {
    const updated = await apiRequest(`/api/classes/${cls.id}`, {
      method: 'PUT',
      body: { status: cls.status === 'archived' ? 'active' : 'archived' },
      token,
    })
    setClasses(cs => cs.map(c => c.id === updated.id ? updated : c))
  }

  return (
    <div className="space-y-4">
      {showModal && (
        <ClassModal
          initial={editingClass}
          onClose={() => { setShowModal(false); setEditingClass(null) }}
          onSave={handleSave}
        />
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-black text-nb-dark">My Classes</h2>
        <button onClick={() => { setEditingClass(null); setShowModal(true) }}
          className="px-3 sm:px-4 py-2 text-nb-dark text-xs sm:text-sm font-black rounded-xl shadow hover:shadow-md transition"
          style={{ background: '#FFEB3C' }}>+ New Class</button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading classes…</p>
      ) : classes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-nb-olive/20 py-10 flex flex-col items-center gap-2 text-center">
          <span className="text-4xl">📚</span>
          <p className="font-black text-nb-dark">No classes yet</p>
          <p className="text-sm text-gray-400">Click "+ New Class" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {classes.map(c => (
            <div key={c.id} className={`bg-white rounded-2xl border border-nb-olive/20 p-5 transition ${c.status === 'archived' ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-3 shadow-sm"
                     style={{ background: 'linear-gradient(135deg,#91BA4F,#396336)' }}>📚</div>
                {c.status === 'archived' && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500">Archived</span>
                )}
              </div>
              <h3 className="font-black text-nb-dark">{c.name}</h3>
              <p className="text-sm text-gray-500">{c.subject}{c.level ? ` · ${c.level}` : ''} · <span className="capitalize">{c.type}</span></p>
              <div className="mt-3 flex gap-4 text-sm text-gray-400">
                <span>👩‍🎓 {c.students}{c.type === 'extra' && c.slots ? `/${c.slots}` : ''}</span>
                <span>📖 {c.lessons} lessons</span>
              </div>
              {c.terms?.length > 0 && (
                <p className="text-xs text-gray-400 mt-1.5">🗓️ {c.terms.map(id => TERMS.find(t => t.id === id)?.name || `Term ${id}`).join(', ')}</p>
              )}
              {c.coTeachers?.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">👩‍🏫 Co-taught with {c.coTeachers.join(', ')}</p>
              )}
              <div className="mt-4 flex gap-2 flex-wrap">
                <button onClick={() => { setEditingClass(c); setShowModal(true) }}
                  className="px-3 py-1.5 text-xs font-black rounded-lg border-2 border-nb-olive/30 text-nb-dark hover:border-nb-green transition">Edit</button>
                <button onClick={() => handleArchiveToggle(c)}
                  className="px-3 py-1.5 text-xs font-black rounded-lg border-2 border-nb-olive/30 text-gray-500 hover:border-nb-olive transition">
                  {c.status === 'archived' ? 'Unarchive' : 'Archive'}
                </button>
                <button onClick={() => handleDelete(c)}
                  className="px-3 py-1.5 text-xs font-black rounded-lg border-2 border-red-200 text-red-500 hover:border-red-400 transition">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Class Create/Edit Modal ── */
function ClassModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    subject: initial?.subject || 'Mathematics',
    level: initial?.level || 'P4',
    type: initial?.type || 'regular',
    description: initial?.description || '',
    leaderboardEnabled: initial?.leaderboardEnabled ?? false,
    slots: initial?.slots ?? 16,
    coTeachers: initial?.coTeachers || [],
    terms: initial?.terms || [3],
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function set(k, v) {
    setError('')
    setForm(f => ({ ...f, [k]: v }))
  }

  function toggleInList(k, value) {
    setError('')
    setForm(f => ({
      ...f,
      [k]: f[k].includes(value) ? f[k].filter(v => v !== value) : [...f[k], value],
    }))
  }

  async function submit(e) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Please enter a class name.'); return }
    if (form.terms.length === 0) { setError('Select at least one term.'); return }
    setSaving(true)
    try {
      await onSave(form)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
         style={{ background: 'rgba(0,0,0,0.45)' }}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md p-5 sm:p-7">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-black text-nb-dark">{initial ? 'Edit Class' : 'New Class'}</h2>
          <button onClick={onClose} className="text-gray-400 text-2xl">×</button>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Class Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="e.g. Primary 4A"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Subject</label>
              <select value={form.subject} onChange={e => set('subject', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm">
                <option>Mathematics</option>
                <option>English</option>
                <option>Science</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Level</label>
              <select value={form.level} onChange={e => set('level', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm">
                {['P1','P2','P3','P4','P5','P6'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Class Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'regular', label: 'Regular', desc: 'Sequential lessons' },
                { value: 'extra',   label: 'Extra',   desc: 'Open, self-enrol' },
              ].map(t => (
                <button type="button" key={t.value} onClick={() => set('type', t.value)}
                  className={`flex flex-col items-start gap-0.5 p-3 rounded-xl border-2 text-left transition-all ${
                    form.type === t.value ? 'border-nb-green shadow-sm' : 'border-gray-100 bg-white hover:border-nb-olive'
                  }`}
                  style={form.type === t.value ? { background: '#6FC91112' } : {}}>
                  <span className="text-sm font-black text-nb-dark">{t.label}</span>
                  <span className="text-[10px] text-gray-400">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {form.type === 'extra' && (
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Slot Cap</label>
              <input type="number" min="1" value={form.slots} onChange={e => set('slots', Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
              <p className="text-[10px] text-gray-400 mt-1">Max students who can self-enrol · default 16</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Co-Teachers</label>
            <div className="flex flex-wrap gap-1.5">
              {CO_TEACHER_OPTIONS.map(name => (
                <button type="button" key={name} onClick={() => toggleInList('coTeachers', name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                    form.coTeachers.includes(name) ? 'border-nb-green text-white' : 'border-gray-100 text-gray-500 hover:border-nb-olive'
                  }`}
                  style={form.coTeachers.includes(name) ? { background: '#36913F' } : {}}>
                  {name}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Optional — a class can have more than one teacher</p>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Terms *</label>
            <div className="flex flex-wrap gap-1.5">
              {TERMS.map(t => (
                <button type="button" key={t.id} onClick={() => toggleInList('terms', t.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                    form.terms.includes(t.id) ? 'border-nb-green text-white' : 'border-gray-100 text-gray-500 hover:border-nb-olive'
                  }`}
                  style={form.terms.includes(t.id) ? { background: '#36913F' } : {}}>
                  {t.name}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-1">A class can span more than one term</p>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
            <textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Optional description for this class"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm resize-none" />
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => set('leaderboardEnabled', !form.leaderboardEnabled)}
              className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${form.leaderboardEnabled ? '' : 'bg-gray-200'}`}
              style={form.leaderboardEnabled ? { background: '#36913F' } : {}}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.leaderboardEnabled ? 'left-5' : 'left-0.5'}`} />
            </button>
            <span className="text-sm font-bold text-gray-500">Enable Leaderboard</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-gray-300 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-xl font-black text-nb-dark text-sm shadow-md transition hover:shadow-lg disabled:opacity-50"
              style={{ background: '#FFEB3C' }}>
              {saving ? 'Saving…' : initial ? 'Save Changes' : 'Create Class →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
