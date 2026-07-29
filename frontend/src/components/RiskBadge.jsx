import { ShieldCheck, TriangleAlert, ShieldX } from "lucide-react"

/*
  ============================================================
  RiskBadge — Badge de niveau de risque
  ============================================================
  Affiche une pastille colorée selon le niveau renvoyé par l'API :
   - "safe"    -> vert  (sûr)
   - "warning" -> orange (prudence)
   - "blocked" -> rouge  (bloqué)

  IMPORTANT (charte) : ces couleurs vives sont réservées au risque.
  Chaque badge combine COULEUR + ICÔNE + TEXTE pour rester
  accessible (on ne se fie jamais à la couleur seule — WCAG).
*/

// Table de correspondance : à chaque niveau, son style et son libellé.
const RISK_CONFIG = {
  safe: {
    label: "Information sûre",
    Icon: ShieldCheck,
    className: "bg-risk-safe/10 text-risk-safe border-risk-safe/30",
  },
  warning: {
    label: "À utiliser avec prudence",
    Icon: TriangleAlert,
    className: "bg-risk-warning/10 text-risk-warning border-risk-warning/30",
  },
  blocked: {
    label: "Réponse bloquée",
    Icon: ShieldX,
    className: "bg-risk-blocked/10 text-risk-blocked border-risk-blocked/30",
  },
}

export default function RiskBadge({ level }) {
  // Si le niveau est inconnu, on retombe sur "safe" par sécurité d'affichage.
  const config = RISK_CONFIG[level] ?? RISK_CONFIG.safe
  const { label, Icon, className } = config

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${className}`}
      // role="status" annonce le niveau aux lecteurs d'écran.
      role="status"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </span>
  )
}
