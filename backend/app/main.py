# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.core.config import get_settings

from app.rag.vector_store import load_faiss_index
import os

settings = get_settings()

app = FastAPI(title="MedSafe-RAG API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/api/v1/health")
def health_check():
    return {"status": "ok"}



@app.on_event("startup")
def on_startup():
    if os.path.exists(settings.FAISS_INDEX_PATH):
        load_faiss_index(settings.FAISS_INDEX_PATH)
    else:
        print(f"⚠ Index FAISS introuvable à {settings.FAISS_INDEX_PATH} — lance ta Phase 0 d'abord.")