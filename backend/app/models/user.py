# app/models/user.py
# Modèle ORM de la table users : traduit la table SQL en classe Python
# manipulable directement (user.email au lieu d'écrire du SQL à la main)

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func  # func.now() = équivalent de NOW() en SQL
from app.core.database import Base


class User(Base):
    __tablename__ = "users"  # nom exact de la table en base

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="patient")
    created_at = Column(DateTime, server_default=func.now())
    # server_default (et non default) : c'est PostgreSQL qui calcule la date,
    # pas Python — plus fiable si plusieurs serveurs génèrent des utilisateurs

    # Relation ORM : permet d'écrire user.audit_logs pour récupérer tout
    # l'historique de cet utilisateur, sans écrire de requête SQL manuelle
    audit_logs = relationship("AuditLog", back_populates="user")