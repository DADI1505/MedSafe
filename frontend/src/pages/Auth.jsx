import { useState } from "react"
import { ShieldCheck } from "lucide-react"
import AuthForm from "../components/AuthForm"
import { useAuth } from "../context/AuthContext"

/*
  ============================================================
  Auth — PAGE DE CONNEXION / INSCRIPTION
  ============================================================
  C'est la première page que voit un visiteur non connecté.
  Une fois connecté ou inscrit, App.jsx affiche automatiquement
  la plateforme (page Ask) : cette page disparaît d'elle-même.

  On gère localement :
   - "mode"    : "login" ou "register" (bascule)
   - "loading" : appel réseau en cours
   - "error"   : message d'erreur clair à montrer
*/
export default function Auth() {
  const { login, register } = useAuth()

  const [mode, setMode] = useState("login")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isRegister = mode === "register"

  // Appelée par le formulaire à la validation.
  async function handleSubmit(credentials) {
    setLoading(true)
    setError(null)
    try {
      // On appelle la bonne action du contexte selon le mode.
      if (isRegister) {
        await register(credentials)
      } else {
        await login(credentials)
      }
      // Succès : rien à faire, App.jsx bascule vers la plateforme.
    } catch (err) {
      // On affiche le message propre préparé par l'intercepteur Axios,
      // ou un message générique en secours.
      setError(err?.userMessage || "Identifiants incorrects. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  // Bascule entre connexion et inscription (et efface l'erreur).
  function toggleMode() {
    setMode(isRegister ? "login" : "register")
    setError(null)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-md">
        {/* En-tête avec logo */}
        <div className="mb-6 flex flex-col items-center text-center">
          <img src="/logo-medsafe.png" alt="Logo MedSafe" className="h-14 w-14 rounded-xl" />
          <h1 className="mt-3 text-2xl font-bold text-brand">MedSafe</h1>
          <p className="text-muted">Sécurité médicamenteuse</p>
        </div>

        {/* Carte du formulaire */}
        <div className="rounded-card border border-line bg-surface p-6 shadow-sm sm:p-8">
          <h2 className="mb-1 text-xl font-bold text-brand">
            {isRegister ? "Créer un compte" : "Connexion"}
          </h2>
          <p className="mb-6 text-sm text-muted">
            {isRegister
              ? "Créez votre compte pour accéder à la plateforme."
              : "Connectez-vous pour accéder à la plateforme."}
          </p>

          <AuthForm mode={mode} onSubmit={handleSubmit} isLoading={loading} errorMessage={error} />

          {/* Bascule connexion / inscription */}
          <p className="mt-6 text-center text-sm text-muted">
            {isRegister ? "Vous avez déjà un compte ?" : "Pas encore de compte ?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="font-semibold text-brand-600 underline-offset-2 hover:underline"
            >
              {isRegister ? "Se connecter" : "Créer un compte"}
            </button>
          </p>
        </div>

        {/* Réassurance (charte : rassurant, jamais anxiogène) */}
        <p className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-muted">
          <ShieldCheck className="h-4 w-4 text-teal" aria-hidden="true" />
          Vos données restent confidentielles et sécurisées.
        </p>
      </div>
    </div>
  )
}
