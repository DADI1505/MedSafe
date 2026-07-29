# app/schemas/user.py
# Schémas de validation/sérialisation pour l'utilisateur

from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Literal


class UserCreate(BaseModel):
    """Ce que le frontend doit envoyer pour créer un compte."""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr  # EmailStr valide automatiquement le format d'un email
    password: str = Field(..., min_length=8)  # mot de passe en clair, envoyé UNE FOIS,
                                                 # sera haché avant stockage — jamais renvoyé ensuite
    role: Literal["patient", "medecin"] = "patient"  # "admin" n'est jamais choisi par le frontend


class UserLogin(BaseModel):
    """Ce que le frontend envoie pour se connecter."""
    email: EmailStr
    password: str


class UserOut(BaseModel):
    """
    Ce que l'API renvoie quand on demande les infos d'un utilisateur.
    Ne contient JAMAIS hashed_password — c'est la différence essentielle
    avec le modèle ORM, qui lui contient ce champ en base.
    """
    id: int
    username: str
    email: EmailStr
    role: str
    created_at: datetime

    class Config:
        from_attributes = True  # permet de créer ce schéma directement depuis un objet User ORM