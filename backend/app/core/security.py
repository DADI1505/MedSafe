# # app/core/security.py
# # Gère le hachage des mots de passe et les tokens JWT

# from passlib.context import CryptContext  # pip install passlib[bcrypt]
# from datetime import datetime, timedelta
# from jose import jwt  # pip install python-jose[cryptography]
# from app.core.config import get_settings

# settings = get_settings()

# # CryptContext gère l'algorithme de hachage (bcrypt) et sa configuration
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# def hash_password(plain_password: str) -> str:
#     """Transforme un mot de passe en clair en hash sécurisé, à stocker en base."""
#     return pwd_context.hash(plain_password)


# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     """
#     Vérifie qu'un mot de passe en clair correspond à un hash stocké.
#     Utilisé à la connexion : on ne déchiffre JAMAIS le hash, on re-hache
#     le mot de passe tapé et on compare les deux hashs.
#     """
#     return pwd_context.verify(plain_password, hashed_password)


# def create_access_token(user_id: int) -> str:
#     """Génère un token JWT signé, contenant l'id de l'utilisateur et une expiration."""
#     expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
#     to_encode = {"sub": str(user_id), "exp": expire}
#     return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


# def decode_access_token(token: str) -> int | None:
#     """Décode un token JWT et renvoie l'id utilisateur, ou None si invalide/expiré."""
#     try:
#         payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
#         return int(payload.get("sub"))
#     except Exception:
#         return None
# app/core/security.py
# Gère le hachage des mots de passe (bcrypt direct, sans passlib) et les tokens JWT

import bcrypt
from datetime import datetime, timedelta
from jose import jwt
from app.core.config import get_settings

settings = get_settings()


def hash_password(plain_password: str) -> str:
    """
    Hache un mot de passe avec bcrypt.
    bcrypt travaille sur des bytes, pas des strings — d'où les .encode()/.decode().
    """
    password_bytes = plain_password.encode("utf-8")
    hashed_bytes = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    return hashed_bytes.decode("utf-8")  # on stocke le résultat comme string en base


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Vérifie qu'un mot de passe en clair correspond à un hash stocké.
    On ne déchiffre jamais le hash : on re-hache le mot de passe fourni
    et bcrypt compare les deux de façon sécurisée en interne.
    """
    password_bytes = plain_password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(password_bytes, hashed_bytes)


def create_access_token(user_id: int) -> str:
    """Génère un token JWT signé, contenant l'id utilisateur et une expiration."""
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": str(user_id), "exp": expire}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> int | None:
    """Décode un token JWT et renvoie l'id utilisateur, ou None si invalide/expiré."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return int(payload.get("sub"))
    except Exception:
        return None