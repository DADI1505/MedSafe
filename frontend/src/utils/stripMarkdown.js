// src/utils/stripMarkdown.js
// Retire la syntaxe markdown d'un texte pour obtenir du texte brut,
// adapté à la lecture vocale (sinon la voix prononcerait "dièse dièse").

export function stripMarkdown(text) {
  if (!text) return ""

  return text
    .replace(/^#{1,6}\s+/gm, "")        // retire les ## et ### en début de ligne
    .replace(/\*\*(.+?)\*\*/g, "$1")     // retire le gras **texte** → texte
    .replace(/^[-•]\s+/gm, "")           // retire les puces de liste
    .replace(/\n{2,}/g, ". ")            // remplace les sauts de ligne multiples par une pause
    .replace(/\n/g, " ")                 // remplace les sauts de ligne simples par un espace
    .trim()
}