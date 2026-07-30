// src/utils/sectionLabels.js
// Traduit les section_type techniques (venant du backend, en anglais)
// vers un libellé français lisible pour l'affichage.

const SECTION_LABELS = {
  warnings: "Avertissements",
  contraindications: "Contre-indications",
  dosage: "Posologie",
  interactions: "Interactions médicamenteuses",
  adverse_reactions: "Effets indésirables",
  pregnancy: "Grossesse et allaitement",
}

export function translateSectionType(sectionType) {
  return SECTION_LABELS[sectionType] || sectionType
}