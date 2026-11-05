import { mockApiRequest } from '../data/mockDb'

// Where data comes from:
//   • mock — the in-browser sample data in data/mockDb.js. Used by the GitHub Pages demo
//            (the deploy workflow sets VITE_USE_MOCK=true) and whenever no API URL is set.
//   • api  — the Express/MySQL backend in /server, at VITE_API_URL.
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !API_URL

const SESSION_MESSAGES = {
  SESSION_REPLACED: 'You were signed out because your account was used to sign in on another device.',
  SESSION_IDLE_TIMEOUT: 'You were signed out after 10 minutes of inactivity.',
}

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  if (USE_MOCK) return mockApiRequest(path, { method, body })

  const authToken = token || localStorage.getItem('nb_token')
  let res
  try {
    res = await fetch(API_URL + path, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Cannot reach the server. Check your connection and try again.')
  }

  const text = await res.text()
  let data = null
  if (text) {
    try { data = JSON.parse(text) } catch { data = { message: text } }
  }

  if (res.ok) return data

  // A rejected token means this browser's session is over — let AuthContext/SessionToast
  // sign the user out. (A 401 from the login form itself just means wrong credentials.)
  if (res.status === 401 && authToken) {
    const message = SESSION_MESSAGES[data?.code] || 'Your session has ended. Please sign in again.'
    window.dispatchEvent(new CustomEvent('nb:session-expired', { detail: { code: data?.code, message } }))
  }

  // Same contract as the mock: a GET for something that doesn't exist resolves to null.
  if (res.status === 404 && method === 'GET') return null

  const error = new Error(data?.message || `Request failed (${res.status})`)
  error.status = res.status
  error.code = data?.code
  throw error
}
