
# app/rag/generator.py
# Appelle l'API Claude (Anthropic) avec le contexte récupéré par FAISS,
# et assemble la réponse finale.

# import anthropic
# from app.core.config import get_settings
# from app.rag.prompts import build_system_prompt, build_user_message

# settings = get_settings()
# client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)


# def build_context_text(matched_chunks: list) -> str:
#     """
#     Assemble le texte de contexte à partir des chunks trouvés par FAISS,
#     en indiquant clairement la source de chaque extrait.
#     """
#     context_parts = []
#     for chunk in matched_chunks:
#         part = f"[Source : {chunk.drug.brand_name} — section {chunk.section_type}]\n{chunk.chunk_text}"
#         context_parts.append(part)
#     return "\n\n---\n\n".join(context_parts)


# def generate_answer(query: str, matched_chunks: list, risk_level: str) -> str:
#     """
#     Génère une réponse vulgarisée à partir du contexte récupéré,
#     en respectant les garde-fous définis dans prompts.py.
#     """
#     if not matched_chunks:
#         # Aucun résultat pertinent trouvé dans FAISS — on ne force pas
#         # le LLM à inventer une réponse
#         return (
#             "Je n'ai trouvé aucune information pertinente dans les notices "
#             "disponibles pour répondre à cette question. Merci de consulter "
#             "un professionnel de santé ou un pharmacien."
#         )

#     context_text = build_context_text(matched_chunks)
#     system_prompt = build_system_prompt(risk_level)
#     user_message = build_user_message(query, context_text)

#     response = client.messages.create(
#         model="claude-sonnet-4-6",
#         max_tokens=500,
#         temperature=0.2,  # basse température : priorité à la précision, pas à la créativité
#         system=system_prompt,  # le prompt système passe dans un paramètre dédié, pas dans messages
#         messages=[
#             {"role": "user", "content": user_message},
#         ],
#     )

#     # response.content est une liste de blocs (texte, tool_use...) —
#     # on récupère le texte du premier bloc, qui est notre réponse
#     return response.content[0].text

# app/rag/generator.py
# Appelle Gemini (Google) avec le contexte récupéré par FAISS, et
# assemble la réponse finale.

# from google import genai
# from google.genai import types
from app.core.config import get_settings
from app.rag.prompts import build_system_prompt, build_user_message

# settings = get_settings()
# client = genai.Client(api_key=settings.GEMINI_API_KEY)

import re  # ajoute cet import en haut du fichier si absent


def build_context_text(matched_chunks: list) -> str:
    """
    Assemble le texte de contexte à partir des chunks trouvés par FAISS,
    en indiquant clairement la source de chaque extrait.
    """
    context_parts = []
    for chunk in matched_chunks:
        part = f"[Source : {chunk.drug.brand_name} — section {chunk.section_type}]\n{chunk.chunk_text}"
        context_parts.append(part)
    return "\n\n---\n\n".join(context_parts)


# def generate_answer(query: str, matched_chunks: list, risk_level: str) -> str:
#     """
#     Génère une réponse vulgarisée à partir du contexte récupéré,
#     en respectant les garde-fous définis dans prompts.py.
#     """
#     if not matched_chunks:
#         return (
#             "Je n'ai trouvé aucune information pertinente dans les notices "
#             "disponibles pour répondre à cette question. Merci de consulter "
#             "un professionnel de santé ou un pharmacien."
#         )

#     context_text = build_context_text(matched_chunks)
#     system_prompt = build_system_prompt(risk_level)
#     user_message = build_user_message(query, context_text)

#     response = client.models.generate_content(
#         model="gemini-flash-latest",
#         contents=user_message,
#         config=types.GenerateContentConfig(
#             system_instruction=system_prompt,  # équivalent du "system" chez Claude/OpenAI
#             temperature=0.2,  # basse température : priorité à la précision
#             max_output_tokens=500,
#         ),
#     )

#     return response.text


# def generate_answer(query: str, matched_chunks: list, risk_level: str) -> str:
#     if not matched_chunks:
#         return (
#             "Je n'ai trouvé aucune information pertinente dans les notices "
#             "disponibles pour répondre à cette question. Merci de consulter "
#             "un professionnel de santé ou un pharmacien."
#         )

#     context_text = build_context_text(matched_chunks)
#     system_prompt = build_system_prompt(risk_level)
#     user_message = build_user_message(query, context_text)

#     response = client.models.generate_content(
#         model="gemini-flash-lite",
#         contents=user_message,
#         config=types.GenerateContentConfig(
#             system_instruction=system_prompt,
#             temperature=0.2,
#             max_output_tokens=2000,  # augmenté par sécurité
#             thinking_config=types.ThinkingConfig(thinking_budget=0),
#         ),
#     )

#     # DIAGNOSTIC : affiche pourquoi la génération s'est arrêtée
#     if response.candidates:
#         finish_reason = response.candidates[0].finish_reason
#         print(f"[DEBUG] finish_reason = {finish_reason}")

#     if not response.text:
#         return (
#             "La réponse n'a pas pu être générée correctement. "
#             "Merci de reformuler votre question ou de réessayer."
#         )

#     return response.text


# def translate_excerpts(matched_chunks: list) -> list[str]:
#     """
#     Traduit en français les extraits de sources, pour l'affichage
#     dans les citations. Un seul appel groupé pour tous les extraits,
#     plutôt qu'un appel par extrait (économise latence et coût).
#     """
#     if not matched_chunks:
#         return []

#     excerpts = [chunk.chunk_text[:200] for chunk in matched_chunks]
#     numbered_excerpts = "\n".join(f"{i+1}. {ex}" for i, ex in enumerate(excerpts))

#     prompt = f"""Traduis chaque extrait suivant en français, de façon concise et fidèle. Réponds UNIQUEMENT avec les traductions numérotées, dans le même ordre, sans commentaire ni introduction :

# {numbered_excerpts}"""

#     response = client.models.generate_content(
#         model="gemini-3.5-flash",
#         contents=prompt,
#         config=types.GenerateContentConfig(
#             temperature=0.1,
#             max_output_tokens=1000,
#             thinking_config=types.ThinkingConfig(thinking_budget=0),
#         ),
#     )

#     if not response.text:
#         return excerpts  # repli : renvoie les extraits en anglais si la traduction échoue

#     # Parse les lignes numérotées "1. texte", "2. texte"...
#     lines = response.text.strip().split("\n")
#     translated = []
#     for line in lines:
#         cleaned = line.strip()
#         # Retire le préfixe "1. " ou "1) " etc.
#         parts = cleaned.split(". ", 1)
#         translated.append(parts[1] if len(parts) == 2 else cleaned)

#     # Sécurité : si le nombre de lignes traduites ne correspond pas,
#     # on retombe sur les extraits anglais plutôt que de risquer un décalage
#     if len(translated) != len(excerpts):
#         return excerpts

#     return translated

# app/rag/generator.py
# app/rag/generator.py
# Génère la réponse via Groq (gratuit, cloud, rapide — modèles open
# source comme Llama hébergés par Groq).

import re
from groq import Groq
from app.core.config import get_settings
from app.rag.prompts import build_system_prompt, build_user_message

settings = get_settings()
client = Groq(api_key=settings.GROQ_API_KEY)


def generate_answer_and_translations(query: str, matched_chunks: list, risk_level: str) -> tuple[str, list[str]]:
    """
    Génère la réponse structurée ET les traductions des sources en un
    seul appel Groq, pour limiter la consommation de quota.
    """
    if not matched_chunks:
        fallback = (
            "Je n'ai trouvé aucune information pertinente dans les notices "
            "disponibles pour répondre à cette question. Merci de consulter "
            "un professionnel de santé ou un pharmacien."
        )
        return fallback, []

    system_prompt = build_system_prompt(risk_level)
    user_message = build_user_message(query, "", matched_chunks)

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        temperature=0.2,
        max_tokens=1500,
    )

    full_text = response.choices[0].message.content

    if not full_text:
        return "La réponse n'a pas pu être générée.", [c.chunk_text[:200] for c in matched_chunks]

    # Sépare la réponse principale de la section "## Sources"
    if "## Sources" in full_text:
        answer_part, sources_part = full_text.split("## Sources", 1)
    else:
        answer_part, sources_part = full_text, ""

    translations = re.findall(r"\[EXTRAIT_\d+\]:\s*(.+)", sources_part)

    if len(translations) != len(matched_chunks):
        translations = [c.chunk_text[:200] for c in matched_chunks]

    return answer_part.strip(), translations

# def translate_excerpts(matched_chunks: list) -> list[str]:
    if not matched_chunks:
        return []

    excerpts = [chunk.chunk_text[:200] for chunk in matched_chunks]
    numbered_excerpts = "\n".join(f"{i+1}. {ex}" for i, ex in enumerate(excerpts))

    prompt = f"""Traduis chaque extrait suivant en français, de façon concise et fidèle. Réponds UNIQUEMENT avec les traductions numérotées, dans le même ordre, sans commentaire ni introduction :

{numbered_excerpts}"""

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.1,
            max_output_tokens=1000,
            thinking_config=types.ThinkingConfig(thinking_budget=0),
        ),
    )

    print(f"[DEBUG TRANSLATE] response.text = {repr(response.text)}")

    if not response.text:
        print("[DEBUG TRANSLATE] Pas de texte reçu, repli sur l'anglais")
        return excerpts

    # Découpe sur le motif "N. " précédé d'un début de texte ou d'un saut de ligne,
    # plutôt que sur CHAQUE saut de ligne — évite de couper une traduction
    # qui contient elle-même des lignes vides ou des points internes
    raw_text = response.text.strip()
    # re.split avec un groupe capturant garde les numéros, donc on filtre
    # ensuite pour ne garder que les morceaux de texte (pas les numéros)
    parts = re.split(r"\n*\d+\.\s+", raw_text)
    # Le premier élément est toujours une chaîne vide (avant "1. "), on l'enlève
    translated = [p.strip().replace("\n", " ") for p in parts if p.strip()]

    print(f"[DEBUG TRANSLATE] {len(translated)} traductions vs {len(excerpts)} extraits")

    if len(translated) != len(excerpts):
        print("[DEBUG TRANSLATE] Décompte différent, repli sur l'anglais")
        return excerpts

    return translated