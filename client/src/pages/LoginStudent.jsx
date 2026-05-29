import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoSquare from '../assets/NM_Square.png'

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
      setError('Oops! Wrong email or password. Try again! 😅')
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
    <div className="h-screen flex flex-col items-center justify-center overflow-hidden px-4"
         style={{ background: 'linear-gradient(160deg,#FFF7E9 0%,#ffffff 50%,#f0fdf4 100%)' }}>

      {/* Back */}
      <button onClick={() => navigate('/login')}
        className="absolute top-5 left-5 flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-nb-green transition">
        ← Back
      </button>

      {/* Card */}
      <div className={`w-full max-w-sm bg-white rounded-3xl shadow-2xl border-2 border-nb-olive/20 p-8 transition-all ${shake ? 'animate-[wiggle_0.4s_ease]' : ''}`}
           style={{ boxShadow: '0 20px 60px #6FC91125' }}>

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <img src={logoSquare} alt="Neurobix Method" className="w-16 h-16 object-contain mb-3" />
          <h1 className="text-2xl font-black text-nb-dark text-center">Hello, Student! 👋</h1>
          <p className="text-gray-400 text-sm mt-1 text-center">Sign in to start learning 🚀</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl text-center text-sm font-bold"
               style={{ background: '#fee2e2', color: '#dc2626' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-black text-nb-dark mb-1.5">Your Email</label>
            <input
              type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-base transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-black text-nb-dark mb-1.5">Your Password</label>
            <input
              type="password" value={password} onChange={e => { setPassword(e.target.value); setError('') }}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:outline-none focus:border-nb-green bg-nb-cream text-base transition"
              required
            />
          </div>

          <button type="submit"
            className="w-full py-4 rounded-2xl font-black text-nb-dark text-lg shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg,#FFEB3C,#6FC911)' }}>
            Let's Go! 🚀
          </button>
        </form>

        {/* Demo quick-fill */}
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 mb-2">Demo mode</p>
          <button onClick={fillDemo}
            className="px-5 py-2 rounded-xl text-sm font-black text-nb-dark border-2 border-nb-yellow hover:scale-105 transition-all"
            style={{ background: '#FFEB3C22' }}>
            🎓 Fill Demo Student Account
          </button>
        </div>
      </div>

      {/* Decorative blobs */}
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
           style={{ background: '#6FC911', filter: 'blur(60px)', transform: 'translate(-30%,30%)' }} />
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
           style={{ background: '#FFEB3C', filter: 'blur(60px)', transform: 'translate(30%,-30%)' }} />
    </div>
  )
}
