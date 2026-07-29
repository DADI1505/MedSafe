# app/models/drug_chunk.py
# Modèle ORM de la table drug_chunks : le pont entre le texte et FAISS

from sqlalchemy import Column, Integer, String, Text, ForeignKey, UniqueConstraint, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class DrugChunk(Base):
    __tablename__ = "drug_chunks"

    id = Column(Integer, primary_key=True, index=True)
    drug_id = Column(Integer, ForeignKey("drugs.id", ondelete="CASCADE"), nullable=False)
    section_type = Column(String(50), nullable=False, index=True)
    chunk_text = Column(Text, nullable=False)
    chunk_index = Column(Integer, nullable=False)
    faiss_vector_id = Column(Integer, unique=True, nullable=False, index=True)
    token_count = Column(Integer, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relation inverse : chunk.drug renvoie directement l'objet Drug parent
    drug = relationship("Drug", back_populates="chunks")

    # Contrainte d'unicité composite : traduit exactement le UNIQUE (drug_id, chunk_index) du SQL
    __table_args__ = (
        UniqueConstraint("drug_id", "chunk_index", name="uq_drug_chunk_order"),
    )