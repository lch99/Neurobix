import { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext(null)

const TYPE_STYLES = {
  info: 'bg-nb-dark text-white',
  success: 'bg-nb-green text-white',
  error: 'bg-red-500 text-white',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, { type = 'info', duration = 5000 } = {}) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-full shadow-xl animate-[fadeIn_0.2s_ease] ${TYPE_STYLES[t.type] || TYPE_STYLES.info}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
