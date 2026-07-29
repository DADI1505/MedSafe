# app/models/drug.py
# Modèle ORM de la table drugs : les métadonnées des notices openFDA

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Drug(Base):
    __tablename__ = "drugs"

    id = Column(Integer, primary_key=True, index=True)
    set_id = Column(String(100), unique=True, nullable=False)
    brand_name = Column(String(255), nullable=False, index=True)
    substance_name = Column(String(255), nullable=False, index=True)
    effective_time = Column(String(20), nullable=True)
    raw_json_path = Column(String(500), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relation ORM : drug.chunks renvoie automatiquement tous les fragments
    # liés à ce médicament, sans écrire de JOIN manuel
    chunks = relationship("DrugChunk", back_populates="drug", cascade="all, delete-orphan")
    # cascade="all, delete-orphan" : si tu supprimes un Drug en Python, ses
    # chunks sont supprimés automatiquement aussi (reflète le ON DELETE CASCADE du SQL)