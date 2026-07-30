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



// v3
// import { useState } from "react"
// import { useAuth } from "./context/AuthContext"
// import Auth from "./pages/Auth"
// import Ask from "./pages/Ask"
// import History from "./pages/History"
// import Header from "./components/Header"

// export default function App() {
//   const { user, isLoading } = useAuth()
//   const [currentView, setCurrentView] = useState("ask")   // "ask" ou "history"

//   if (isLoading) {
//     return <div className="flex min-h-screen items-center justify-center">Chargement…</div>
//   }

//   if (!user) {
//     return <Auth />
//   }

//   return (
//     <>
//       <Header onNavigateHistory={() => setCurrentView("history")} />
//       {currentView === "ask" && <Ask />}
//       {currentView === "history" && <History onBack={() => setCurrentView("ask")} />}
//     </>
//   )
// }


// import { useState } from "react"
// import { useAuth } from "./context/AuthContext"
// import Auth from "./pages/Auth"
// import Ask from "./pages/Ask"
// import History from "./pages/History"
// import Sidebar from "./components/Sidebar"

// export default function App() {
//   const { user, isLoading } = useAuth()
//   const [currentView, setCurrentView] = useState("ask")
//   const [askResetKey, setAskResetKey] = useState(0)
//   const [selectedEntry, setSelectedEntry] = useState(null)

//   if (isLoading) {
//     return <div className="flex min-h-screen items-center justify-center">Chargement…</div>
//   }

//   if (!user) {
//     return <Auth />
//   }

//   function handleNewQuestion() {
//     setCurrentView("ask")
//     setSelectedEntry(null)
//     setAskResetKey((k) => k + 1) // force Ask à se remonter, donc à revenir à l'accueil
//   }

//   function handleOpenHistory() {
//     setCurrentView("history")
//   }

//   function handleSelectHistoryEntry(entry) {
//     // Affiche directement la question/réponse sélectionnée depuis la barre latérale
//     setSelectedEntry(entry)
//     setCurrentView("history-entry")
//   }

//   return (
//     <div className="flex h-screen bg-canvas">
//       <Sidebar
//         currentView={currentView}
//         onNewQuestion={handleNewQuestion}
//         onOpenHistory={handleOpenHistory}
//         onSelectHistoryEntry={handleSelectHistoryEntry}
//       />

//       <main className="flex-1 overflow-y-auto">
//         {currentView === "ask" && <Ask key={askResetKey} />}
//         {currentView === "history" && <History />}
//         {currentView === "history-entry" && selectedEntry && (
//           <History initialEntry={selectedEntry} />
//         )}
//       </main>
//     </div>
//   )
// }


import { useState } from "react"
import { Menu } from "lucide-react"
import { useAuth } from "./context/AuthContext"
import Auth from "./pages/Auth"
import Ask from "./pages/Ask"
import History from "./pages/History"
import Sidebar from "./components/Sidebar"

export default function App() {
  const { user, isLoading } = useAuth()
  const [currentView, setCurrentView] = useState("ask")
  const [askResetKey, setAskResetKey] = useState(0)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)   // fermée par défaut sur mobile

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Chargement…</div>
  }

  if (!user) {
    return <Auth />
  }

  function handleNewQuestion() {
    setCurrentView("ask")
    setSelectedEntry(null)
    setAskResetKey((k) => k + 1)
    setIsSidebarOpen(false)   // referme la sidebar après action, sur mobile
  }

  function handleOpenHistory() {
    setCurrentView("history")
    setIsSidebarOpen(false)
  }

  function handleSelectHistoryEntry(entry) {
    setSelectedEntry(entry)
    setCurrentView("history-entry")
    setIsSidebarOpen(false)
  }

  return (
    <div className="flex h-screen bg-canvas">
      {/* Overlay sombre derrière la sidebar quand elle est ouverte sur mobile —
          cliquer dessus la referme */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* La sidebar : cachée par défaut sur mobile (translate -100%),
          visible en overlay si isSidebarOpen, TOUJOURS visible à partir de md: */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transition-transform duration-200 md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          currentView={currentView}
          onNewQuestion={handleNewQuestion}
          onOpenHistory={handleOpenHistory}
          onSelectHistoryEntry={handleSelectHistoryEntry}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barre mobile avec bouton menu — visible UNIQUEMENT sous md: */}
        <div className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-brand hover:bg-canvas"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <p className="text-sm font-bold text-brand">MedSafe</p>
        </div>

        <main className="flex-1 overflow-y-auto">
          {currentView === "ask" && <Ask key={askResetKey} />}
          {currentView === "history" && <History />}
          {currentView === "history-entry" && selectedEntry && (
            <History initialEntry={selectedEntry} />
          )}
        </main>
      </div>
    </div>
  )
}
