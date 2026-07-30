# app/rag/risk_classifier.py
# Première ligne de défense : classifie une question AVANT toute recherche,
# pour bloquer les demandes de diagnostic ou de dosage personnalisé le
# plus tôt possible dans le pipeline.

import re

# Motifs indiquant une demande de dosage personnalisé ou de diagnostic —
# ces questions sont BLOQUÉES, aucune réponse générée
BLOCKED_PATTERNS = [
    r"combien de (comprimés|mg|ml|gouttes)",
    r"quelle dose",
    r"puis-je (donner|prendre).*(enfant|bébé|nourrisson)",
    r"est-ce que j'ai (une overdose|trop pris)",
    r"quel diagnostic",
    r"qu'est-ce que j'ai",
    r"suis-je (malade|en danger)",
]

# Motifs indiquant une question sensible mais pas bloquante —
# on répond, avec un avertissement renforcé dans le prompt
WARNING_PATTERNS = [
    r"interaction",
    r"grossesse|allaitement|enceinte",
    r"contre-indication",
    r"effet secondaire",
    r"surdosage",
    
]


def classify_risk(query: str) -> str:
    """
    Renvoie 'blocked', 'warning' ou 'safe' selon le contenu de la question.
    La vérification des motifs bloquants est TOUJOURS faite en premier —
    priorité absolue à la sécurité.
    """
    normalized = query.lower()

    for pattern in BLOCKED_PATTERNS:
        if re.search(pattern, normalized):
            return "blocked"

    for pattern in WARNING_PATTERNS:
        if re.search(pattern, normalized):
            return "warning"

    return "safe"


def get_blocked_reason() -> str:
    """Message renvoyé à l'utilisateur quand risk_level == 'blocked'."""
    return (
        "Cette question relève d'un diagnostic ou d'une posologie "
        "personnalisée. Merci de consulter un professionnel de santé."
    )