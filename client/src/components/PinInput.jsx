import { useRef } from 'react'

export default function PinInput({ length = 4, value, onChange, autoFocus }) {
  const refs = useRef([])

  function handleChange(i, raw) {
    const digit = raw.replace(/\D/g, '').slice(-1)
    const chars = value.split('')
    chars[i] = digit
    onChange(chars.join('').slice(0, length))
    if (digit && i < length - 1) refs.current[i + 1]?.focus()
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus()
  }

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={el => (refs.current[i] = el)}
          type="password"
          inputMode="numeric"
          maxLength={1}
          autoFocus={autoFocus && i === 0}
          value={value[i] || ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black rounded-2xl border-2 border-nb-green bg-white text-nb-dark outline-none focus:ring-2 focus:ring-nb-lime/60 transition"
        />
      ))}
    </div>
  )
}
