// src/components/ReadAloudButton.jsx
// Bouton "Lire à voix haute" — bascule entre lecture et arrêt.

import { Volume2, VolumeX } from "lucide-react"
import { useSpeech } from "../hooks/useSpeech"
import { stripMarkdown } from "../utils/stripMarkdown"

export default function ReadAloudButton({ text }) {
  const { speak, stop, isSpeaking, isSupported } = useSpeech()

  if (!isSupported) return null // masqué si le navigateur ne gère pas la synthèse vocale

  function handleClick() {
    if (isSpeaking) {
      stop()
    } else {
      speak(stripMarkdown(text))
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-brand transition-colors hover:bg-canvas"
      aria-label={isSpeaking ? "Arrêter la lecture" : "Écouter la réponse"}
    >
      {isSpeaking ? (
        <>
          <VolumeX className="h-4 w-4" aria-hidden="true" />
          Arrêter
        </>
      ) : (
        <>
          <Volume2 className="h-4 w-4" aria-hidden="true" />
          Écouter
        </>
      )}
    </button>
  )
}