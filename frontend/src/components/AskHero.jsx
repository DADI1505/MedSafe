// src/components/AskHero.jsx
// Écran d'accueil façon "greeting" avant toute question posée :
// salutation personnalisée + champ de recherche centré + suggestions rapides.

import { useState } from "react"
import { Search, ArrowRight, ShieldAlert, Pill, Baby } from "lucide-react"
import { useAuth } from "../context/AuthContext"

const SUGGESTIONS = [
  { icon: ShieldAlert, label: "Interactions médicamenteuses", query: "Quelles sont les interactions de " },
  { icon: Pill, label: "Effets indésirables", query: "Quels sont les effets indésirables de " },
  { icon: Baby, label: "Grossesse et allaitement", query: "Puis-je prendre pendant la grossesse : " },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Bonjour"
  if (hour < 18) return "Bon après-midi"
  return "Bonsoir"
}

export default function AskHero({ onSubmit, isLoading }) {
  const { user } = useAuth()
  const [question, setQuestion] = useState("")

  const firstName = user?.username?.split(" ")[0] || user?.username

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = question.trim()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  function handleSuggestionClick(prefill) {
    setQuestion(prefill)
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      {/* Salutation personnalisée, pièce centrale de l'accueil */}
      <h1 className="text-3xl font-bold text-brand sm:text-4xl">
        {getGreeting()}{firstName ? `, ${firstName}` : ""}
      </h1>
      <p className="mt-2 text-lg text-muted">
        Que souhaitez-vous vérifier aujourd'hui ?
      </p>

      {/* Champ de recherche : pièce maîtresse visuelle, large et flottant */}
      <form onSubmit={handleSubmit} className="mt-8 w-full">
        <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-2 shadow-lg shadow-brand-600/5 transition-shadow focus-within:shadow-brand-600/10">
          <Search className="ml-3 h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Posez votre question sur un médicament…"
            className="w-full bg-transparent py-3 text-base text-ink placeholder:text-muted focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Envoyer la question"
          >
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </form>

      {/* Suggestions rapides — guident sans forcer à taper */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {SUGGESTIONS.map(({ icon: Icon, label, query }) => (
          <button
            key={label}
            type="button"
            onClick={() => handleSuggestionClick(query)}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-sm text-brand transition-colors hover:border-brand-600/30 hover:bg-brand-600/5"
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs text-muted">
        MedSafe s'appuie sur les notices officielles openFDA. Il ne remplace pas l'avis d'un professionnel de santé.
      </p>
    </div>
  )
}