import { Clock, ArrowLeft } from "lucide-react"
import { useAuditHistory } from "../hooks/useAuditHistory"
import RiskBadge from "../components/RiskBadge"
import { parseMarkdown } from "../utils/parseMarkdown"

export default function History({ onBack }) {
  const { data: history, isLoading, isError } = useAuditHistory()

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Retour
      </button>

      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-brand">
        <Clock className="h-6 w-6" aria-hidden="true" />
        Historique de vos questions
      </h1>

      {isLoading && (
        <p className="text-muted">Chargement de votre historique…</p>
      )}

      {isError && (
        <p className="rounded-xl bg-risk-blocked/10 p-4 text-risk-blocked">
          Impossible de charger l'historique. Réessayez plus tard.
        </p>
      )}

      {history && history.length === 0 && (
        <p className="text-muted">
          Vous n'avez pas encore posé de question. Votre historique apparaîtra ici.
        </p>
      )}

      {history && history.length > 0 && (
        <div className="space-y-4">
          {history.map((entry) => (
            <article
              key={entry.id}
              className="rounded-card border border-line bg-surface p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-medium text-brand">{entry.query_text}</p>
                <RiskBadge level={entry.risk_level} />
              </div>

              {entry.generated_response && (
                <div className="text-sm">
                  {parseMarkdown(entry.generated_response)}
                </div>
              )}

              <p className="mt-3 text-xs text-muted">
                {new Date(entry.created_at).toLocaleString("fr-FR")}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}