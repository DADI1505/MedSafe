# Configure la connexion SQLAlchemy et fournit la session DB aux routes via Depends()

from sqlalchemy import create_engine  # crée le moteur de connexion à Postgres
from sqlalchemy.orm import sessionmaker, declarative_base  # gestion des sessions et base des modèles
from app.core.config import get_settings

settings = get_settings()

# Le "moteur" gère le pool de connexions vers Postgres
engine = create_engine(settings.DATABASE_URL)

# SessionLocal est une "fabrique" de sessions : chaque requête HTTP en obtiendra une nouvelle
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base est la classe dont hériteront tous les modèles SQLAlchemy (User, Drug, etc.)
Base = declarative_base()


def get_db():
    # Fonction de dépendance FastAPI : ouvre une session, la fournit à la route,
    # puis la ferme systématiquement même si une erreur survient (bloc finally)
    db = SessionLocal()
    try:
        yield db  # la route reçoit cette session via Depends(get_db)
    finally:
        db.close()  # évite les fuites de connexions