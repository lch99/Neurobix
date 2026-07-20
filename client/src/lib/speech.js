import { useEffect, useState } from 'react'

// Thin wrapper around the browser's built-in Web Speech API — free, instant, no
// upload/storage needed. Used for read-aloud on flash cards, study modes and
// assessment questions (helpful given the target age range of 7–12).
function cleanText(text) {
  return String(text ?? '').replace(/[\u{1F000}-\u{1FFFF}]/gu, '').trim()
}

// Tracks which text is currently being spoken so a speaker button can show its own
// "speaking" state (starting a new utterance always cancels any in-flight one, so at
// most one button is ever animated at a time).
export function useSpeech() {
  const [speakingText, setSpeakingText] = useState(null)

  useEffect(() => () => window.speechSynthesis?.cancel(), [])

  function speak(text) {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const clean = cleanText(text)
    if (!clean) return
    const utter = new SpeechSynthesisUtterance(clean)
    utter.rate = 0.85
    utter.onstart = () => setSpeakingText(text)
    utter.onend = () => setSpeakingText(null)
    utter.onerror = () => setSpeakingText(null)
    window.speechSynthesis.speak(utter)
  }

  function cancel() {
    window.speechSynthesis?.cancel()
    setSpeakingText(null)
  }

  return { speak, cancel, isSpeaking: (text) => speakingText === text }
}
