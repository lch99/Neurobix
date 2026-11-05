import { useEffect, useState } from 'react'
import { USE_MOCK, apiRequest } from '../lib/api'

const STATES = {
  demo:     { label: 'Demo Mode',    dot: 'bg-nb-yellow' },
  checking: { label: 'Connecting…',  dot: 'bg-gray-300' },
  online:   { label: 'Live API',     dot: 'bg-nb-green' },
  offline:  { label: 'API offline',  dot: 'bg-red-500' },
}

export default function ServerStatusBadge() {
  const [state, setState] = useState(USE_MOCK ? 'demo' : 'checking')

  useEffect(() => {
    if (USE_MOCK) return
    let cancelled = false
    apiRequest('/api/health')
      .then(res => { if (!cancelled) setState(res?.status === 'ok' ? 'online' : 'offline') })
      .catch(() => { if (!cancelled) setState('offline') })
    return () => { cancelled = true }
  }, [])

  const { label, dot } = STATES[state]
  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-full px-3 py-1.5 shadow-sm text-xs font-semibold text-nb-dark/70 z-50">
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {label}
    </div>
  )
}
