import { FileText, ExternalLink } from "lucide-react"

/*
  ============================================================
  SourceCitation — Citation d'une source officielle
  ============================================================
  Affiche une source (notice openFDA) sous forme de carte cliquable.
  Rassure l'utilisateur : chaque réponse est appuyée par une source.

  Props attendues (chaque source de l'API) :
   - title : nom de la notice / du médicament
   - url   : lien vers la source (optionnel)
   - snippet : court extrait cité (optionnel)
*/
// export default function SourceCitation({ source }) {
//   const { title, url, snippet } = source

//   // Contenu interne réutilisé, que la source soit un lien ou non.
//   const content = (
//     <div className="flex items-start gap-3">
//       <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600/10 text-brand-600">
//         <FileText className="h-5 w-5" aria-hidden="true" />
//       </span>
//       <div className="min-w-0">
//         <p className="flex items-center gap-1.5 font-medium text-brand">
//           {title}
//           {url && <ExternalLink className="h-3.5 w-3.5 text-muted" aria-hidden="true" />}
//         </p>
//         {snippet && <p className="mt-1 line-clamp-2 text-sm text-muted">{snippet}</p>}
//       </div>
//     </div>
//   )

//   // Si une URL est fournie, on rend un lien accessible ; sinon une simple carte.
//   if (url) {
//     return (
//       <a
//         href={url}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="block rounded-xl border border-line bg-surface p-4 transition-colors hover:border-brand-600/40 hover:bg-canvas"
//       >
//         {content}
//       </a>
//     )
//   }

//   return <div className="rounded-xl border border-line bg-surface p-4">{content}</div>
// }

// src/components/SourceCitation.jsx — adapté aux vrais champs backend

export default function SourceCitation({ source }) {
  const { brand_name, section_type, excerpt } = source

  const content = (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600/10 text-brand-600">
        <FileText className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="font-medium text-brand">
          {brand_name} — {section_type}
        </p>
        {excerpt && <p className="mt-1 line-clamp-2 text-sm text-muted">{excerpt}</p>}
      </div>
    </div>
  )

  return <div className="rounded-xl border border-line bg-surface p-4">{content}</div>
}
