# app/api/deps.py
# Dépendances FastAPI partagées entre plusieurs routes.
# get_current_user et get_current_user_optional sont utilisées via
# Depends() dans les routes qui ont besoin de savoir qui fait la requête.

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_access_token
from app.crud.crud_user import get_user_by_id
from app.models.user import User

# OAuth2PasswordBearer dit à FastAPI où chercher le token : dans le header
# "Authorization: Bearer <token>". tokenUrl pointe vers ta route de login
# (sert surtout à la doc interactive /docs, pas au fonctionnement réel)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Dépendance STRICTE : exige un token valide, sinon lève une erreur 401.
    À utiliser sur les routes qui nécessitent obligatoirement d'être connecté
    (ex: consulter son propre historique).
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Impossible de valider les identifiants",
        headers={"WWW-Authenticate": "Bearer"},
    )

    user_id = decode_access_token(token)
    if user_id is None:
        raise credentials_exception

    user = get_user_by_id(db, user_id)
    if user is None:
        raise credentials_exception

    return user


def get_current_user_optional(
    db: Session = Depends(get_db),
    token: str | None = Depends(OAuth2PasswordBearer(tokenUrl="api/v1/auth/login", auto_error=False)),
) -> User | None:
    """
    Dépendance SOUPLE : renvoie l'utilisateur s'il est connecté, ou None
    sinon — ne lève JAMAIS d'erreur. Utilisée sur /rag/ask, qui doit
    fonctionner aussi bien pour un utilisateur anonyme que connecté.
    auto_error=False empêche FastAPI de rejeter automatiquement si aucun
    token n'est fourni.
    """
    if token is None:
        return None

    user_id = decode_access_token(token)
    if user_id is None:
        return None

    return get_user_by_id(db, user_id)