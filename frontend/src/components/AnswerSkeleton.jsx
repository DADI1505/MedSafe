import { Loader2 } from "lucide-react"

/*
  ============================================================
  AnswerSkeleton — État de CHARGEMENT explicite
  ============================================================
  Pendant l'appel à /rag/ask, on montre :
   - un message clair sur ce qui se passe,
   - un "skeleton" (barres grises animées) qui imite la réponse à venir.
  Cela rassure l'utilisateur : l'app travaille, elle n'a pas planté.
*/
export default function AnswerSkeleton() {
  return (
    <section
      className="rounded-card border border-line bg-surface p-6 shadow-sm"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Message d'attente lisible */}
      <div className="mb-5 flex items-center gap-3 text-brand-600">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        <p className="font-medium">Recherche dans les notices officielles openFDA en cours…</p>
      </div>

      {/* Fausses lignes de texte animées (skeleton) */}
      <div className="space-y-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-line" />
        <div className="h-4 w-full animate-pulse rounded bg-line" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-line" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-line" />
      </div>

      <span className="sr-only">Chargement de la réponse, veuillez patienter.</span>
    </section>
  )
}
