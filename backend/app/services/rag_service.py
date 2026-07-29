# app/services/rag_service.py
# Chef d'orchestre : combine classification du risque, recherche
# vectorielle, génération LLM et journalisation.

from sqlalchemy.orm import Session
from app.rag.risk_classifier import classify_risk, get_blocked_reason
from app.rag.vector_store import search_similar_chunks
from app.rag.generator import generate_answer
from app.crud.crud_drug import get_chunks_by_faiss_ids
from app.crud.crud_audit import create_audit_log
from app.schemas.rag_pydantic import RagAskResponse, SourceCitation


def process_rag_query(
    db: Session,
    query: str,
    user_id: int | None,
    drug_context_id: str | None = None,
) -> RagAskResponse:
    """
    Traite une question de bout en bout :
    1. Classification du risque
    2. Si bloqué -> journalisation et arrêt immédiat
    3. Sinon -> recherche FAISS, génération LLM, journalisation, réponse
    """
    # ── Étape 1 : classification du risque, AVANT toute recherche coûteuse ──
    risk_level = classify_risk(query)

    if risk_level == "blocked":
        create_audit_log(
            db,
            user_id=user_id,
            query_text=query,
            generated_response=None,
            sources_used=[],
            risk_level="blocked",
        )
        return RagAskResponse(
            risk_level="blocked",
            reason=get_blocked_reason(),
        )

    # ── Étape 2 : recherche des chunks pertinents dans FAISS ──
    faiss_positions = search_similar_chunks(query, top_k=5)
    matched_chunks = get_chunks_by_faiss_ids(db, faiss_positions)

    # ── Étape 3 : génération de la réponse par le LLM ──
    answer_text = generate_answer(query, matched_chunks, risk_level)

    # ── Étape 4 : construction des citations pour le frontend ──
    sources = [
        SourceCitation(
            drug_id=chunk.drug_id,
            brand_name=chunk.drug.brand_name,
            section_type=chunk.section_type,
            chunk_id=chunk.id,
            excerpt=chunk.chunk_text[:200],  # extrait tronqué, pas le texte entier
        )
        for chunk in matched_chunks
    ]

    # ── Étape 5 : journalisation systématique ──
    create_audit_log(
        db,
        user_id=user_id,
        query_text=query,
        generated_response=answer_text,
        sources_used=[s.chunk_id for s in sources],
        risk_level=risk_level,
    )

    return RagAskResponse(
        risk_level=risk_level,
        answer=answer_text,
        sources=sources,
    )