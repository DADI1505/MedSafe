# app/schemas/drug.py
# Schémas de validation/sérialisation pour les médicaments

from pydantic import BaseModel
from datetime import datetime


class DrugOut(BaseModel):
    """Ce que l'API renvoie pour un médicament — pas raw_json_path,
    c'est un détail d'implémentation interne, pas utile au frontend."""
    id: int
    set_id: str
    brand_name: str
    substance_name: str
    effective_time: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class DrugSearchResult(BaseModel):
    """Version allégée pour les résultats de recherche (liste de résultats),
    volontairement plus légère que DrugOut pour ne pas alourdir la réponse
    quand il y a beaucoup de résultats."""
    id: int
    brand_name: str
    substance_name: str

    class Config:
        from_attributes = True