# app/schemas/audit.py
# Schéma de sérialisation pour l'historique des questions (route /audit/history)

from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AuditLogOut(BaseModel):
    """Ce que l'API renvoie pour une entrée d'historique."""
    id: int
    query_text: str
    generated_response: Optional[str] = None
    risk_level: str
    created_at: datetime

    class Config:
        from_attributes = True