import { createContext, useContext, useEffect, useState } from 'react'
import { signIn, signOut, changeOwnCredential } from '../lib/accounts'

const AuthContext = createContext(null)

function clearStoredSession() {
  localStorage.removeItem('nb_token')
  localStorage.removeItem('nb_user')
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('nb_token'))
  const [user,  setUser]  = useState(() => {
    const stored = localStorage.getItem('nb_user')
    return stored ? JSON.parse(stored) : null
  })

  async function login(identifier, password) {
    const { token: newToken, user: signedIn } = await signIn(identifier, password)
    localStorage.setItem('nb_token', newToken)
    localStorage.setItem('nb_user', JSON.stringify(signedIn))
    setToken(newToken)
    setUser(signedIn)
    return signedIn
  }

  // Called from the forced first-login screen once the user picks a new password/PIN.
  async function completeCredentialChange(newCredential) {
    const updated = { ...user, ...(await changeOwnCredential(user, newCredential)), mustChangeCredential: false }
    localStorage.setItem('nb_user', JSON.stringify(updated))
    setUser(updated)
  }

  async function logout() {
    await signOut()
    clearStoredSession()
    setToken(null)
    setUser(null)
  }

  // The API client fires this when the server rejects our token (signed in elsewhere,
  // idle timeout, expired) — drop the local session so ProtectedRoute sends us to login.
  useEffect(() => {
    function handleExpired() {
      clearStoredSession()
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
