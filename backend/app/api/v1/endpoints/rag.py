# app/api/v1/endpoints/rag.py
# Route HTTP exposant le service RAG. Reste fine : aucune logique
# métier ici, tout est délégué au service.

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.rag_pydantic import RagAskRequest, RagAskResponse
from app.services.rag_service import process_rag_query
from app.api.deps import get_current_user_optional

router = APIRouter(prefix="/rag", tags=["rag"])


@router.post("/ask", response_model=RagAskResponse)
def ask_question(
    payload: RagAskRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_optional),  # None si anonyme
):
    return process_rag_query(
        db=db,
        query=payload.query,
        user_id=current_user.id if current_user else None,
        drug_context_id=payload.drug_context_id,
    )

