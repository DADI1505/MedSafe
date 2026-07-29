# app/api/v1/router.py
# Routeur central : rassemble tous les sous-routeurs en un seul,
# monté ensuite dans main.py avec le préfixe /api/v1

from fastapi import APIRouter
from app.api.v1.endpoints import auth, drugs, audit,rag

api_router = APIRouter()

# Chaque include_router ajoute les routes du fichier correspondant.
# Le prefix ("/auth", "/drugs", "/audit") est déjà défini DANS chaque
# fichier endpoint, donc pas besoin de le répéter ici.
api_router.include_router(auth.router)
api_router.include_router(drugs.router)
api_router.include_router(audit.router)
api_router.include_router(rag.router)
# rag.router sera ajouté ici une fois que le module app/rag/ sera complet