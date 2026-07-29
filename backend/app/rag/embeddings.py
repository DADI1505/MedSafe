# app/rag/embeddings.py
#
# Contient la logique de vectorisation (importable, utilisée par
# vector_store.py ET par le service RAG en temps réel). Peut aussi
# être exécuté seul pour un test rapide de vérification :
#   python -m app.rag.embeddings

from sentence_transformers import SentenceTransformer
from app.core.config import get_settings

settings = get_settings()

# Chargé une seule fois à l'import du module, pas à chaque appel
_model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)


def generate_embedding(text: str) -> list[float]:
    """Transforme un texte en vecteur d'embedding (liste de nombres)."""
    embedding = _model.encode(text)
    return embedding.tolist()


def generate_embeddings_batch(texts: list[str]) -> list[list[float]]:
    """Version optimisée pour vectoriser plusieurs textes d'un coup."""
    embeddings = _model.encode(texts)
    return embeddings.tolist()


# ──────────────────────────────────────────────────────────────
# Ce bloc sert uniquement à vérifier que le modèle se charge bien
# et produit des vecteurs cohérents, avant de lancer vector_store.py
# ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    test_text = "risque de saignement avec l'aspirine"
    vecteur = generate_embedding(test_text)

    print(f"Modèle chargé : {settings.EMBEDDING_MODEL_NAME}")
    print(f"Dimension du vecteur : {len(vecteur)}")
    print(f"5 premières valeurs : {vecteur[:5]}")
