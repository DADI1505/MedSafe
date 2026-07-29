# Gère le chargement centralisé de toute la configuration de l'app
# depuis les variables d'environnement, avec validation automatique via Pydantic
import os
from pydantic_settings import BaseSettings  # extension Pydantic dédiée à la config
from functools import lru_cache  # pour ne créer l'objet Settings qu'une seule fois

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENV_PATH = os.path.join(BASE_DIR, ".env")

class Settings(BaseSettings):
    # --- Base de données ---
    DATABASE_URL: str  # ex: postgresql://user:pass@host:5432/medsafe_db

    # --- Sécurité / Auth ---
    SECRET_KEY: str  # clé utilisée pour signer les JWT, jamais en dur dans le code
    ALGORITHM: str = "HS256"  # algorithme de signature des tokens
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60  # durée de vie d'un token

    # --- RAG / LLM ---
    GEMINI_API_KEY: str  # clé API pour le LLM de génération
    FAISS_INDEX_PATH: str = "data/faiss_index/medsafe.index"  # chemin de l'index vectoriel
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"  # modèle d'embeddings utilisé

    # --- openFDA ---
    OPENFDA_BASE_URL: str = "https://api.fda.gov/drug/label.json"  # endpoint source

    # --- CORS ---
    FRONTEND_ORIGIN: str = "http://localhost:3000"  # origine autorisée en dev

    class Config:
        env_file = ENV_PATH  # indique à Pydantic de lire le fichier .env local


@lru_cache()  # met en cache le résultat : un seul objet Settings pour toute l'app
def get_settings() -> Settings:
    # Cette fonction est appelée via Depends() dans les routes qui ont besoin
    # de la config, ce qui permet de la mocker facilement dans les tests
    return Settings()