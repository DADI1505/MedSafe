// src/hooks/useSpeech.js
// Pilote la synthèse vocale native du navigateur (gratuite, sans API externe).

import { useState, useEffect, useCallback } from "react"

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window

  // Arrête toute lecture en cours si le composant qui utilise ce hook disparaît
  useEffect(() => {
    return () => {
      if (isSupported) window.speechSynthesis.cancel()
    }
  }, [isSupported])

  const speak = useCallback(
    (text) => {
      if (!isSupported || !text) return

      // Si une lecture est déjà en cours, on l'arrête avant d'en démarrer une nouvelle
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "fr-FR"
      utterance.rate = 1
      utterance.pitch = 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    },
    [isSupported],
  )

  const stop = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [isSupported])

  return { speak, stop, isSpeaking, isSupported }
}