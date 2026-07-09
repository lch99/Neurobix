import { useEffect } from 'react'
import { useToast } from '../context/ToastContext'

export default function SessionToast() {
  const { showToast } = useToast()

  useEffect(() => {
    function handleExpired(e) {
      showToast(e.detail?.message || 'You have been logged out.', { type: 'info' })
    }
    window.addEventListener('nb:session-expired', handleExpired)
    return () => window.removeEventListener('nb:session-expired', handleExpired)
  }, [showToast])

  return null
}
