# app/api/v1/endpoints/auth.py
# Routes d'authentification : inscription et connexion.

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.crud.crud_user import get_user_by_email, create_user
from app.schemas.user_pydantic import UserCreate, UserOut, UserLogin
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    """
    Crée un nouveau compte utilisateur.
    - Vérifie que l'email n'est pas déjà utilisé (crud_user)
    - Hache le mot de passe (security.py) — jamais stocké en clair
    - Enregistre le nouvel utilisateur (crud_user)
    """
    existing_user = get_user_by_email(db, payload.email)
    if existing_user:
        # 400 = Bad Request : la requête est valide dans sa forme,
        # mais rejetée pour une raison métier (email déjà pris)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cet email est déjà utilisé.",
        )

    hashed = hash_password(payload.password)

    new_user = create_user(
        db,
        username=payload.username,
        email=payload.email,
        hashed_password=hashed,
        role=payload.role,
    )

    # response_model=UserOut garantit que hashed_password n'est JAMAIS
    # renvoyé dans la réponse, même si on renvoie l'objet ORM complet ici
    # return new_user
    access_token = create_access_token(user_id=new_user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserOut.model_validate(new_user),
    }


@router.post("/login")
def login(payload: UserLogin, db: Session = Depends(get_db)):
    """
    Authentifie un utilisateur et renvoie un token JWT.
    Le principe : on ne déchiffre jamais le mot de passe stocké, on
    re-hache celui fourni et on compare les deux hashs (verify_password).
    """
    user = get_user_by_email(db, payload.email)

    # Volontairement le MÊME message d'erreur, que ce soit l'email qui
    # n'existe pas OU le mot de passe qui est faux — ne jamais révéler
    # lequel des deux est incorrect, ça faciliterait le piratage de comptes
    invalid_credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Email ou mot de passe incorrect.",
    )

    if user is None:
        raise invalid_credentials_error

    if not verify_password(payload.password, user.hashed_password):
        raise invalid_credentials_error

    access_token = create_access_token(user_id=user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserOut.model_validate(user),
    }

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Renvoie l'utilisateur actuellement connecté, à partir du token JWT.
    Appelée par le frontend au chargement de la page pour vérifier
    si un token déjà stocké est encore valide.
    """
    return current_user