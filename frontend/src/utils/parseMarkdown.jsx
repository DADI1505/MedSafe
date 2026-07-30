// // src/utils/parseMarkdown.jsx
// // Convertit un texte markdown SIMPLE (titres ##, listes -, gras **) en JSX.
// // Volontairement minimaliste : pas de librairie externe, juste ce dont
// // on a besoin pour le format que renvoie notre prompt.

// export function parseMarkdown(text) {
//   if (!text) return null

//   const lines = text.split("\n")
//   const elements = []
//   let currentList = []

//   function flushList(key) {
//     if (currentList.length > 0) {
//       elements.push(
//         <ul key={`list-${key}`} className="ml-1 list-disc space-y-1.5 pl-4">
//           {currentList.map((item, i) => (
//             <li key={i} className="text-ink">{renderBold(item)}</li>
//           ))}
//         </ul>,
//       )
//       currentList = []
//     }
//   }

//   // Transforme **texte** en <strong>texte</strong>
//   function renderBold(str) {
//     const parts = str.split(/(\*\*.*?\*\*)/g)
//     return parts.map((part, i) =>
//       part.startsWith("**") && part.endsWith("**") ? (
//         <strong key={i} className="font-semibold text-brand">
//           {part.slice(2, -2)}
//         </strong>
//       ) : (
//         part
//       ),
//     )
//   }

//   lines.forEach((line, index) => {
//     const trimmed = line.trim()

//     if (trimmed.startsWith("## ")) {
//       flushList(index)
//       elements.push(
//         <h3 key={index} className="mt-4 mb-2 text-sm font-semibold uppercase tracking-wide text-brand-600 first:mt-0">
//           {trimmed.replace("## ", "")}
//         </h3>,
//       )
//     } else if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
//       currentList.push(trimmed.replace(/^[-•]\s*/, ""))
//     } else if (trimmed.length > 0) {
//       flushList(index)
//       elements.push(
//         <p key={index} className="leading-relaxed text-ink">
//           {renderBold(trimmed)}
//         </p>,
//       )
//     }
//   })

//   flushList("end")
//   return <div className="space-y-2">{elements}</div>
// }

// src/utils/parseMarkdown.jsx
// Convertit un texte markdown SIMPLE (titres ##, sous-titres ###,
// listes -, gras **) en JSX. Pas de librairie externe.

export function parseMarkdown(text) {
  if (!text) return null

  const lines = text.split("\n")
  const elements = []
  let currentList = []

  function flushList(key) {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="ml-1 list-disc space-y-1.5 pl-4">
          {currentList.map((item, i) => (
            <li key={i} className="text-ink">{renderBold(item)}</li>
          ))}
        </ul>,
      )
      currentList = []
    }
  }

  function renderBold(str) {
    const parts = str.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i} className="font-semibold text-brand">
          {part.slice(2, -2)}
        </strong>
      ) : (
        part
      ),
    )
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim()

    if (trimmed.startsWith("### ")) {
      // Sous-titre : vérifié AVANT "## " car "### " commence aussi par "## "
      flushList(index)
      elements.push(
        <h4 key={index} className="mt-3 mb-1 text-sm font-semibold text-ink first:mt-0">
          {trimmed.replace("### ", "")}
        </h4>,
      )
    } else if (trimmed.startsWith("## ")) {
      flushList(index)
      elements.push(
        <h3 key={index} className="mt-4 mb-2 text-sm font-semibold uppercase tracking-wide text-brand-600 first:mt-0">
          {trimmed.replace("## ", "")}
        </h3>,
      )
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      currentList.push(trimmed.replace(/^[-•]\s*/, ""))
    } else if (trimmed.length > 0) {
      flushList(index)
      elements.push(
        <p key={index} className="leading-relaxed text-ink">
          {renderBold(trimmed)}
        </p>,
      )
    }
  })

  flushList("end")
  return <div className="space-y-2">{elements}</div>
}