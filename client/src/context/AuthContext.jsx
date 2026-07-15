import { createContext, useContext, useEffect, useState } from 'react'
import { findAuthRecord, resetCredential, setMustChangeCredential } from '../data/mockDb'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('nb_token'))
  const [user,  setUser]  = useState(() => {
    const stored = localStorage.getItem('nb_user')
    return stored ? JSON.parse(stored) : null
  })

  async function login(identifier, password) {
    await new Promise(r => setTimeout(r, 300))
    const match = findAuthRecord(identifier)
    if (!match || match.password !== password) throw new Error('Invalid username/email or password.')
    const fakeToken = 'demo_' + match.user.role + '_token'
    localStorage.setItem('nb_token', fakeToken)
    localStorage.setItem('nb_user', JSON.stringify(match.user))
    setToken(fakeToken)
    setUser(match.user)
    return match.user
  }

  // Called from the forced first-login screen once the user picks a new password/PIN.
  function completeCredentialChange(newCredential) {
    const identifier = user?.username || user?.email
    if (!identifier) return
    resetCredential(identifier, newCredential)
    setMustChangeCredential(identifier, false)
    const updated = { ...user, mustChangeCredential: false }
    localStorage.setItem('nb_user', JSON.stringify(updated))
    setUser(updated)
  }

  async function logout() {
    localStorage.removeItem('nb_token')
    localStorage.removeItem('nb_user')
    setToken(null)
    setUser(null)
  }

  // Keep session-expired listener so SessionToast still works if ever triggered
  useEffect(() => {
    function handleExpired() {
      localStorage.removeItem('nb_token')
      localStorage.removeItem('nb_user')
      setToken(null)
      setUser(null)
    }
    window.addEventListener('nb:session-expired', handleExpired)
    return () => window.removeEventListener('nb:session-expired', handleExpired)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, completeCredentialChange }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
