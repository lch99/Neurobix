import { useState } from 'react'
import Navbar from '../components/Navbar'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.4)' }}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-nb-dark">Add New User</h2>
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
      <Navbar role="admin" userName="Admin" />

      {/* Sub-tabs */}
      <div className="bg-white border-b-2 border-nb-olive/20 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto py-2">
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'users',    label: '👥 Users' },
            { id: 'classes',  label: '🏫 Classes' },
            { id: 'reports',  label: '📈 Reports' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-black whitespace-nowrap transition-all ${tab === t.id ? 'text-white' : 'text-gray-500 hover:bg-nb-cream'}`}
              style={tab === t.id ? { background: '#396336' } : {}}>
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
                { label: 'Total Users',    value: 132,  icon: '👥',  bg: 'bg-blue-50',   text: 'text-blue-700' },
                { label: 'Students',       value: 98,   icon: '🎓',  bg: 'bg-green-50',  text: 'text-nb-green' },
                { label: 'Teachers',       value: 12,   icon: '👩‍🏫', bg: 'bg-nb-cream',  text: 'text-nb-dark' },
                { label: 'Active Classes', value: 18,   icon: '🏫',  bg: 'bg-amber-50',  text: 'text-amber-700' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-nb-olive/20`}>
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className={`text-4xl font-black ${s.text}`}>{s.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Activity */}
            <div className="bg-white rounded-2xl border border-nb-olive/20 p-5">
              <h3 className="font-black text-nb-dark mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { icon: '👤', text: 'New student registered: Ahmad bin Hassan', time: '2 min ago', color: 'text-blue-600' },
                  { icon: '📚', text: 'Lesson published: Addition & Subtraction', time: '15 min ago', color: 'text-nb-green' },
                  { icon: '🏆', text: 'Certificate issued to Hafiz Zulkifli', time: '1 hr ago', color: 'text-amber-600' },
                  { icon: '⚠️', text: 'Student Raj Kumar suspended', time: '3 hrs ago', color: 'text-red-500' },
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
          </>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-xl font-black text-nb-dark">User Management</h2>
              <div className="flex gap-3 flex-wrap">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…"
                  className="px-4 py-2 rounded-xl border-2 border-nb-olive/20 text-sm focus:outline-none focus:border-nb-green bg-white" />
                <button onClick={() => setShowModal(true)}
                  className="px-4 py-2 text-white text-sm font-black rounded-xl shadow hover:opacity-90 transition"
                  style={{ background: '#396336' }}>+ Add User</button>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-nb-olive/20 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-nb-cream border-b border-nb-olive/20">
                  <tr>{['Name','Email','Role','Status','Joined',''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-gray-500 font-black text-xs uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-nb-olive/10">
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-nb-dark">All Classes</h2>
              <button className="px-4 py-2 text-white text-sm font-black rounded-xl shadow hover:opacity-90 transition"
                      style={{ background: '#396336' }}>+ New Class</button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <p className="text-xs text-gray-400 mb-3">👩‍🏫 {c.teacher} · 👩‍🎓 {c.students} students</p>
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
          <div className="space-y-4">
            <h2 className="text-xl font-black text-nb-dark">Reports</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title:'Student Progress Report',   desc:'Overview of all student completion rates and scores',       icon:'📊' },
                { title:'Lesson Engagement Report',  desc:'Which lessons are most accessed and completed',              icon:'📚' },
                { title:'Quiz Performance Report',   desc:'Average scores and pass/fail rates per quiz',               icon:'📝' },
                { title:'Certificate Report',        desc:'All issued certificates and completion dates',              icon:'🏆' },
                { title:'Memory Method Analytics',   desc:'How students engage with Neurobix memory techniques',       icon:'🧠' },
                { title:'Parent Visibility Report',  desc:'Summary reports formatted for parent communication',        icon:'👨‍👩‍👧' },
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
