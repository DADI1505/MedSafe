// import { TriangleAlert, ShieldX, Stethoscope } from "lucide-react"
// import RiskBadge from "./RiskBadge"
// import SourceCitation from "./SourceCitation"

// /*
//   ============================================================
//   SafetyNotice — États "warning" et "blocked"
//   ============================================================
//   Quand le backend juge la question sensible, il renvoie
//   risk_level = "warning" ou "blocked". Ici on affiche un message
//   clair et rassurant qui invite à consulter un professionnel de
//   santé — SANS jamais montrer d'erreur technique brute.
// */

// // Petits réglages d'affichage selon le niveau.
// const CONFIG = {
//   warning: {
//     Icon: TriangleAlert,
//     accent: "text-risk-warning",
//     ring: "border-risk-warning/30",
//     tint: "bg-risk-warning/5",
//     title: "Cette question demande de la prudence",
//   },
//   blocked: {
//     Icon: ShieldX,
//     accent: "text-risk-blocked",
//     ring: "border-risk-blocked/30",
//     tint: "bg-risk-blocked/5",
//     title: "Nous préférons ne pas répondre directement",
//   },
// }

// export default function SafetyNotice({ result }) {
//   const { answer, risk_level, sources = [], disclaimer } = result
//   const config = CONFIG[risk_level] ?? CONFIG.warning
//   const { Icon, accent, ring, tint, title } = config

//   return (
//     <section className={`rounded-card border ${ring} ${tint} p-6 shadow-sm`} role="alert" aria-live="assertive">
//       {/* En-tête avec badge + titre explicite */}
//       <div className="mb-4 flex flex-col gap-3">
//         <RiskBadge level={risk_level} />
//         <h2 className={`flex items-center gap-2 text-xl font-bold ${accent}`}>
//           <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
//           {title}
//         </h2>
//       </div>

//       {/* Message renvoyé par le backend (déjà vulgarisé) */}
//       {answer && <p className="text-base leading-relaxed text-ink">{answer}</p>}

//       {/* Appel à l'action : consulter un professionnel de santé */}
//       <div className="mt-5 flex items-start gap-3 rounded-xl border border-line bg-surface p-4">
//         <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600/10 text-brand-600">
//           <Stethoscope className="h-5 w-5" aria-hidden="true" />
//         </span>
//         <div>
//           <p className="font-semibold text-brand">Parlez-en à un professionnel de santé</p>
//           <p className="mt-1 text-sm text-muted">
//             Pour toute décision concernant votre traitement, rapprochez-vous de votre médecin ou de votre pharmacien.
//           </p>
//         </div>
//       </div>

//       {/* Sources, si le backend en fournit malgré le blocage */}
//       {sources.length > 0 && (
//         <div className="mt-6 grid gap-3">
//           {sources.map((source, index) => (
//             <SourceCitation key={source.id ?? index} source={source} />
//           ))}
//         </div>
//       )}

//       {disclaimer && <p className="mt-5 text-sm text-muted">{disclaimer}</p>}
//     </section>
//   )
// }
import { TriangleAlert, ShieldX, Stethoscope } from "lucide-react"
import RiskBadge from "./RiskBadge"
import SourceCitation from "./SourceCitation"
import { parseMarkdown } from "../utils/parseMarkdown"

const CONFIG = {
  warning: {
    Icon: TriangleAlert,
    accent: "text-risk-warning",
    ring: "border-risk-warning/30",
    tint: "bg-risk-warning/5",
    title: "Cette question demande de la prudence",
  },
  blocked: {
    Icon: ShieldX,
    accent: "text-risk-blocked",
    ring: "border-risk-blocked/30",
    tint: "bg-risk-blocked/5",
    title: "Nous préférons ne pas répondre directement",
  },
}

export default function SafetyNotice({ result }) {
  const { answer, risk_level, sources = [], disclaimer } = result
  const config = CONFIG[risk_level] ?? CONFIG.warning
  const { Icon, accent, ring, tint, title } = config

  return (
    <section className={`rounded-card border ${ring} ${tint} p-6 shadow-sm`} role="alert" aria-live="assertive">
      <div className="mb-4 flex flex-col gap-3">
        <RiskBadge level={risk_level} />
        <h2 className={`flex items-center gap-2 text-xl font-bold ${accent}`}>
          <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
          {title}
        </h2>
      </div>

      {answer && parseMarkdown(answer)}

      <div className="mt-5 flex items-start gap-3 rounded-xl border border-line bg-surface p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600/10 text-brand-600">
          <Stethoscope className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="font-semibold text-brand">Parlez-en à un professionnel de santé</p>
          <p className="mt-1 text-sm text-muted">
            Pour toute décision concernant votre traitement, rapprochez-vous de votre médecin ou de votre pharmacien.
          </p>
        </div>
      </div>

      {sources.length > 0 && (
        <div className="mt-6 grid gap-3">
          {sources.map((source, index) => (
            <SourceCitation key={source.id ?? index} source={source} />
          ))}
        </div>
      )}

      {disclaimer && <p className="mt-5 text-sm text-muted">{disclaimer}</p>}
    </section>
  )
}