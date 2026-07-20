import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoSquare from '../assets/NM_Square.png'
import logoWhite from '../assets/Asset 1@3x 1_White.png'
import { useAuth } from '../context/AuthContext'
import { findAuthRecord, resetCredential, setMustChangeCredential } from '../data/mockDb'
import ServerStatusBadge from '../components/ServerStatusBadge'

function genTempPassword() {
  return Math.random().toString(36).slice(-4) + Math.floor(10 + Math.random() * 90)
}

const DEMO_ACCOUNTS = [
  { role: 'parent',  label: '👨‍👩‍👧 Parent',  email: 'parent1@neurobix.com',  password: 'password123', path: '/parent',  style: 'bg-nb-olive text-white border-nb-olive' },
  { role: 'teacher', label: '👩‍🏫 Teacher', email: 'sarah.tan@neurobix.com', password: 'password123', path: '/teacher', style: 'bg-nb-green text-white border-nb-green' },
  { role: 'admin',   label: '🔐 Admin',   email: 'admin@neurobix.com',   password: 'password123', path: '/admin',   style: 'bg-nb-dark text-white border-nb-dark' },
]

const ROLE_PATH = { admin: '/admin', teacher: '/teacher', parent: '/parent' }

export default function LoginStaff() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [mode, setMode]         = useState('login') // 'login' | 'forgot' | 'sent'
  const [resetEmail, setResetEmail] = useState('')
  const [tempPassword, setTempPassword] = useState('')

  function fillDemo(account) {
    setEmail(account.email)
    setPassword(account.password)
    setError('')
  }

  async function handleLogin(e) {
    e.preventDefault()
    try {
      const user = await login(email, password)
      const path = ROLE_PATH[user.role]
      if (!path) throw new Error('This account is not a staff/parent account.')
      navigate(path)
    } catch (err) {
      setError(err.message || 'Invalid credentials.')
    }
  }

  function handleResetRequest(e) {
    e.preventDefault()
    if (findAuthRecord(resetEmail)) {
      const temp = genTempPassword()
      resetCredential(resetEmail, temp)
      setMustChangeCredential(resetEmail, true)
      setTempPassword(temp)
    } else {
      setTempPassword('')
    }
    setMode('sent')
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
          {mode === 'login' && (
            <>
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
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider">Password</label>
                    <button type="button" onClick={() => { setMode('forgot'); setResetEmail(email); setError('') }}
                      className="text-xs font-bold text-nb-green hover:text-nb-dark transition">Forgot password?</button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError('') }}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm transition"
                      required
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-nb-green transition text-base select-none">
                      {showPw ? '🙈' : '👁️'}
                    </button>
                  </div>
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
            </>
          )}

          {mode === 'forgot' && (
            <>
              <h2 className="text-2xl font-black text-nb-dark">Reset Password</h2>
              <p className="text-gray-400 text-sm mt-1 mb-6">Enter your account email and we'll send you a reset link.</p>
              <form onSubmit={handleResetRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)}
                    placeholder="you@neurobix.com"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-sm transition"
                    required
                  />
                </div>
                <button type="submit"
                  className="w-full py-3 rounded-xl font-black text-nb-dark shadow-md transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] text-sm"
                  style={{ background: 'linear-gradient(135deg,#FFEB3C,#6FC911)' }}>
                  Send Reset Link →
                </button>
                <button type="button" onClick={() => setMode('login')}
                  className="w-full py-2 text-sm font-bold text-gray-400 hover:text-nb-green transition">
                  ← Back to Sign In
                </button>
              </form>
            </>
          )}

          {mode === 'sent' && (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">📬</div>
              <h2 className="text-xl font-black text-nb-dark">Check your email</h2>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                If an account exists for <strong className="text-nb-dark">{resetEmail}</strong>, a password reset is on its way.
              </p>
              {tempPassword && (
                <div className="mt-5 p-4 rounded-2xl border-2 border-nb-yellow text-left" style={{ background: '#FFF7E9' }}>
                  <p className="text-[11px] font-black text-amber-600 uppercase tracking-widest mb-1.5">🧪 Demo mode — no email server</p>
                  <p className="text-xs text-gray-500 mb-2">This build doesn't send real emails, so here's the temporary password that was normally emailed:</p>
                  <p className="font-mono font-black text-nb-dark text-lg text-center bg-white rounded-xl py-2 border border-nb-olive/20">{tempPassword}</p>
                  <p className="text-xs text-gray-400 mt-2">You'll be asked to set a new password on next sign-in.</p>
                </div>
              )}
              <button onClick={() => setMode('login')}
                className="mt-6 px-6 py-2.5 rounded-xl font-black text-nb-dark text-sm shadow-md"
                style={{ background: '#FFEB3C' }}>
                ← Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
      <ServerStatusBadge />
    </div>
  )
}
