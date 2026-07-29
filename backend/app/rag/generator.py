
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

from google import genai
from google.genai import types
from app.core.config import get_settings
from app.rag.prompts import build_system_prompt, build_user_message

settings = get_settings()
client = genai.Client(api_key=settings.GEMINI_API_KEY)


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


def generate_answer(query: str, matched_chunks: list, risk_level: str) -> str:
    """
    Génère une réponse vulgarisée à partir du contexte récupéré,
    en respectant les garde-fous définis dans prompts.py.
    """
    if not matched_chunks:
        return (
            "Je n'ai trouvé aucune information pertinente dans les notices "
            "disponibles pour répondre à cette question. Merci de consulter "
            "un professionnel de santé ou un pharmacien."
        )

    context_text = build_context_text(matched_chunks)
    system_prompt = build_system_prompt(risk_level)
    user_message = build_user_message(query, context_text)

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=user_message,
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,  # équivalent du "system" chez Claude/OpenAI
            temperature=0.2,  # basse température : priorité à la précision
            max_output_tokens=500,
        ),
    )

    return response.text