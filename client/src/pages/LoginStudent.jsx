import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoFull from '../assets/Asset 1@3x.png'
import BrainBackground from '../components/BrainBackground'

const DEMO = { email: 'student@neurobix.com', password: 'demo123', path: '/student' }

export default function LoginStudent() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [shake, setShake]       = useState(false)

  function handleLogin(e) {
    e.preventDefault()
    if (email === DEMO.email && password === DEMO.password) {
      navigate(DEMO.path)
    } else {
      setError('Oops! Wrong email or password. Try again!')
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  function fillDemo() {
    setEmail(DEMO.email)
    setPassword(DEMO.password)
    setError('')
  }

  return (
    <BrainBackground>
      {/* Back to role selection */}
      <button
        onClick={() => navigate('/login')}
        className="absolute top-5 left-5 flex items-center gap-1.5 text-sm font-bold text-nb-dark/50 hover:text-nb-green transition"
      >
        ← Back
      </button>

      {/* Logo + heading */}
      <img src={logoFull} alt="Neurobix Method" className="h-8 sm:h-10 object-contain mb-5" />
      <h1 className="text-4xl sm:text-6xl font-bold text-nb-dark text-center tracking-tight mb-8 sm:mb-10">
        Hello Student
      </h1>

      {/* Form card */}
      <div className={`w-full max-w-xl bg-white rounded-[2rem] shadow-xl p-7 sm:p-10 ${shake ? 'animate-[wiggle_0.4s_ease]' : ''}`}>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-base font-bold text-nb-dark mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              className="w-full rounded-full border-2 border-nb-green bg-white px-5 py-3 text-nb-dark outline-none focus:ring-2 focus:ring-nb-lime/60 transition"
              required
            />
          </div>

          <div>
            <label className="block text-base font-bold text-nb-dark mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              className="w-full rounded-full border-2 border-nb-green bg-white px-5 py-3 text-nb-dark outline-none focus:ring-2 focus:ring-nb-lime/60 transition"
              required
            />
          </div>

          {error && (
            <p className="text-center text-sm font-semibold text-red-600">{error}</p>
          )}

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="px-12 py-3 rounded-full bg-nb-green text-white font-bold text-lg shadow-[0_5px_0_rgba(42,77,40,0.4)] hover:bg-nb-dark active:translate-y-0.5 active:shadow-[0_2px_0_rgba(42,77,40,0.4)] transition-all"
            >
              Let's Go!
            </button>
          </div>
        </form>
      </div>

      {/* Demo quick-fill (dev convenience) */}
      <button
        onClick={fillDemo}
        className="mt-5 text-sm font-semibold text-nb-green/70 hover:text-nb-green underline underline-offset-2 transition"
      >
        Use demo student account
      </button>
    </BrainBackground>
  )
}
