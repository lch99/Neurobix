// Account actions (sign-in, credential changes, user/child creation). Each one has a mock
// version for the GitHub Pages demo — which keeps accounts in this browser via data/mockDb.js —
// and a real version that calls the backend. Components call these instead of either directly.

import { USE_MOCK, apiRequest } from './api'
import { findAuthRecord, registerUser, resetCredential, setMustChangeCredential } from '../data/mockDb'

function genTempPassword() {
  return Math.random().toString(36).slice(-4) + Math.floor(10 + Math.random() * 90)
}

export async function signIn(identifier, password) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 300))
    const match = findAuthRecord(identifier)
    if (!match || match.password !== password) throw new Error('Invalid username/email or password.')
    return { token: 'demo_' + match.user.role + '_token', user: match.user }
  }
  try {
    return await apiRequest('/api/auth/login', { method: 'POST', body: { identifier, password } })
  } catch (err) {
    if (err.status === 401) throw new Error('Invalid username/email or password.')
    throw err
  }
}

export async function signOut() {
  if (USE_MOCK) return
  try { await apiRequest('/api/auth/logout', { method: 'POST' }) } catch { /* already signed out */ }
}

// The signed-in user replaces their temporary password/PIN.
export async function changeOwnCredential(user, newCredential) {
  if (USE_MOCK) {
    const identifier = user?.username || user?.email
    if (!identifier) return { ...user, mustChangeCredential: false }
    resetCredential(identifier, newCredential)
    setMustChangeCredential(identifier, false)
    return { ...user, mustChangeCredential: false }
  }
  const { user: updated } = await apiRequest('/api/auth/change-credential', { method: 'POST', body: { newCredential } })
  return updated
}

// Staff "forgot password". The demo shows the temp password on screen (no email server);
// the real backend emails it and never returns it.
export async function requestPasswordReset(email) {
  if (USE_MOCK) {
    if (!findAuthRecord(email)) return { tempPassword: '' }
    const temp = genTempPassword()
    resetCredential(email, temp)
    setMustChangeCredential(email, true)
    return { tempPassword: temp }
  }
  await apiRequest('/api/auth/forgot-password', { method: 'POST', body: { email } })
  return { tempPassword: '' }
}

// ── Admin ────────────────────────────────────────────────────────────────────

// Returns null in mock mode so the Admin dashboard keeps its sample user list.
export async function listUsers() {
  if (USE_MOCK) return null
  return apiRequest('/api/users')
}

export async function createUserAccount(form) {
  const isStudent = form.role === 'student'
  if (USE_MOCK) {
    const identifier = isStudent ? form.username : form.email
    if (findAuthRecord(identifier)) throw new Error(isStudent ? 'That username is already taken.' : 'That email is already registered.')
    const registered = registerUser(identifier, isStudent ? form.pin : form.password, {
      name: form.name, role: form.role,
      ...(isStudent ? { username: form.username } : { email: form.email }),
    })
    return {
      id: Date.now(), name: form.name, role: form.role, status: 'active',
      email: isStudent ? null : form.email, username: isStudent ? form.username : null,
      joined: new Date().toISOString().slice(0, 10), mustChangeCredential: registered.mustChangeCredential,
      parentId: isStudent ? (form.parentId ? Number(form.parentId) : null) : null,
    }
  }
  return apiRequest('/api/users', {
    method: 'POST',
    body: {
      name: form.name,
      role: form.role,
      ...(isStudent
        ? { username: form.username, pin: form.pin, parentId: form.parentId ? Number(form.parentId) : null }
        : { email: form.email, password: form.password }),
    },
  })
}

export async function resetUserCredential(user, tempPassword) {
  if (USE_MOCK) {
    const identifier = user.email || user.username
    resetCredential(identifier, tempPassword)
    setMustChangeCredential(identifier, true)
    return
  }
  await apiRequest(`/api/users/${user.id}/reset-credential`, { method: 'POST', body: { tempPassword } })
}

// ── Parent ───────────────────────────────────────────────────────────────────

export async function addChildAccount({ name, username, pin }) {
  if (USE_MOCK) {
    if (findAuthRecord(username)) throw new Error('That username is already taken — try another.')
    registerUser(username, pin, { name, role: 'student', username })
    return { id: Date.now(), name, username }
  }
  return apiRequest('/api/parent/children', { method: 'POST', body: { name, username, pin } })
}

export async function resetChildPin(child, pin) {
  if (USE_MOCK) {
    if (findAuthRecord(child.username)) {
      resetCredential(child.username, pin)
      setMustChangeCredential(child.username, false)
    } else {
      registerUser(child.username, pin, { name: child.name, role: 'student', username: child.username, mustChangeCredential: false })
    }
    return
  }
  await apiRequest('/api/parent/children/reset-pin', { method: 'POST', body: { username: child.username, pin } })
}
