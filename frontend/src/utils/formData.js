// src/utils/formatDate.js
// Convertit le format openFDA "YYYYMMDD" en date lisible française.

export function formatEffectiveTime(rawDate) {
  if (!rawDate || rawDate.length !== 8) return null

  const year = rawDate.slice(0, 4)
  const month = rawDate.slice(4, 6)
  const day = rawDate.slice(6, 8)

  const date = new Date(`${year}-${month}-${day}`)
  if (isNaN(date.getTime())) return null

  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}