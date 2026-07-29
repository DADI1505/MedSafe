# app/api/v1/endpoints/drugs.py
# Routes de consultation des médicaments : recherche et détail.

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.crud.crud_drug import search_drugs, get_drug_by_set_id
from app.schemas.drug_pydantic import DrugOut, DrugSearchResult

router = APIRouter(prefix="/drugs", tags=["drugs"])


@router.get("/search", response_model=list[DrugSearchResult])
def search(
    # Query(...) permet de documenter et valider un paramètre d'URL (?q=...)
    # min_length évite de lancer une recherche coûteuse sur 1 seul caractère
    q: str = Query(..., min_length=2, description="Nom commercial ou substance recherchée"),
    db: Session = Depends(get_db),
):
    """
    Recherche des médicaments par nom commercial ou substance active.
    Exemple : GET /api/v1/drugs/search?q=aspirin
    """
    results = search_drugs(db, query=q, limit=10)
    return results


@router.get("/{set_id}", response_model=DrugOut)
def get_drug_detail(set_id: str, db: Session = Depends(get_db)):
    """
    Récupère le détail d'un médicament via son identifiant openFDA.
    Exemple : GET /api/v1/drugs/abc123-def456
    """
    drug = get_drug_by_set_id(db, set_id)

    if drug is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Médicament introuvable.",
        )

    return drug