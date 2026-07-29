
# app/rag/vector_store.py
#
# Encapsule FAISS (importable, utilisé en temps réel par rag_service.py
# pour la recherche). Peut aussi être exécuté seul pour construire
# l'index complet à partir des chunks déjà en base :
#   python -m app.rag.vector_store

import faiss
import numpy as np
from sqlalchemy.orm import Session
from app.core.config import get_settings
from app.rag.embeddings import generate_embedding, generate_embeddings_batch

settings = get_settings()
_faiss_index = None
EMBEDDING_DIMENSION = 384


def create_new_index() -> faiss.Index:
    """Crée un index FAISS vide (comparaison simple par distance euclidienne)."""
    return faiss.IndexFlatL2(EMBEDDING_DIMENSION)


def build_index_from_chunks(chunks_with_text: list[dict]) -> faiss.Index:
    """Construit un index FAISS à partir d'une liste de chunks avec leur texte."""
    index = create_new_index()
    texts = [c["chunk_text"] for c in chunks_with_text]
    embeddings = generate_embeddings_batch(texts)
    embeddings_array = np.array(embeddings).astype("float32")
    index.add(embeddings_array)
    return index


def save_index(index: faiss.Index, path: str):
    """Sauvegarde l'index FAISS sur disque."""
    faiss.write_index(index, path)
    print(f"Index sauvegardé dans {path}")


def load_faiss_index(path: str):
    """Charge l'index en mémoire — appelé au démarrage du serveur FastAPI."""
    global _faiss_index
    _faiss_index = faiss.read_index(path)
    print(f"Index FAISS chargé : {_faiss_index.ntotal} vecteurs disponibles")


def search_similar_chunks(query_text: str, top_k: int = 5) -> list[int]:
    """Recherche les k chunks les plus proches d'une question (temps réel)."""
    if _faiss_index is None:
        raise RuntimeError("Index FAISS non chargé. Appelle load_faiss_index() d'abord.")

    query_vector = generate_embedding(query_text)
    query_array = np.array([query_vector]).astype("float32")
    distances, positions = _faiss_index.search(query_array, top_k)
    return positions[0].tolist()


# def build_index_from_db(db: Session) -> faiss.Index:
    """
    Reconstruit l'index FAISS à partir de TOUS les chunks déjà en base
    (table drug_chunks), dans l'ordre de leur faiss_vector_id.
    """
    from app.models.drug_chunk import DrugChunk

    all_chunks = db.query(DrugChunk).order_by(DrugChunk.faiss_vector_id).all()

    if not all_chunks:
        print("Aucun chunk en base. Lance d'abord chunking.py.")
        return None

    chunks_with_text = [{"chunk_text": c.chunk_text} for c in all_chunks]
    print(f"Construction de l'index à partir de {len(chunks_with_text)} chunks...")

    return build_index_from_chunks(chunks_with_text)
def build_index_from_db(db: Session) -> faiss.Index:
    """
    Reconstruit l'index FAISS à partir de TOUS les chunks déjà en base
    (table drug_chunks), dans l'ordre de leur faiss_vector_id.
    """
    from app.models.drug_chunk import DrugChunk
    from app.models.drug import Drug  # AJOUT — nécessaire pour que SQLAlchemy
                                        # puisse résoudre la relationship("Drug")
                                        # définie dans DrugChunk

    all_chunks = db.query(DrugChunk).order_by(DrugChunk.faiss_vector_id).all()

    if not all_chunks:
        print("Aucun chunk en base. Lance d'abord chunking.py.")
        return None

    chunks_with_text = [{"chunk_text": c.chunk_text} for c in all_chunks]
    print(f"Construction de l'index à partir de {len(chunks_with_text)} chunks...")

    return build_index_from_chunks(chunks_with_text)

# ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import os
    from app.core.database import SessionLocal

    db = SessionLocal()
    try:
        index = build_index_from_db(db)
        if index is not None:
            os.makedirs(os.path.dirname(settings.FAISS_INDEX_PATH), exist_ok=True)
            save_index(index, settings.FAISS_INDEX_PATH)
            print(f"Phase 0 terminée : {index.ntotal} vecteurs indexés.")
    except Exception as e:
        print(f"Erreur pendant la construction de l'index : {e}")
    finally:
        db.close()