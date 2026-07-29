import { createContext, useContext, useEffect, useState } from "react"
import { login as loginApi, register as registerApi, getMe } from "../api/services"
import { saveToken, getToken, clearToken } from "../api/client"

/*
  ============================================================
  AuthContext — Le "cerveau" de l'authentification
  ============================================================
  Ce contexte garde en mémoire, pour TOUTE l'application :
    - user   : l'utilisateur connecté (ou null)
    - status : "loading" | "authenticated" | "anonymous"
  et expose 3 actions simples : login, register, logout.

  Grâce à ça, n'importe quel composant peut savoir si
  l'utilisateur est connecté avec un simple useAuth().
*/

// 1. On crée le contexte (la "boîte" partagée).
const AuthContext = createContext(null)

// 2. Le Provider : à placer tout en haut de l'app (dans App.jsx).
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // "loading" au départ : le temps de vérifier si un token existe déjà.
  const [status, setStatus] = useState("loading")

  /*
    Au premier chargement de la page :
    - s'il y a déjà un token en mémoire, on demande au backend "qui suis-je ?"
    - sinon, on considère l'utilisateur comme anonyme.
  */
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setStatus("anonymous")
      return
    }

    getMe()
      .then((me) => {
        setUser(me)
        setStatus("authenticated")
      })
      .catch(() => {
        // Token invalide/expiré : on nettoie et on repasse anonyme.
        clearToken()
        setStatus("anonymous")
      })
  }, [])

  // 3. Connexion : appelle l'API, stocke le token, met à jour l'utilisateur.
  async function login(credentials) {
    const data = await loginApi(credentials)
    saveToken(data.access_token)
    setUser(data.user)
    setStatus("authenticated")
  }

  // 4. Inscription : même principe (le backend connecte directement après création).
  async function register(payload) {
    const data = await registerApi(payload)
    saveToken(data.access_token)
    setUser(data.user)
    setStatus("authenticated")
  }

  // 5. Déconnexion : on efface le token et on oublie l'utilisateur.
  function logout() {
    clearToken()
    setUser(null)
    setStatus("anonymous")
  }

  const value = { user, status, login, register, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 6. Petit hook pratique pour utiliser le contexte partout.
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>")
  }
  return context
}
