# app/schemas/rag.py
# Schémas de validation/sérialisation pour la route /rag/ask

from pydantic import BaseModel, Field
from typing import Optional, Literal


class RagAskRequest(BaseModel):
    """Ce que le frontend envoie pour poser une question."""
    query: str = Field(..., min_length=3, max_length=500)
    drug_context_id: Optional[str] = None


class SourceCitation(BaseModel):
    """Une source citée dans la réponse, affichée côté frontend."""
    drug_id: int
    brand_name: str
    section_type: str
    chunk_id: int
    excerpt: str
    effective_time: str | None = None 


class RagAskResponse(BaseModel):
    """Ce que l'API renvoie après traitement d'une question."""
    risk_level: Literal["safe", "warning", "blocked"]
    answer: Optional[str] = None
    sources: list[SourceCitation] = []
    reason: Optional[str] = None
    disclaimer: str = "Cette information ne remplace pas un avis médical professionnel."