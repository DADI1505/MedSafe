# app/crud/crud_audit.py
# Requêtes liées à la table audit_logs — la traçabilité de chaque question.

from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog


def create_audit_log(
    db: Session,
    user_id: int | None,
    query_text: str,
    generated_response: str | None,
    sources_used: list[int],
    risk_level: str,
) -> AuditLog:
    """
    Enregistre une entrée d'audit. Appelée systématiquement par
    rag_service.py, que la question ait été bloquée, avertie, ou
    traitée normalement — AUCUNE question ne doit passer sans être
    journalisée, c'est une exigence de sécurité du projet.
    """
    db_log = AuditLog(
        user_id=user_id,
        query_text=query_text,
        generated_response=generated_response,
        sources_used=sources_used,  # stocké directement en JSONB, pas besoin de json.dumps()
        risk_level=risk_level,
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


def get_user_history(db: Session, user_id: int, limit: int = 50) -> list[AuditLog]:
    """
    Récupère l'historique d'un utilisateur, trié du plus récent au plus
    ancien. Utilisée par la route GET /audit/history.
    """
    return (
        db.query(AuditLog)
        .filter(AuditLog.user_id == user_id)
        .order_by(AuditLog.created_at.desc())  # le plus récent en premier
        .limit(limit)
        .all()
    )


def get_blocked_queries_count(db: Session) -> int:
    """
    Compte le nombre total de questions bloquées. Utile pour un futur
    tableau de bord admin ("combien de questions à risque cette semaine"),
    pas indispensable au MVP mais peu coûteux à avoir dès maintenant.
    """
    return db.query(AuditLog).filter(AuditLog.risk_level == "blocked").count()