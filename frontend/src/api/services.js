import { apiClient } from "./client"

/*
  ============================================================
  SERVICES API
  ============================================================
  Chaque fonction correspond à UNE route du backend.
  On les isole ici pour ne jamais écrire d'URL "en dur"
  dans les composants React. C'est plus propre et réutilisable.
*/

/* POST /api/v1/rag/ask — le cœur du produit.
   Envoie une question, reçoit une réponse vulgarisée + niveau de risque. */
export async function askRag(query) {
  const { data } = await apiClient.post("/rag/ask", { query })
  // data = { answer, risk_level, sources, disclaimer }
  return data
}

/* GET /api/v1/drugs/search?q=... — recherche de médicaments. */
export async function searchDrugs(q) {
  const { data } = await apiClient.get("/drugs/search", { params: { q } })
  return data
}

/* GET /api/v1/drugs/{set_id} — détail d'une notice openFDA. */
export async function getDrugDetail(setId) {
  const { data } = await apiClient.get(`/drugs/${setId}`)
  return data
}

/* POST /api/v1/auth/login — authentification (renvoie un JWT).
   credentials = { email, password }
   réponse attendue = { access_token, user: { id, email } } */
export async function login(credentials) {
  const { data } = await apiClient.post("/auth/login", credentials)
  return data
}

/* POST /api/v1/auth/register — création de compte.
   payload = { email, password }
   réponse attendue = { access_token, user: { id, email } } */
export async function register(payload) {
  const { data } = await apiClient.post("/auth/register", payload)
  return data
}

/* GET /api/v1/auth/me — récupère l'utilisateur connecté grâce au JWT.
   Sert à savoir "qui suis-je ?" au rechargement de la page. */
export async function getMe() {
  const { data } = await apiClient.get("/auth/me")
  return data
}

/* GET /api/v1/audit/history — historique des questions de l'utilisateur. */
export async function getAuditHistory() {
  const { data } = await apiClient.get("/audit/history")
  return data
}
