import { useState } from 'react'
import { logo as logoFull } from '../assets/icons'
import BrainBackground from './BrainBackground'
import PinInput from './PinInput'
import { useAuth } from '../context/AuthContext'

export default function ForceCredentialChange() {
  const { user, completeCredentialChange, logout } = useAuth()
  const isStudent = user.role === 'student'
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    const label = isStudent ? 'PIN' : 'password'
    if (isStudent && a.length !== 4) { setError('Your PIN needs to be 4 digits.'); return }
    if (!isStudent && a.length < 6) { setError('Please use at least 6 characters.'); return }
    if (a !== b) { setError(`Those ${label}s don't match — try again.`); return }
    completeCredentialChange(a)
  }

  return (
    <BrainBackground>
      <img src={logoFull} alt="Neurobix Method" className="h-8 sm:h-10 object-contain mb-5" />
      <h1 className="text-3xl sm:text-4xl font-bold text-nb-dark text-center tracking-tight mb-2">
        {isStudent ? "Let's set your PIN!" : 'Set a new password'}
      </h1>
      <p className="text-sm sm:text-base text-nb-dark/60 text-center mb-8 max-w-sm">
        {isStudent
          ? "This is a temporary account — pick a new secret PIN before you continue."
          : 'Your account was created with a temporary password. Please set a new one to continue.'}
      </p>

      <div className="w-full max-w-xl bg-white rounded-[2rem] shadow-xl p-7 sm:p-10">
        <form onSubmit={submit} className="space-y-6">
          {isStudent ? (
            <>
              <div>
                <label className="block text-base font-bold text-nb-dark mb-2 text-center">New 4-digit PIN</label>
                <PinInput length={4} value={a} onChange={v => { setA(v); setError('') }} autoFocus />
              </div>
              <div>
                <label className="block text-base font-bold text-nb-dark mb-2 text-center">Confirm PIN</label>
                <PinInput length={4} value={b} onChange={v => { setB(v); setError('') }} />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-base font-bold text-nb-dark mb-2">New Password</label>
                <input type="password" value={a} onChange={e => { setA(e.target.value); setError('') }}
                  className="w-full rounded-full border-2 border-nb-green bg-white px-5 py-3 text-nb-dark outline-none focus:ring-2 focus:ring-nb-lime/60 transition"
                  autoFocus required />
              </div>
              <div>
                <label className="block text-base font-bold text-nb-dark mb-2">Confirm Password</label>
                <input type="password" value={b} onChange={e => { setB(e.target.value); setError('') }}
                  className="w-full rounded-full border-2 border-nb-green bg-white px-5 py-3 text-nb-dark outline-none focus:ring-2 focus:ring-nb-lime/60 transition"
                  required />
              </div>
            </>
          )}

          {error && <p className="text-center text-sm font-semibold text-red-600">{error}</p>}

          <div className="flex justify-center pt-2">
            <button type="submit"
              className="px-12 py-3 rounded-full bg-nb-green text-white font-bold text-lg shadow-[0_5px_0_rgba(42,77,40,0.4)] hover:bg-nb-dark active:translate-y-0.5 active:shadow-[0_2px_0_rgba(42,77,40,0.4)] transition-all">
              Continue →
            </button>
          </div>
        </form>
      </div>

      <button onClick={logout} className="mt-5 text-sm font-semibold text-nb-dark/40 hover:text-red-500 underline underline-offset-2 transition">
        Log out instead
      </button>
    </BrainBackground>
  )
}
