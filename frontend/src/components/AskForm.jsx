// import { useState } from "react"
// import { Search, SendHorizontal } from "lucide-react"

// /*
//   ============================================================
//   AskForm — Champ de saisie de la question
//   ============================================================
//   Formulaire contrôlé : l'utilisateur tape sa question, puis
//   la soumet. On remonte la question au parent via onSubmit().

//   Props :
//    - onSubmit(question) : appelée à la validation
//    - isLoading : désactive le bouton pendant la recherche
// */
// export default function AskForm({ onSubmit, isLoading }) {
//   const [question, setQuestion] = useState("")

//   function handleSubmit(event) {
//     event.preventDefault()
//     const trimmed = question.trim()
//     if (!trimmed) return // on ignore les questions vides
//     onSubmit(trimmed)
//   }

//   return (
//     <form onSubmit={handleSubmit} className="rounded-card border border-line bg-surface p-4 shadow-sm">
//       <label htmlFor="ask-input" className="mb-2 block font-medium text-brand">
//         Posez votre question sur un médicament
//       </label>

//       <div className="flex flex-col gap-3 sm:flex-row">
//         <div className="relative flex-1">
//           <Search
//             className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
//             aria-hidden="true"
//           />
//           <input
//             id="ask-input"
//             type="text"
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             placeholder="Ex : Puis-je prendre de l'ibuprofène avec du paracétamol ?"
//             className="w-full rounded-xl border border-line bg-canvas py-3 pl-11 pr-4 text-ink placeholder:text-muted focus:border-brand-600 focus:bg-surface focus:outline-none"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={isLoading}
//           className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-60"
//         >
//           <SendHorizontal className="h-5 w-5" aria-hidden="true" />
//           {isLoading ? "Recherche…" : "Vérifier"}
//         </button>
//       </div>

//       <p className="mt-3 text-sm text-muted">
//         MedSafe s&apos;appuie sur les notices officielles openFDA. Il ne remplace pas l&apos;avis d&apos;un professionnel de
//         santé.
//       </p>
//     </form>
//   )
// }


import { useState } from "react"
import { Search, SendHorizontal } from "lucide-react"

/*
  ============================================================
  AskForm — Champ de saisie de la question
  ============================================================
  Formulaire contrôlé : l'utilisateur tape sa question, puis
  la soumet. On remonte la question au parent via onSubmit().

  Props :
   - onSubmit(question) : appelée à la validation
   - isLoading : désactive le bouton pendant la recherche
   - compact : version réduite, utilisée une fois qu'une question
     a déjà été posée (pas de label, pas de disclaimer, plus petit)
*/
export default function AskForm({ onSubmit, isLoading, compact = false }) {
  const [question, setQuestion] = useState("")

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = question.trim()
    if (!trimmed) return // on ignore les questions vides
    onSubmit(trimmed)
    setQuestion("") // on vide le champ après envoi, pratique pour enchaîner les questions
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        compact
          ? "rounded-2xl border border-line bg-surface p-3 shadow-sm"
          : "rounded-card border border-line bg-surface p-4 shadow-sm"
      }
    >
      {/* Le label et le disclaimer ne s'affichent qu'en mode plein (accueil) */}
      {!compact && (
        <label htmlFor="ask-input" className="mb-2 block font-medium text-brand">
          Posez votre question sur un médicament
        </label>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            id="ask-input"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex : Puis-je prendre de l'ibuprofène avec du paracétamol ?"
            className="w-full rounded-xl border border-line bg-canvas py-3 pl-11 pr-4 text-ink placeholder:text-muted focus:border-brand-600 focus:bg-surface focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-60"
        >
          <SendHorizontal className="h-5 w-5" aria-hidden="true" />
          {isLoading ? "Recherche…" : "Vérifier"}
        </button>
      </div>

      {!compact && (
        <p className="mt-3 text-sm text-muted">
          MedSafe s&apos;appuie sur les notices officielles openFDA. Il ne remplace pas l&apos;avis d&apos;un professionnel de
          santé.
        </p>
      )}
    </form>
  )
}