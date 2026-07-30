// import { Loader2 } from "lucide-react"
// import Ask from "./pages/Ask"
// import Auth from "./pages/Auth"
// import { useAuth } from "./context/AuthContext"

/*
  ============================================================
  App — Composant racine + "portier" d'accès
  ============================================================
  Le parcours voulu :
    1. Visiteur non connecté  -> page Auth (connexion / inscription)
    2. Une fois connecté      -> plateforme (page Ask)

  On lit l'état d'authentification via useAuth() :
    - "loading"       : on vérifie le token -> petit écran de chargement
    - "anonymous"     : pas connecté        -> <Auth />
    - "authenticated" : connecté            -> <Ask />
*/
// export default function App() {
//   const { status } = useAuth()

//   // Pendant la vérification initiale du token.
//   if (status === "loading") {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-canvas">
//         <Loader2 className="h-8 w-8 animate-spin text-brand-600" aria-hidden="true" />
//         <span className="sr-only">Chargement…</span>
//       </div>
//     )
//   }

//   // Non connecté : on montre la page d'authentification.
//   if (status !== "authenticated") {
//     return <Auth />
//   }

//   // Connecté : accès à la plateforme.
//   return <Ask />
// }




import { useState } from "react"
import { useAuth } from "./context/AuthContext"
import Auth from "./pages/Auth"
import Ask from "./pages/Ask"
import History from "./pages/History"
import Header from "./components/Header"

export default function App() {
  const { user, isLoading } = useAuth()
  const [currentView, setCurrentView] = useState("ask")   // "ask" ou "history"

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Chargement…</div>
  }

  if (!user) {
    return <Auth />
  }

  return (
    <>
      <Header onNavigateHistory={() => setCurrentView("history")} />
      {currentView === "ask" && <Ask />}
      {currentView === "history" && <History onBack={() => setCurrentView("ask")} />}
    </>
  )
}