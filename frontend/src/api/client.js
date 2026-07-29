import axios from "axios"

/*
  ============================================================
  CLIENT AXIOS CENTRALISÉ
  ============================================================
  Un seul endroit pour configurer les appels réseau vers le
  backend FastAPI. On y branche :
   - l'URL de base des API,
   - un intercepteur qui ajoute le token JWT à chaque requête,
   - un intercepteur qui gère proprement les erreurs (401, réseau...).
*/

// Toutes les routes commencent par /api/v1 (voir contrats backend).
// En dev, le proxy Vite redirige /api vers http://localhost:8000.
export const apiClient = axios.create({
  baseURL: "/api/v1",
  timeout: 20000, // 20s : les réponses RAG peuvent être un peu longues
  headers: {
    "Content-Type": "application/json",
  },
})

// Clé de stockage du token (localStorage). Simple pour un débutant.
const TOKEN_KEY = "medsafe_token"

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

/* --- Intercepteur de REQUÊTE : ajoute le JWT automatiquement --- */
apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/* --- Intercepteur de RÉPONSE : normalise les erreurs --- */
apiClient.interceptors.response.use(
  // Cas succès : on renvoie la réponse telle quelle.
  (response) => response,

  // Cas erreur : on transforme l'erreur brute en message clair.
  (error) => {
    // 1. Session expirée / non autorisé -> on nettoie le token.
    if (error.response?.status === 401) {
      clearToken()
    }

    // 2. On construit un message compréhensible (jamais de stack technique).
    let message = "Une erreur est survenue. Veuillez réessayer."

    if (error.code === "ECONNABORTED") {
      message = "La requête a pris trop de temps. Vérifiez votre connexion."
    } else if (!error.response) {
      message = "Impossible de joindre le serveur. Vérifiez votre connexion internet."
    } else if (error.response.status === 401) {
      message = "Votre session a expiré. Veuillez vous reconnecter."
    } else if (error.response.status >= 500) {
      message = "Le service est momentanément indisponible."
    }

    // On rejette avec un message propre attaché.
    error.userMessage = message
    return Promise.reject(error)
  },
)
