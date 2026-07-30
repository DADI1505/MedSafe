// src/components/Sidebar.jsx
// Barre latérale fixe, façon Copilot : logo, bouton "Nouvelle question",
// liste des questions récentes, et informations utilisateur en bas.

import { ShieldCheck, Plus, Clock, LogOut } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useAuditHistory } from "../hooks/useAuditHistory"

export default function Sidebar({ onNewQuestion, onOpenHistory, onSelectHistoryEntry, currentView }) {
  const { user, logout } = useAuth()
  const { data: history } = useAuditHistory()

  // On n'affiche que les 8 questions les plus récentes dans la barre —
  // la liste complète reste consultable via la page Historique dédiée
  const recentEntries = (history || []).slice(0, 8)

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-line bg-surface">
      {/* En-tête : logo MedSafe */}
      <div className="flex items-center gap-2 px-4 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/10 text-brand-600">
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-bold leading-none text-brand">MedSafe</p>
          <p className="text-xs text-muted">Sécurité médicamenteuse</p>
        </div>
      </div>

      {/* Bouton Nouvelle question */}
      <div className="px-3">
        <button
          type="button"
          onClick={onNewQuestion}
          className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
            currentView === "ask"
              ? "border-brand-600/30 bg-brand-600/5 text-brand-600"
              : "border-line text-brand hover:bg-canvas"
          }`}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nouvelle question
        </button>
      </div>

      {/* Liste des questions récentes */}
      <div className="mt-5 flex-1 overflow-y-auto px-3">
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted">
          Récent
        </p>

        {recentEntries.length === 0 && (
          <p className="px-1 text-sm text-muted">Aucune question pour l'instant.</p>
        )}

        <ul className="space-y-0.5">
          {recentEntries.map((entry) => (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() => onSelectHistoryEntry(entry)}
                className="w-full truncate rounded-lg px-2.5 py-2 text-left text-sm text-ink transition-colors hover:bg-canvas"
                title={entry.query_text}
              >
                {entry.query_text}
              </button>
            </li>
          ))}
        </ul>

        {history && history.length > 8 && (
          <button
            type="button"
            onClick={onOpenHistory}
            className={`mt-2 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
              currentView === "history"
                ? "bg-brand-600/5 text-brand-600"
                : "text-brand-600 hover:bg-canvas"
            }`}
          >
            <Clock className="h-4 w-4" aria-hidden="true" />
            Voir tout l'historique
          </button>
        )}
      </div>

      {/* Utilisateur connecté + déconnexion */}
      {/* Utilisateur connecté + déconnexion */}
      <div className="border-t border-line p-3">
        <div className="flex items-center gap-2.5 rounded-xl border border-line bg-canvas px-2.5 py-2">
          {/* Avatar rond avec l'initiale du nom d'utilisateur */}
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
            {user?.username?.charAt(0).toUpperCase() || "?"}
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight text-brand">
              {user?.username || "Utilisateur"}
            </p>
            <p className="text-xs text-muted">
              {user?.role === "medecin" ? "Professionnel de santé" : "Patient"}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-brand"
            aria-label="Déconnexion"
            title="Déconnexion"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  )
}