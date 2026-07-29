# app/models/audit_log.py
# Modèle ORM de la table audit_logs : la traçabilité de chaque question posée

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import JSONB  # type JSON natif PostgreSQL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    # nullable=True : un utilisateur anonyme peut poser une question
    # ondelete="SET NULL" : si le compte est supprimé, le log reste mais sans lien utilisateur
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    query_text = Column(Text, nullable=False)
    generated_response = Column(Text, nullable=True)  # NULL si la question a été bloquée

    # JSONB : stocke une liste de chunk_id directement en JSON, interrogeable
    # nativement par PostgreSQL (contrairement à un simple Text)
    sources_used = Column(JSONB, nullable=True)

    risk_level = Column(String(20), nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now(), index=True)

    # Relation inverse : audit_log.user renvoie l'objet User complet
    user = relationship("User", back_populates="audit_logs")