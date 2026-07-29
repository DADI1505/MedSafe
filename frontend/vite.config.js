import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// Configuration Vite : React + Tailwind CSS v4
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 3000,
    // Le proxy /api évite les problèmes de CORS en développement :
    // toutes les requêtes vers /api sont transférées vers le backend FastAPI.
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
})
