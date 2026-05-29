import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoSquare from '../assets/NM_Square.png'
import logoWhite from '../assets/Asset 1@3x 1_White.png'

const DEMO_ACCOUNTS = [
  { role: 'parent',  label: '👨‍👩‍👧 Parent',  email: 'parent@neurobix.com',  password: 'demo123', path: '/parent',  style: 'bg-nb-olive text-white border-nb-olive' },
  { role: 'teacher', label: '👩‍🏫 Teacher', email: 'teacher@neurobix.com', password: 'demo123', path: '/teacher', style: 'bg-nb-green text-white border-nb-green' },
  { role: 'admin',   label: '🔐 Admin',   email: 'admin@neurobix.com',   password: 'demo123', path: '/admin',   style: 'bg-nb-dark text-white border-nb-dark' },
]

export default function LoginStaff() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')

  function fillDemo(account) {
    setEmail(account.email)
    setPassword(account.password)
    setError('')
  }

  function handleLogin(e) {
    e.preventDefault()
    const match = DEMO_ACCOUNTS.find(a => a.email === email && a.password === password)
    if (match) navigate(match.path)
    else setError('Invalid credentials. Use a demo account below.')
  }

  return (
    <div className="h-screen flex overflow-hidden">

      {/* ── Left panel ── */}
      <div className="hidden md:flex md:w-5/12 flex-col justify-between p-10 relative overflow-hidden"
           style={{ background: 'linear-gradient(150deg,#6FC911 0%,#36913F 50%,#396336 100%)' }}>
        <img src={logoWhite} alt=""
             className="absolute -bottom-6 -right-6 w-72 opacity-10 pointer-events-none select-none" />

        {/* Logo */}
        <img src={logoSquare} alt="Neurobix Method"
             className="w-16 h-16 object-contain rounded-2xl shadow-lg bg-white p-1" />

        {/* Tagline */}
        <div className="relative">
          <h2 className="text-3xl font-black text-white leading-snug">
            Welcome back,<br />Educator. 👋
          </h2>
          <p className="text-green-100 text-sm mt-3 leading-relaxed max-w-xs">
            Manage your classes, track student progress and deliver memory-based learning — all in one place.
          </p>
          {/* Role pills */}
          <div className="flex flex-wrap gap-2 mt-5">
            {['👨‍👩‍👧 Parent', '👩‍🏫 Teacher', '🔐 Admin'].map(r => (
              <span key={r} className="bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">{r}</span>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="relative text-green-200 text-xs space-y-0.5">
          <p className="font-black text-white text-sm">Neurobix Method Pte Ltd</p>
          <p>6 Raffles Boulevard Rd, #02-34/35</p>
          <p>Singapore 039594</p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="w-full md:w-7/12 flex flex-col justify-center px-8 sm:px-14 bg-white relative">

        {/* Back button */}
        <button onClick={() => navigate('/login')}
          className="absolute top-5 left-6 flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-nb-green transition">
          ← Back
        </button>

        {/* Mobile logo */}
        <div className="flex md:hidden justify-center mb-6">
          <img src={logoSquare} alt="Neurobix Method" className="w-16 h-16 object-contain" />
        </div>

        <div className="w-full max-w-sm mx-auto">
          <h2 className="text-2xl font-black text-nb-dark">Sign In</h2>
          <p className="text-gray-400 text-sm mt-1 mb-6">Parent · Teacher · Admin portal</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="you@neurobix.com"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password" value={password} onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm transition"
                required
              />
            </div>
            <button type="submit"
              className="w-full py-3 rounded-xl font-black text-nb-dark shadow-md transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] text-sm"
              style={{ background: 'linear-gradient(135deg,#FFEB3C,#6FC911)' }}>
              Sign In →
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2.5 text-center">
              Quick Demo Login
            </p>
            <div className="flex flex-col gap-2">
              {DEMO_ACCOUNTS.map(a => (
                <button key={a.role} onClick={() => fillDemo(a)}
                  className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold border-2 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 ${a.style}`}>
                  {a.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-2 text-center">
              Select a role to auto-fill, then click Sign In
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
