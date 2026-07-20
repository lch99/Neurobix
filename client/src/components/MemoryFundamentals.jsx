import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { brainIcon, lightBulbIcon } from '../assets/icons'

export const TECHNIQUES = [
  {
    id: 'story', icon: '📖', name: 'Story Method', color: '#f59e0b', bg: '#FEF3E2',
    tagline: 'Turn facts into a silly story',
    description: 'Link ideas together into a short, vivid story. The sillier and more exaggerated, the easier it sticks.',
    steps: [
      'Pick the 3–5 key facts you need to remember',
      'Turn each fact into a character or action',
      'Connect them in order using a short, silly story',
      'Picture the story happening like a movie in your head',
    ],
    example: {
      title: 'Remembering the water cycle',
      prompt: 'Evaporation → Condensation → Precipitation → Collection',
      story: 'A thirsty Sun drinks up the ocean (evaporation), gets so full it turns into a cloud (condensation), the cloud cries big tears (precipitation), and the tears run home to the river (collection).',
    },
    usedIn: ['The Solar System', 'Plants & Photosynthesis'],
    parentTip: 'Ask your child to tell you their story out loud after each lesson — retelling strengthens the memory even more.',
    stats: { students: 34, engagement: 82 },
  },
  {
    id: 'palace', icon: '🏰', name: 'Memory Palace', color: '#8b5cf6', bg: '#F3ECFE',
    tagline: 'Place ideas around a familiar location',
    description: 'Imagine walking through a place you know well and "place" each fact at a specific spot along the way.',
    steps: [
      'Choose a familiar route, e.g. your walk from front door to bedroom',
      'Pick 5–8 clear stops along that route',
      'Place one fact or image at each stop',
      'Walk the route in your mind to recall the facts in order',
    ],
    example: {
      title: 'Remembering the human body systems',
      prompt: 'Skeletal → Muscular → Digestive → Nervous',
      story: 'Front door = a skeleton statue guarding the house. Living room = a strongman flexing on the sofa. Kitchen = a hungry monster eating. Bedroom = a glowing brain-shaped lamp.',
    },
    usedIn: ['The Human Body'],
    parentTip: 'Walk through the "palace" together at home — ask your child to describe what they placed at each stop.',
    stats: { students: 21, engagement: 65 },
  },
  {
    id: 'peg', icon: '🔢', name: 'Peg System', color: '#3b82f6', bg: '#E9F1FE',
    tagline: 'Hang facts on number "pegs"',
    description: 'Attach each number to a rhyming picture (1=Bun, 2=Shoe…), then link that picture to what you need to remember.',
    steps: [
      'Learn a set of number pegs, e.g. 1=Bun, 2=Shoe, 3=Tree, 4=Door',
      'For each fact, imagine it interacting with the matching peg',
      'The sillier the image, the stronger the memory',
      'Recall by counting through your pegs in order',
    ],
    example: {
      title: 'Remembering the first 4 planets',
      prompt: '1. Mercury  2. Venus  3. Earth  4. Mars',
      story: '1 (Bun) is burning hot like Mercury. 2 (Shoe) is a glowing heart-shaped shoe for Venus. 3 (Tree) has planet Earth hanging on it like a globe. 4 (Door) is painted red like Mars.',
    },
    usedIn: ['The Solar System'],
    parentTip: 'Practise the number pegs (1=Bun, 2=Shoe…) together as a quick car-ride game.',
    stats: { students: 18, engagement: 58 },
  },
  {
    id: 'acronym', icon: '🔤', name: 'Acronyms & Acrostics', color: '#36913F', bg: '#EAF7E9',
    tagline: 'First letters make a new word or phrase',
    description: 'Use the first letter of each item to build a new word (acronym) or a silly sentence (acrostic).',
    steps: [
      'List out the items in the order you need to remember',
      'Take the first letter of each item',
      'Arrange the letters into a word, or a sentence where each word starts with that letter',
      'Practise saying it until it feels automatic',
    ],
    example: {
      title: 'Remembering planet order',
      prompt: 'Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune',
      story: '"My Very Educated Mother Just Served Us Noodles"',
    },
    usedIn: ['The Solar System', 'Forces & Motion'],
    parentTip: 'Say the acronym together at dinner — repeating it out loud helps it stick.',
    stats: { students: 29, engagement: 74 },
  },
  {
    id: 'chunking', icon: '🧩', name: 'Chunking', color: '#e11d48', bg: '#FDEAEE',
    tagline: 'Break big info into small groups',
    description: 'Split a long list or number into smaller, easier-to-remember chunks of 3–4 items.',
    steps: [
      'Look at the full list you need to learn',
      'Group related items together into chunks of 3–4',
      'Give each chunk a short label or theme',
      'Learn one chunk at a time before combining them',
    ],
    example: {
      title: 'Remembering body organs',
      prompt: 'Heart, lungs, brain, stomach, liver, kidneys, skin, muscles',
      story: 'Chunk "Control": Brain, Nerves. Chunk "Pump & Breathe": Heart, Lungs. Chunk "Digest": Stomach, Liver, Kidneys.',
    },
    usedIn: ['The Human Body', 'Plants & Photosynthesis'],
    parentTip: 'Test your child by asking for one chunk at a time instead of the whole list at once.',
    stats: { students: 15, engagement: 47 },
  },
  {
    id: 'visualization', icon: '🖼️', name: 'Picture Linking', color: '#0891b2', bg: '#E5F6FA',
    tagline: 'Turn words into vivid mental pictures',
    description: 'Convert an abstract fact into a clear, colourful mental image, then chain the images together.',
    steps: [
      'Turn each fact into a concrete picture in your mind',
      'Make it big, colourful, and a little exaggerated',
      'Link each picture to the next one in a chain',
      'Replay the chain of pictures to recall the facts',
    ],
    example: {
      title: 'Remembering forces',
      prompt: 'Push, pull, gravity, friction',
      story: 'A giant hand pushing a boulder, tied by rope being pulled by an elephant, falling off a cliff (gravity), and landing on sticky glue (friction).',
    },
    usedIn: ['Forces & Motion'],
    parentTip: 'Ask your child to draw the picture they imagined — drawing reinforces the image even further.',
    stats: { students: 12, engagement: 40 },
  },
]

function Header({ eyebrow, title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center p-2.5 flex-shrink-0" style={{ background: '#FFEB3C1A' }}>
        <img src={brainIcon} alt="" className="w-full h-full object-contain" />
      </div>
      <div>
        {eyebrow && <p className="text-[11px] font-black uppercase tracking-widest text-nb-green">{eyebrow}</p>}
        <h2 className="text-xl sm:text-2xl font-black text-nb-dark">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400 font-semibold mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

function TechniqueGridCard({ t, onClick, badge }) {
  return (
    <div onClick={onClick}
      className="bg-white rounded-2xl border-2 border-nb-olive/20 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group">
      <div className="h-1.5 w-full" style={{ background: t.color }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: t.bg }}>{t.icon}</div>
          {badge}
        </div>
        <p className="font-black text-nb-dark text-[15px] leading-snug group-hover:text-nb-green transition-colors">{t.name}</p>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{t.tagline}</p>
      </div>
    </div>
  )
}

function TechniqueDetail({ t, onBack, footer }) {
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-sm font-bold text-gray-400 hover:text-nb-dark transition px-3 py-1.5 -ml-3 rounded-lg hover:bg-gray-100">
        ← Back to Memory Fundamentals
      </button>

      <div className="bg-white rounded-2xl border-2 border-nb-olive/20 overflow-hidden">
        <div className="h-1.5 w-full" style={{ background: t.color }} />
        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: t.bg }}>{t.icon}</div>
            <div>
              <p className="font-black text-nb-dark text-lg leading-snug">{t.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t.tagline}</p>
            </div>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed">{t.description}</p>

          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">How it works</p>
            <div className="space-y-2">
              {t.steps.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white flex-shrink-0" style={{ background: t.color }}>{i + 1}</span>
                  <p className="text-sm text-gray-600 leading-snug pt-0.5">{s}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4 border-2" style={{ background: t.bg, borderColor: t.color + '40' }}>
            <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: t.color }}>🎬 Worked Example — {t.example.title}</p>
            <p className="text-xs text-gray-500 font-semibold mb-2">{t.example.prompt}</p>
            <p className="text-sm text-nb-dark font-semibold leading-relaxed italic">"{t.example.story}"</p>
          </div>

          {t.usedIn?.length > 0 && (
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Used in these lessons</p>
              <div className="flex flex-wrap gap-1.5">
                {t.usedIn.map(l => (
                  <span key={l} className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: t.bg, color: t.color }}>{l}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {footer}
    </div>
  )
}

/* ── STUDENT ── */
function StudentView() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [draft, setDraft] = useState('')
  const [notes, setNotes] = useState([])

  if (selected) {
    return (
      <TechniqueDetail t={selected} onBack={() => { setSelected(null); setDraft('') }} footer={
        <div className="bg-white rounded-2xl border-2 border-nb-yellow p-4 sm:p-5 space-y-3">
          <p className="font-black text-nb-dark text-sm flex items-center gap-1.5">
            <img src={lightBulbIcon} alt="" className="w-5 h-5 object-contain" /> Try it yourself
          </p>
          <p className="text-xs text-gray-400">Write your own {selected.name.toLowerCase()} for something you're learning right now.</p>
          <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={3} placeholder="Type your idea here…"
            className="w-full rounded-xl border-2 border-gray-200 p-3 text-sm focus:border-nb-green focus:outline-none resize-none" />
          <button
            onClick={() => { if (!draft.trim()) return; setNotes(n => [{ id: Date.now(), techId: selected.id, text: draft.trim() }, ...n]); setDraft('') }}
            disabled={!draft.trim()}
            className="px-4 py-2 rounded-xl font-black text-sm text-nb-dark shadow disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#FFEB3C' }}>
            💾 Save to My Notes
          </button>

          {notes.filter(n => n.techId === selected.id).length > 0 && (
            <div className="pt-2 space-y-2 border-t border-gray-100">
              {notes.filter(n => n.techId === selected.id).map(n => (
                <p key={n.id} className="text-sm text-gray-600 bg-nb-cream rounded-xl p-3 leading-relaxed">📝 {n.text}</p>
              ))}
            </div>
          )}
        </div>
      } />
    )
  }

  return (
    <div className="space-y-5">
      <Header eyebrow="记忆法 · Neurobix Method" title="🧠 Memory Fundamentals" subtitle="The techniques that power every lesson — pick one to learn how it works" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {TECHNIQUES.map(t => (
          <TechniqueGridCard key={t.id} t={t} onClick={() => setSelected(t)}
            badge={<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">{t.usedIn.length} lesson{t.usedIn.length !== 1 ? 's' : ''}</span>} />
        ))}
      </div>

      {notes.length > 0 && (
        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">My Notes ({notes.length})</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {notes.map(n => {
              const t = TECHNIQUES.find(x => x.id === n.techId)
              return (
                <div key={n.id} className="bg-white rounded-2xl border-2 border-nb-olive/20 p-3.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: t.bg, color: t.color }}>{t.icon} {t.name}</span>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{n.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="rounded-2xl p-4 border-2 border-nb-green/30 flex items-start gap-3" style={{ background: '#F1F8EF' }}>
        <span className="text-xl flex-shrink-0">📚</span>
        <div>
          <p className="font-black text-nb-dark text-sm">Want to see it in a real lesson?</p>
          <p className="text-xs text-gray-500 mt-0.5">Every Neurobix lesson uses one of these techniques to help facts stick.</p>
        </div>
        <button onClick={() => navigate('/lessons')}
          className="ml-auto flex-shrink-0 text-sm font-bold text-nb-green border-2 border-nb-green/40 rounded-full px-4 py-1.5 hover:bg-nb-green hover:text-white transition whitespace-nowrap">
          Browse Lessons ›
        </button>
      </div>
    </div>
  )
}

/* ── TEACHER ── */
const TEACHER_LESSONS = ['The Solar System', 'Plants & Photosynthesis', 'The Human Body', 'Forces & Motion']

function TeacherView() {
  const [selected, setSelected] = useState(null)
  const [assignFor, setAssignFor] = useState(null)
  const [assignLesson, setAssignLesson] = useState('')
  const [toast, setToast] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [custom, setCustom] = useState([])
  const [form, setForm] = useState({ name: '', category: 'Story', tagline: '', instructions: '' })

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 3000) }

  function confirmAssign() {
    if (!assignLesson) return
    showToast(`🧠 "${assignFor.name}" attached to "${assignLesson}"`)
    setAssignFor(null); setAssignLesson('')
  }

  function createTemplate() {
    if (!form.name.trim() || !form.instructions.trim()) return
    setCustom(c => [{ id: 'custom-' + Date.now(), icon: '✨', name: form.name.trim(), color: '#f59e0b', bg: '#FEF3E2',
      tagline: form.tagline.trim() || form.category, description: form.instructions.trim(),
      steps: [form.instructions.trim()], example: { title: 'Your template', prompt: form.category, story: form.instructions.trim() },
      usedIn: [] }, ...c])
    setForm({ name: '', category: 'Story', tagline: '', instructions: '' })
    setShowCreate(false)
    showToast('✅ Custom technique template created')
  }

  if (selected) return <TechniqueDetail t={selected} onBack={() => setSelected(null)} />

  const ALL = [...custom, ...TECHNIQUES]

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <Header eyebrow="Content Library" title="🧠 Memory Fundamentals" subtitle="Assign memory techniques to your lessons or build your own" />
        <button onClick={() => setShowCreate(true)}
          className="flex-shrink-0 px-4 py-2.5 rounded-xl font-black text-sm text-nb-dark shadow hover:shadow-md transition" style={{ background: '#FFEB3C' }}>
          + Create Custom Technique
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ALL.map(t => (
          <div key={t.id} className="bg-white rounded-2xl border-2 border-nb-olive/20 overflow-hidden hover:shadow-md transition-all">
            <div className="h-1.5 w-full" style={{ background: t.color }} />
            <div className="p-4 space-y-3">
              <div onClick={() => setSelected(t)} className="cursor-pointer">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: t.bg }}>{t.icon}</div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                    {t.usedIn.length} lesson{t.usedIn.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <p className="font-black text-nb-dark text-[15px] leading-snug">{t.name}</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{t.tagline}</p>
              </div>
              <button onClick={() => setAssignFor(t)}
                className="w-full py-2 rounded-xl border-2 border-nb-green/40 text-nb-green font-black text-xs hover:bg-nb-green hover:text-white transition">
                📎 Assign to Lesson
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assign modal */}
      {assignFor && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(0,0,0,0.5)' }}
             onClick={e => e.target === e.currentTarget && setAssignFor(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-sm p-6 space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-2">{assignFor.icon}</div>
              <h3 className="text-lg font-black text-nb-dark">Assign "{assignFor.name}"</h3>
              <p className="text-xs text-gray-400 mt-1">Choose which lesson this technique should be attached to.</p>
            </div>
            <div className="space-y-1.5">
              {TEACHER_LESSONS.map(l => (
                <button key={l} onClick={() => setAssignLesson(l)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition ${
                    assignLesson === l ? 'border-nb-green text-nb-dark' : 'border-gray-200 text-gray-500 hover:border-nb-olive'}`}
                  style={assignLesson === l ? { background: '#6FC91112' } : {}}>
                  {l}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setAssignFor(null); setAssignLesson('') }} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm">Cancel</button>
              <button onClick={confirmAssign} disabled={!assignLesson}
                className="flex-1 py-3 rounded-xl font-black text-nb-dark text-sm shadow-md disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: '#FFEB3C' }}>
                Attach →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(0,0,0,0.5)' }}
             onClick={e => e.target === e.currentTarget && setShowCreate(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md p-6 space-y-4">
            <h3 className="text-lg font-black text-nb-dark">✨ New Memory Technique</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Rhyme Time"
                  className="w-full mt-1 rounded-xl border-2 border-gray-200 p-2.5 text-sm focus:border-nb-green focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full mt-1 rounded-xl border-2 border-gray-200 p-2.5 text-sm focus:border-nb-green focus:outline-none">
                  {['Story', 'Visualization', 'Association', 'Organization'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Tagline (optional)</label>
                <input value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} placeholder="Short one-line hook"
                  className="w-full mt-1 rounded-xl border-2 border-gray-200 p-2.5 text-sm focus:border-nb-green focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Instructions</label>
                <textarea value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} rows={3} placeholder="How should students use this technique?"
                  className="w-full mt-1 rounded-xl border-2 border-gray-200 p-2.5 text-sm focus:border-nb-green focus:outline-none resize-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm">Cancel</button>
              <button onClick={createTemplate} disabled={!form.name.trim() || !form.instructions.trim()}
                className="flex-1 py-3 rounded-xl font-black text-nb-dark text-sm shadow-md disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: '#FFEB3C' }}>
                Create →
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-nb-dark text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-sm whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  )
}

/* ── PARENT ── */
function ParentView({ studentName = 'your child' }) {
  const [open, setOpen] = useState(null)
  const LAST_PRACTICED = { story: '2026-07-18', palace: '2026-07-12', peg: '2026-07-15', acronym: '2026-07-18', chunking: '2026-07-12', visualization: '2026-07-08' }

  return (
    <div className="space-y-5">
      <Header eyebrow="Neurobix Method" title="🧠 Memory Fundamentals" subtitle={`What ${studentName} is learning — and how you can help at home`} />

      <div className="space-y-3">
        {TECHNIQUES.map(t => {
          const isOpen = open === t.id
          return (
            <div key={t.id} className="bg-white rounded-2xl border-2 border-nb-olive/20 overflow-hidden">
              <div className="h-1 w-full" style={{ background: t.color }} />
              <div className="p-4 cursor-pointer" onClick={() => setOpen(isOpen ? null : t.id)}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: t.bg }}>{t.icon}</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-nb-dark text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {t.usedIn.length > 0
                        ? <>Practised in <strong className="text-gray-500">{t.usedIn.join(', ')}</strong> · last on {LAST_PRACTICED[t.id]}</>
                        : 'Not yet introduced'}
                    </p>
                  </div>
                  <span className="text-gray-300 text-lg flex-shrink-0">{isOpen ? '▾' : '›'}</span>
                </div>
              </div>
              {isOpen && (
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-sm text-gray-500 leading-relaxed">{t.description}</p>
                  <div className="rounded-xl p-3 border-2 flex items-start gap-2.5" style={{ background: t.bg, borderColor: t.color + '40' }}>
                    <img src={lightBulbIcon} alt="" className="w-5 h-5 object-contain flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: t.color }}>How to support at home</p>
                      <p className="text-sm text-nb-dark leading-relaxed">{t.parentTip}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── ADMIN ── */
function AdminView() {
  const [active, setActive] = useState(() => Object.fromEntries(TECHNIQUES.map(t => [t.id, true])))
  const totalLessons = new Set(TECHNIQUES.flatMap(t => t.usedIn)).size
  const mostUsed = [...TECHNIQUES].sort((a, b) => b.stats.students - a.stats.students)[0]
  const avgEngagement = Math.round(TECHNIQUES.reduce((s, t) => s + t.stats.engagement, 0) / TECHNIQUES.length)

  return (
    <div className="space-y-5">
      <Header eyebrow="Library & Analytics" title="🧠 Memory Fundamentals" subtitle="Manage and monitor memory-technique content across all classes" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Techniques', value: TECHNIQUES.length, icon: '🧠' },
          { label: 'Lessons Covered', value: totalLessons, icon: '📚' },
          { label: 'Most Used', value: mostUsed.name, icon: mostUsed.icon, small: true },
          { label: 'Avg. Engagement', value: `${avgEngagement}%`, icon: '📈' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border-2 border-nb-olive/20 p-4">
            <span className="text-xl">{s.icon}</span>
            <p className={`font-black text-nb-dark mt-1 ${s.small ? 'text-sm' : 'text-xl'}`}>{s.value}</p>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2.5">
        {TECHNIQUES.map(t => (
          <div key={t.id} className="bg-white rounded-2xl border-2 border-nb-olive/20 p-4 flex items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: t.bg }}>{t.icon}</div>
            <div className="min-w-[140px] flex-shrink-0">
              <p className="font-black text-nb-dark text-sm">{t.name}</p>
              <p className="text-xs text-gray-400">{t.usedIn.length} lesson{t.usedIn.length !== 1 ? 's' : ''} · {t.stats.students} students</p>
            </div>
            <div className="flex-1 min-w-[120px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Engagement</span>
                <span className="text-xs font-bold" style={{ color: t.color }}>{t.stats.engagement}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${t.stats.engagement}%`, background: t.color }} />
              </div>
            </div>
            <button onClick={() => setActive(a => ({ ...a, [t.id]: !a[t.id] }))}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-black border-2 transition ${
                active[t.id] ? 'border-nb-green text-nb-green' : 'border-gray-200 text-gray-400'}`}>
              {active[t.id] ? '✓ Active' : 'Inactive'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MemoryFundamentals({ role, studentName }) {
  if (role === 'teacher') return <TeacherView />
  if (role === 'parent') return <ParentView studentName={studentName} />
  if (role === 'admin') return <AdminView />
  return <StudentView />
}
