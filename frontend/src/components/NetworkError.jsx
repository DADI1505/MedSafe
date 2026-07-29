import { WifiOff, RotateCcw } from "lucide-react"

/*
  ============================================================
  NetworkError — État d'ERREUR réseau / serveur
  ============================================================
  Affiché quand la requête échoue (pas de réseau, serveur KO...).
  On montre le message clair préparé par l'intercepteur Axios
  (error.userMessage), plus un bouton "Réessayer".
*/
export default function NetworkError({ message, onRetry }) {
  return (
    <section
      className="rounded-card border border-line bg-surface p-6 text-center shadow-sm"
      role="alert"
    >
      <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-canvas text-muted">
        <WifiOff className="h-6 w-6" aria-hidden="true" />
      </span>

      <p className="text-base font-medium text-ink">
        {message || "Une erreur est survenue. Veuillez réessayer."}
      </p>

      {/* Bouton pour relancer la dernière requête */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 font-medium text-white transition-colors hover:bg-brand"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Réessayer
        </button>
      )}
    </section>
  )
}
