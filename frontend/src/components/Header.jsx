import { LogOut } from "lucide-react"
import { useAuth } from "../context/AuthContext"

/*
  ============================================================
  Header — En-tête de l'application (zone connectée)
  ============================================================
  Affiche le logo MedSafe, le nom, l'e-mail de l'utilisateur
  connecté et un bouton de déconnexion.
*/
export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4">
        {/* Logo + nom */}
        <div className="flex items-center gap-3">
          <img src="/logo-medsafe.png" alt="Logo MedSafe" className="h-10 w-10 rounded-lg" />
          <div>
            <p className="text-lg font-bold leading-none text-brand">MedSafe</p>
            <p className="text-sm text-muted">Sécurité médicamenteuse</p>
          </div>
        </div>

        {/* Utilisateur connecté + déconnexion */}
        <div className="flex items-center gap-3">
          {user?.email && <span className="hidden text-sm text-muted sm:inline">{user.email}</span>}
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-medium text-brand transition-colors hover:bg-canvas"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  )
}
