# app/crud/crud_user.py
# Toutes les requêtes liées à la table users. Ces fonctions sont "bêtes" :
# elles lisent/écrivent en base, sans jamais décider de logique métier
# (le hachage du mot de passe se fait AVANT d'appeler create_user, pas ici).

from sqlalchemy.orm import Session
from app.models.user import User


def get_user_by_id(db: Session, user_id: int) -> User | None:
    """Récupère un utilisateur par son id. Renvoie None s'il n'existe pas."""
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> User | None:
    """
    Récupère un utilisateur par son email — utilisé à deux endroits clés :
    - à l'inscription, pour vérifier qu'aucun compte n'utilise déjà cet email
    - à la connexion, pour retrouver le compte et vérifier le mot de passe
    """
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, username: str, email: str, hashed_password: str, role: str = "patient") -> User:
    """
    Crée un nouvel utilisateur en base.
    IMPORTANT : hashed_password doit déjà être haché AVANT d'arriver ici —
    cette fonction ne fait que stocker, elle ne hache jamais elle-même.
    Le hachage est une responsabilité de core/security.py, appelée depuis
    le service ou la route d'inscription.
    """
    db_user = User(
        username=username,
        email=email,
        hashed_password=hashed_password,
        role=role,
    )
    db.add(db_user)     # marque l'objet pour insertion
    db.commit()          # valide la transaction, écrit réellement en base
    db.refresh(db_user)  # recharge l'objet pour récupérer l'id généré par Postgres
    return db_user


def update_user_role(db: Session, user_id: int, new_role: str) -> User | None:
    """
    Modifie le rôle d'un utilisateur (ex: passer un compte de 'patient' à
    'medecin' après vérification manuelle). Utile pour une future route
    d'administration, pas dans le MVP immédiat mais prête si besoin.
    """
    db_user = get_user_by_id(db, user_id)
    if db_user is None:
        return None

    db_user.role = new_role
    db.commit()
    db.refresh(db_user)
    return db_user