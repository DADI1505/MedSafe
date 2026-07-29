# app/crud/crud_drug.py
# Requêtes liées aux tables drugs ET drug_chunks (elles n'ont pas de
# fichier crud séparé, car drug_chunks n'est jamais manipulé de façon
# autonome — toujours en lien avec un médicament ou une recherche RAG).

from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.drug import Drug
from app.models.drug_chunk import DrugChunk


def get_drug_by_id(db: Session, drug_id: int) -> Drug | None:
    """Récupère un médicament par son id interne."""
    return db.query(Drug).filter(Drug.id == drug_id).first()


def get_drug_by_set_id(db: Session, set_id: str) -> Drug | None:
    """
    Récupère un médicament par son set_id openFDA — utilisé par
    ingestion.py pour éviter de réimporter deux fois la même notice,
    et par la route GET /drugs/{set_id}.
    """
    return db.query(Drug).filter(Drug.set_id == set_id).first()


def search_drugs(db: Session, query: str, limit: int = 10) -> list[Drug]:
    """
    Recherche insensible à la casse sur le nom commercial OU la substance.
    ilike = "LIKE" insensible à la casse en PostgreSQL.
    Utilisée par la route GET /drugs/search?q=...
    """
    search_pattern = f"%{query}%"
    return (
        db.query(Drug)
        .filter(
            or_(
                Drug.brand_name.ilike(search_pattern),
                Drug.substance_name.ilike(search_pattern),
            )
        )
        .limit(limit)  # toujours limiter, pour ne jamais charger toute la table par erreur
        .all()
    )


def create_drug(db: Session, drug_data: dict) -> Drug:
    """
    Crée un nouveau médicament en base à partir d'un dictionnaire déjà
    normalisé (voir ingestion.py — normalize_drug_data()).
    """
    db_drug = Drug(**drug_data)
    db.add(db_drug)
    db.commit()
    db.refresh(db_drug)
    return db_drug


def get_all_drugs(db: Session) -> list[Drug]:
    """
    Récupère tous les médicaments en base. Utilisé par run_full_ingestion
    (chunking.py) pour parcourir chaque notice et la découper.
    Pas destiné à être exposé via une route — trop lourd si la base grossit.
    """
    return db.query(Drug).all()


# ────────────────────────────────────────────────────────────
# Fonctions liées à drug_chunks — regroupées ici plutôt que dans un
# fichier séparé, car toujours utilisées en lien avec un Drug ou avec
# une recherche RAG, jamais de façon totalement autonome
# ────────────────────────────────────────────────────────────

def get_chunks_by_faiss_ids(db: Session, faiss_ids: list[int]) -> list[DrugChunk]:
    """
    Fonction CRITIQUE pour le RAG : prend une liste de positions FAISS
    (renvoyées par vector_store.search_similar_chunks()) et récupère
    les fragments de texte réels correspondants, avec leur médicament
    d'origine déjà chargé (via la relation ORM chunk.drug).

    C'est l'étape qui transforme "des positions numériques abstraites"
    en "du texte lisible avec sa source" — utilisée par rag_service.py
    juste après l'appel à FAISS.
    """
    return (
        db.query(DrugChunk)
        .filter(DrugChunk.faiss_vector_id.in_(faiss_ids))
        .all()
    )


def create_drug_chunk(db: Session, chunk_data: dict) -> DrugChunk:
    """
    Crée un fragment en base. Utilisé par chunking.py pendant la Phase 0,
    jamais en temps réel (les chunks ne sont jamais créés pendant qu'un
    utilisateur pose une question).
    """
    db_chunk = DrugChunk(**chunk_data)
    db.add(db_chunk)
    db.commit()
    db.refresh(db_chunk)
    return db_chunk