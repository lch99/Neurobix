import { useState } from 'react'
import Navbar from '../components/Navbar'
import { teacherIcon, parentIcon, bookIcon, medalIcon, overdueIcon, brainIcon } from '../assets/icons'

function AddUserModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'student', password: '' })
  const [error, setError] = useState('')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setError('') }

  function submit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Please fill in all fields.')
      return
    }
    onAdd({ ...form, id: Date.now(), status: 'active', joined: new Date().toISOString().slice(0, 10) })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
         style={{ background: 'rgba(0,0,0,0.4)' }}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md p-5 sm:p-7 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-black text-nb-dark">Add New User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {error && <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="e.g. Ahmad bin Hassan"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="user@neurobix.com"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Role</label>
            <select value={form.role} onChange={e => set('role', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm">
              <option value="student">🎓 Student</option>
              <option value="teacher">👩‍🏫 Teacher</option>
              <option value="parent">👨‍👩‍👧 Parent</option>
              <option value="admin">🔐 Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Temporary Password</label>
            <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
              placeholder="Set a temporary password"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-gray-300 transition">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3 rounded-xl font-black text-nb-dark text-sm shadow-md transition hover:shadow-lg"
              style={{ background: '#FFEB3C' }}>
              Create User →
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const CRITERIA_TYPES = {
  points_total:       { label: 'Total Points',       icon: '⭐', unit: 'pts',     format: v => `${Number(v).toLocaleString()} pts earned` },
  lessons_completed:  { label: 'Lessons Completed',   icon: '📚', unit: 'lessons', format: v => `${v} lesson${v === 1 ? '' : 's'} completed` },
  quizzes_completed:  { label: 'Quizzes Completed',   icon: '📝', unit: 'quizzes', format: v => `${v} quiz${v === 1 ? '' : 'zes'} completed` },
  perfect_score:      { label: 'Perfect Quiz Scores', icon: '💯', unit: 'times',   format: v => `${v}× perfect quiz score` },
  streak_days:        { label: 'Day Streak',          icon: '🔥', unit: 'days',    format: v => `${v}-day streak` },
}

const BADGE_ICON_CHOICES = ['⭐','🏆','🔥','🧠','📚','🚀','💯','🎯','🥇','🎖️','🏅','🌟']

function BadgeModal({ badge, onClose, onSave }) {
  const isEdit = !!badge
  const [form, setForm] = useState(badge
    ? { icon: badge.icon, name: badge.name, description: badge.description, criteriaType: badge.criteriaType, criteriaValue: badge.criteriaValue }
    : { icon: '⭐', name: '', description: '', criteriaType: 'points_total', criteriaValue: 100 })
  const [error, setError] = useState('')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setError('') }

  function submit(e) {
    e.preventDefault()
    if (!form.icon.trim() || !form.name.trim() || !form.description.trim() || !form.criteriaValue) {
      setError('Please fill in all fields.')
      return
    }
    onSave({ ...form, criteriaValue: Number(form.criteriaValue) })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
         style={{ background: 'rgba(0,0,0,0.4)' }}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md p-5 sm:p-7 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-black text-nb-dark">{isEdit ? 'Edit Badge' : 'Create New Badge'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {error && <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Icon</label>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-nb-cream border-2 border-gray-100 flex-shrink-0">{form.icon}</div>
              <input value={form.icon} onChange={e => set('icon', e.target.value)} maxLength={2}
                placeholder="Pick or paste an emoji"
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {BADGE_ICON_CHOICES.map(ic => (
                <button type="button" key={ic} onClick={() => set('icon', ic)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-base border-2 transition ${form.icon === ic ? 'border-nb-green bg-nb-cream' : 'border-gray-100 hover:border-gray-200'}`}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Badge Name</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="e.g. Memory Master"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
            <input value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="e.g. Earn 1,000 total points"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Criteria</label>
              <select value={form.criteriaType} onChange={e => set('criteriaType', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm">
                {Object.entries(CRITERIA_TYPES).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5">Target ({CRITERIA_TYPES[form.criteriaType].unit})</label>
              <input type="number" min="1" value={form.criteriaValue} onChange={e => set('criteriaValue', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-gray-300 transition">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3 rounded-xl font-black text-nb-dark text-sm shadow-md transition hover:shadow-lg"
              style={{ background: '#FFEB3C' }}>
              {isEdit ? 'Save Changes' : 'Create Badge →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const USERS = [
  { id: 1, name: 'Ms Sarah Tan',       email: 'teacher@neurobix.com', role: 'teacher', status: 'active',    joined: '2024-08-01' },
  { id: 2, name: 'Ahmad bin Hassan',  email: 'student@neurobix.com', role: 'student', status: 'active',    joined: '2024-09-05' },
  { id: 3, name: 'Siti Nur Aisyah',  email: 'siti@neurobix.com',    role: 'student', status: 'active',    joined: '2024-09-05' },
  { id: 4, name: 'Raj Kumar',         email: 'raj@neurobix.com',     role: 'student', status: 'suspended', joined: '2024-09-10' },
  { id: 5, name: 'Mr Alif Ibrahim',        email: 'alif@neurobix.com',    role: 'teacher', status: 'active',    joined: '2024-08-01' },
]

const ROLE_BADGE = {
  admin:   'bg-nb-dark text-white',
  teacher: 'bg-nb-green text-white',
  student: 'text-nb-dark',
  parent:  'bg-nb-olive text-white',
}

export default function AdminDashboard() {
  const [tab, setTab]       = useState('overview')
  const [search, setSearch] = useState('')
  const [users, setUsers]   = useState(USERS)
  const [showModal, setShowModal] = useState(false)

  function handleAddUser(newUser) {
    setUsers(u => [newUser, ...u])
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-nb-cream">
      {showModal && <AddUserModal onClose={() => setShowModal(false)} onAdd={handleAddUser} />}
      <Navbar role="admin" userName="Admin">
        <div className="max-w-7xl mx-auto px-2 flex gap-1 overflow-x-auto py-2 scrollbar-hide">
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'users',    label: '👥 Users' },
            { id: 'classes',  label: '🏫 Classes' },
            { id: 'reports',  label: '📈 Reports' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-black whitespace-nowrap transition-all flex-shrink-0 border-b-2 ${
                tab === t.id
                  ? 'text-white border-nb-lime'
                  : 'text-gray-500 hover:bg-nb-cream border-transparent'
              }`}
              style={tab === t.id ? { background: '#396336' } : {}}>
              {t.label}
            </button>
          ))}
        </div>
      </Navbar>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="tab-panel space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Users',    value: 132,  icon: '👥',  bg: 'bg-blue-50',   text: 'text-blue-700' },
                { label: 'Students',       value: 98,   icon: '🎓',  bg: 'bg-green-50',  text: 'text-nb-green' },
                { label: 'Teachers',       value: 12,   icon: <img src={teacherIcon} alt="" className="w-7 h-7 object-contain" />, bg: 'bg-nb-cream',  text: 'text-nb-dark' },
                { label: 'Active Classes', value: 18,   icon: '🏫',  bg: 'bg-amber-50',  text: 'text-amber-700' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-nb-olive/20`}>
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className={`text-2xl sm:text-4xl font-black ${s.text}`}>{s.value}</div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Activity */}
            <div className="bg-white rounded-2xl border border-nb-olive/20 p-5">
              <h3 className="font-black text-nb-dark mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { icon: '👤', text: 'New student registered: Ahmad bin Hassan', time: '2 min ago', color: 'text-blue-600' },
                  { icon: <img src={bookIcon} alt="" className="w-5 h-5 object-contain" />, text: 'Lesson published: Addition & Subtraction', time: '15 min ago', color: 'text-nb-green' },
                  { icon: <img src={medalIcon} alt="" className="w-5 h-5 object-contain" />, text: 'Certificate issued to Hafiz Zulkifli', time: '1 hr ago', color: 'text-amber-600' },
                  { icon: <img src={overdueIcon} alt="" className="w-5 h-5 object-contain" />, text: 'Student Raj Kumar suspended', time: '3 hrs ago', color: 'text-red-500' },
                  { icon: '📝', text: 'New quiz created: Fractions Basics', time: '5 hrs ago', color: 'text-purple-600' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className={`text-lg flex-shrink-0 ${item.color}`}>{item.icon}</span>
                    <span className="text-gray-700 flex-1">{item.text}</span>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-nb-olive/20 p-5">
                <h3 className="font-black text-nb-dark mb-4">Lessons by Type</h3>
                {[
                  { label: 'Video',       count: 24, color: '#3b82f6',  icon: '🎬' },
                  { label: 'Flash Cards', count: 18, color: '#36913F',  icon: '🃏' },
                  { label: 'Quiz',        count: 15, color: '#FFEB3C',  icon: '📝' },
                  { label: 'Reading',     count: 10, color: '#91BA4F',  icon: '📄' },
                  { label: 'Activity',    count: 5,  color: '#ec4899',  icon: '🎨' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 mb-3">
                    <span className="text-base w-6">{item.icon}</span>
                    <span className="text-sm text-gray-500 w-24">{item.label}</span>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(item.count / 72) * 100}%`, background: item.color }} />
                    </div>
                    <span className="text-sm font-black text-gray-700">{item.count}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-nb-olive/20 p-5">
                <h3 className="font-black text-nb-dark mb-4">Certificates This Week</h3>
                <div className="flex items-end gap-2 h-28 mt-4">
                  {[3,5,4,8,6,9,12].map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-sm" style={{ height: `${(v/12)*90}px`, background: 'linear-gradient(180deg,#6FC911,#396336)' }} />
                      <span className="text-[10px] text-gray-400">{['M','T','W','T','F','S','S'][i]}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-3 text-center">Total: <span className="font-black" style={{ color: '#36913F' }}>47</span> certificates</p>
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div className="tab-panel space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-black text-nb-dark">User Management</h2>
              <button onClick={() => setShowModal(true)}
                className="px-3 sm:px-4 py-2 text-white text-xs sm:text-sm font-black rounded-xl shadow hover:opacity-90 transition whitespace-nowrap flex-shrink-0"
                style={{ background: '#396336' }}>+ Add User</button>
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…"
              className="w-full px-4 py-2 rounded-xl border-2 border-nb-olive/20 text-sm focus:outline-none focus:border-nb-green bg-white" />
            {/* Mobile card list */}
            <div className="space-y-2 sm:hidden">
              {filtered.length === 0 && (
                <div className="bg-white rounded-2xl border border-nb-olive/20 py-10 flex flex-col items-center gap-2 text-center">
                  <span className="text-4xl">🔍</span>
                  <p className="font-black text-nb-dark">No users found</p>
                  <p className="text-sm text-gray-400">Try a different name or email</p>
                </div>
              )}
              {filtered.map(u => (
                <div key={u.id} className="bg-white rounded-2xl border border-nb-olive/20 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${ROLE_BADGE[u.role]}`}
                         style={u.role === 'student' ? { background: '#FFEB3C' } : {}}>
                      {u.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-nb-dark text-sm truncate">{u.name}</p>
                      <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button className="text-xs font-bold" style={{ color: '#36913F' }}>Edit</button>
                      <button className="text-xs font-bold text-red-400">Del</button>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-black capitalize ${ROLE_BADGE[u.role]}`}
                          style={u.role === 'student' ? { background: '#FFEB3C' } : {}}>
                      {u.role}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {u.status}
                    </span>
                    <span className="text-xs text-gray-400">{u.joined}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Table on sm+ */}
            <div className="hidden sm:block bg-white rounded-2xl border border-nb-olive/20 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-nb-cream border-b border-nb-olive/20">
                  <tr>{['Name','Email','Role','Status','Joined',''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-gray-500 font-black text-xs uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-nb-olive/10">
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <span className="text-4xl block mb-2">🔍</span>
                        <p className="font-black text-nb-dark">No users found</p>
                        <p className="text-sm text-gray-400 mt-1">Try a different name or email</p>
                      </td>
                    </tr>
                  )}
                  {filtered.map(u => (
                    <tr key={u.id} className="hover:bg-nb-cream/50 transition">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${ROLE_BADGE[u.role]}`}
                               style={u.role === 'student' ? { background: '#FFEB3C' } : {}}>
                            {u.name[0]}
                          </div>
                          <span className="font-bold text-nb-dark">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-black capitalize ${ROLE_BADGE[u.role]}`}
                              style={u.role === 'student' ? { background: '#FFEB3C' } : {}}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs">{u.joined}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-3 justify-end">
                          <button className="text-xs font-bold hover:text-nb-dark" style={{ color: '#36913F' }}>Edit</button>
                          <button className="text-xs font-bold text-red-400 hover:text-red-600">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CLASSES */}
        {tab === 'classes' && (
          <div className="tab-panel space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-black text-nb-dark">All Classes</h2>
              <button className="px-3 sm:px-4 py-2 text-white text-xs sm:text-sm font-black rounded-xl shadow hover:opacity-90 transition"
                      style={{ background: '#396336' }}>+ New Class</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name:'Primary 4A', subject:'Mathematics', teacher:'Ms Sarah Tan', students:28, progress:67 },
                { name:'Primary 4B', subject:'Mathematics', teacher:'Ms Sarah Tan', students:25, progress:50 },
                { name:'Primary 5A', subject:'Science',     teacher:'Mr Alif Ibrahim',  students:30, progress:80 },
                { name:'Primary 5B', subject:'Science',     teacher:'Mr Alif Ibrahim',  students:27, progress:35 },
                { name:'Primary 6A', subject:'English',     teacher:'Ms Maria Wong', students:22, progress:90 },
              ].map((c, i) => (
                <div key={i} className="bg-white rounded-2xl border border-nb-olive/20 p-5 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-black text-nb-dark">{c.name}</h3>
                      <p className="text-sm text-gray-500">{c.subject}</p>
                    </div>
                    <span className="text-xs font-black px-2.5 py-1 rounded-full text-nb-dark" style={{ background: '#FFEB3C' }}>{c.progress}%</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3 flex items-center gap-1 flex-wrap">
                    <img src={teacherIcon} alt="" className="w-3.5 h-3.5 object-contain" /> {c.teacher} · 👩‍🎓 {c.students} students
                  </p>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width:`${c.progress}%`, background:'linear-gradient(90deg,#6FC911,#396336)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORTS */}
        {tab === 'reports' && (
          <div className="tab-panel space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-nb-dark">Reports</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title:'Student Progress Report',   desc:'Overview of all student completion rates and scores',       icon:'📊' },
                { title:'Lesson Engagement Report',  desc:'Which lessons are most accessed and completed',              icon: <img src={bookIcon} alt="" className="w-10 h-10 object-contain" /> },
                { title:'Quiz Performance Report',   desc:'Average scores and pass/fail rates per quiz',               icon:'📝' },
                { title:'Certificate Report',        desc:'All issued certificates and completion dates',              icon: <img src={medalIcon} alt="" className="w-10 h-10 object-contain" /> },
                { title:'Memory Method Analytics',   desc:'How students engage with Neurobix memory techniques',       icon: <img src={brainIcon} alt="" className="w-10 h-10 object-contain" /> },
                { title:'Parent Visibility Report',  desc:'Summary reports formatted for parent communication',        icon: <div className="w-10 h-10 p-1.5 rounded-xl bg-nb-cream flex items-center justify-center"><img src={parentIcon} alt="" className="w-full h-full object-contain" /></div> },
              ].map((r, i) => (
                <div key={i} className="bg-white rounded-2xl border border-nb-olive/20 p-5 flex items-start gap-4 hover:shadow-md transition cursor-pointer">
                  <div className="text-4xl">{r.icon}</div>
                  <div>
                    <h3 className="font-black text-nb-dark">{r.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{r.desc}</p>
                    <button className="text-xs font-black mt-2 hover:text-nb-dark transition" style={{ color: '#36913F' }}>Download PDF →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-nb-olive/20 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-400 space-y-1">
          <p className="font-black text-nb-dark">Neurobix Method Pte Ltd</p>
          <p>6 Raffles Boulevard Rd, #02-34/35, Singapore 039594</p>
          <p>© 2025 All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
