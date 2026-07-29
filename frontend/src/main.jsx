import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import App from "./App"
import { AuthProvider } from "./context/AuthContext"
import "./index.css"

/*
  ============================================================
  main.jsx — Point d'entrée de l'application React
  ============================================================
  On y crée le "QueryClient" de TanStack Query et on l'enveloppe
  autour de toute l'app via <QueryClientProvider>. C'est ce qui
  permet à nos hooks (useAskRag...) de fonctionner partout.
*/

// Configuration globale de React Query (valeurs par défaut raisonnables).
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // évite de recharger en changeant d'onglet
      staleTime: 60_000, // données considérées "fraîches" pendant 1 min
    },
  },
})

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* AuthProvider enveloppe l'app pour partager l'état de connexion partout */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
