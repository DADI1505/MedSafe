// import { Info } from "lucide-react"
// import RiskBadge from "./RiskBadge"
// import SourceCitation from "./SourceCitation"

// /*
//   ============================================================
//   AnswerCard — État de SUCCÈS (réponse "safe")
//   ============================================================
//   Affiche la réponse vulgarisée quand tout va bien :
//    - le badge de risque,
//    - le texte de la réponse,
//    - la liste des sources cliquables,
//    - l'avertissement légal (disclaimer).

//   Les cas "warning" / "blocked" sont gérés à part (SafetyNotice).
// */
// export default function AnswerCard({ result }) {
//   const { answer, risk_level, sources = [], disclaimer } = result

//   return (
//     <section className="rounded-card border border-line bg-surface p-6 shadow-sm" aria-live="polite">
//       {/* En-tête : badge de risque */}
//       <div className="mb-4">
//         <RiskBadge level={risk_level} />
//       </div>

//       {/* Réponse vulgarisée */}
//       <div className="prose-medsafe">
//         <p className="text-lg leading-relaxed text-ink">{answer}</p>
//       </div>

//       {/* Sources officielles */}
//       {sources.length > 0 && (
//         <div className="mt-6">
//           <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
//             Sources officielles ({sources.length})
//           </h3>
//           <div className="grid gap-3">
//             {sources.map((source, index) => (
//               <SourceCitation key={source.id ?? index} source={source} />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Avertissement légal (toujours affiché s'il existe) */}
//       {disclaimer && (
//         <p className="mt-6 flex items-start gap-2 rounded-xl bg-canvas p-4 text-sm text-muted">
//           <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
//           <span>{disclaimer}</span>
//         </p>
//       )}
//     </section>
//   )
// }


import { Info } from "lucide-react"
import RiskBadge from "./RiskBadge"
import SourceCitation from "./SourceCitation"
import { parseMarkdown } from "../utils/parseMarkdown"
import ReadAloudButton from "./ReadAloudButton"

export default function AnswerCard({ result }) {
  const { answer, risk_level, sources = [], disclaimer } = result

  return (
    <section className="rounded-card border border-line bg-surface p-6 shadow-sm" aria-live="polite">
      <div className="mb-4 flex items-center justify-between gap-3">
        <RiskBadge level={risk_level} />
         <ReadAloudButton text={answer} />
      </div>

      {/* Réponse vulgarisée — désormais formatée proprement */}
      <div className="prose-medsafe">
        {parseMarkdown(answer)}
      </div>

      {sources.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Sources officielles ({sources.length})
          </h3>
          <div className="grid gap-3">
            {sources.map((source, index) => (
              <SourceCitation key={source.id ?? index} source={source} />
            ))}
          </div>
        </div>
      )}

      {disclaimer && (
        <p className="mt-6 flex items-start gap-2 rounded-xl bg-canvas p-4 text-sm text-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{disclaimer}</span>
        </p>
      )}
    </section>
  )
}