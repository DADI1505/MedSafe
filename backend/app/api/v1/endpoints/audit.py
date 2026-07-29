# app/api/v1/endpoints/audit.py
# Route de consultation de l'historique des questions posées.

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user  # dépendance STRICTE : login obligatoire
from app.crud.crud_audit import get_user_history
from app.schemas.audit_pydantic import AuditLogOut
from app.models.user import User

router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("/history", response_model=list[AuditLogOut])
def get_history(
    db: Session = Depends(get_db),
    # Contrairement à /rag/ask, cette route EXIGE d'être connecté —
    # on ne peut pas consulter un historique sans savoir de qui il s'agit
    current_user: User = Depends(get_current_user),
):
    """
    Renvoie l'historique des questions posées par l'utilisateur connecté,
    du plus récent au plus ancien.
    """
    history = get_user_history(db, user_id=current_user.id)
    return history