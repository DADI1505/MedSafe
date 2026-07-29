// import { useState } from "react"
// import { Mail, Lock, LogIn, UserPlus } from "lucide-react"

/*
  ============================================================
  AuthForm — Formulaire de connexion OU d'inscription
  ============================================================
  Un seul composant gère les deux cas grâce à la prop "mode".
  Props :
   - mode : "login" | "register"
   - onSubmit({ email, password }) : appelée à la validation
   - isLoading : désactive le bouton pendant l'appel réseau
   - errorMessage : message d'erreur clair à afficher (ou null)
*/
// export default function AuthForm({ mode, onSubmit, isLoading, errorMessage }) {
//   const isRegister = mode === "register"

//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")

//   function handleSubmit(event) {
//     event.preventDefault()
//     const cleanEmail = email.trim()
//     // Validations minimales et lisibles (le backend revalide de son côté).
//     if (!cleanEmail || !password) return
//     onSubmit({ email: cleanEmail, password })
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       {/* Champ Email */}
//       <div>
//         <label htmlFor="email" className="mb-1.5 block font-medium text-brand">
//           Adresse e-mail
//         </label>
//         <div className="relative">
//           <Mail
//             className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
//             aria-hidden="true"
//           />
//           <input
//             id="email"
//             type="email"
//             autoComplete="email"
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="vous@exemple.com"
//             className="w-full rounded-xl border border-line bg-canvas py-3 pl-11 pr-4 text-ink placeholder:text-muted focus:border-brand-600 focus:bg-surface focus:outline-none"
//           />
//         </div>
//       </div>

//       {/* Champ Mot de passe */}
//       <div>
//         <label htmlFor="password" className="mb-1.5 block font-medium text-brand">
//           Mot de passe
//         </label>
//         <div className="relative">
//           <Lock
//             className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
//             aria-hidden="true"
//           />
//           <input
//             id="password"
//             type="password"
//             autoComplete={isRegister ? "new-password" : "current-password"}
//             required
//             minLength={6}
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder={isRegister ? "Au moins 6 caractères" : "Votre mot de passe"}
//             className="w-full rounded-xl border border-line bg-canvas py-3 pl-11 pr-4 text-ink placeholder:text-muted focus:border-brand-600 focus:bg-surface focus:outline-none"
//           />
//         </div>
//       </div>

//       {/* Message d'erreur (ex : identifiants invalides) */}
//       {errorMessage && (
//         <p role="alert" className="rounded-lg bg-risk-blocked/10 px-3 py-2 text-sm font-medium text-risk-blocked">
//           {errorMessage}
//         </p>
//       )}

//       {/* Bouton principal */}
//       <button
//         type="submit"
//         disabled={isLoading}
//         className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-60"
//       >
//         {isRegister ? <UserPlus className="h-5 w-5" aria-hidden="true" /> : <LogIn className="h-5 w-5" aria-hidden="true" />}
//         {isLoading ? "Veuillez patienter…" : isRegister ? "Créer mon compte" : "Se connecter"}
//       </button>
//     </form>
//   )
// }
import { useState } from "react"
import { Mail, Lock, User, LogIn, UserPlus } from "lucide-react"

export default function AuthForm({ mode, onSubmit, isLoading, errorMessage }) {
  const isRegister = mode === "register"

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(event) {
    event.preventDefault()
    const cleanEmail = email.trim()
    const cleanUsername = username.trim()

    // En inscription, username et email sont requis.
    // En connexion, seul email/password comptent (username ignoré).
    if (!cleanEmail || !password) return
    if (isRegister && !cleanUsername) return

    // On construit le payload envoyé au backend selon le mode.
    const payload = isRegister
      ? { username: cleanUsername, email: cleanEmail, password }
      : { email: cleanEmail, password }

    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Champ Nom d'utilisateur — visible SEULEMENT en inscription */}
      {isRegister && (
        <div>
          <label htmlFor="username" className="mb-1.5 block font-medium text-brand">
            Nom d'utilisateur
          </label>
          <div className="relative">
            <User
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              minLength={3}
              maxLength={50}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Votre nom d'utilisateur"
              className="w-full rounded-xl border border-line bg-canvas py-3 pl-11 pr-4 text-ink placeholder:text-muted focus:border-brand-600 focus:bg-surface focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Champ Email */}
      <div>
        <label htmlFor="email" className="mb-1.5 block font-medium text-brand">
          Adresse e-mail
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
            className="w-full rounded-xl border border-line bg-canvas py-3 pl-11 pr-4 text-ink placeholder:text-muted focus:border-brand-600 focus:bg-surface focus:outline-none"
          />
        </div>
      </div>

      {/* Champ Mot de passe */}
      <div>
        <label htmlFor="password" className="mb-1.5 block font-medium text-brand">
          Mot de passe
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            id="password"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isRegister ? "Au moins 8 caractères" : "Votre mot de passe"}
            className="w-full rounded-xl border border-line bg-canvas py-3 pl-11 pr-4 text-ink placeholder:text-muted focus:border-brand-600 focus:bg-surface focus:outline-none"
          />
        </div>
      </div>

      {errorMessage && (
        <p role="alert" className="rounded-lg bg-risk-blocked/10 px-3 py-2 text-sm font-medium text-risk-blocked">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isRegister ? <UserPlus className="h-5 w-5" aria-hidden="true" /> : <LogIn className="h-5 w-5" aria-hidden="true" />}
        {isLoading ? "Veuillez patienter…" : isRegister ? "Créer mon compte" : "Se connecter"}
      </button>
    </form>
  )
}