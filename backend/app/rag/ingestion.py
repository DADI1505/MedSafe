
# app/rag/ingestion.py
#
# Contient la logique d'ingestion (importable par d'autres modules) ET
# peut être exécuté directement en script autonome :
#   python -m app.rag.ingestion

import requests
import json
import os
from sqlalchemy.orm import Session
from app.core.config import get_settings
from app.crud.crud_drug import create_drug, get_drug_by_set_id

settings = get_settings()
RAW_JSON_DIR = "data/raw_json"


# def fetch_drugs_from_openfda(limit: int = 20, skip: int = 0) -> list[dict]:
#     """Appelle l'API openFDA et renvoie une liste de notices brutes."""
#     params = {"limit": limit, "skip": skip}
#     response = requests.get(settings.OPENFDA_BASE_URL, params=params)
#     response.raise_for_status()
#     data = response.json()
#     return data.get("results", [])
def fetch_drugs_from_openfda(limit: int = 100, skip: int = 0) -> list[dict]:
    """
    Appelle l'API openFDA et renvoie une liste de notices brutes.
    - limit : nombre de résultats demandés (max 100 par lot, sécurité
      contre les timeouts, même si l'API autorise jusqu'à 1000)
    - skip : décalage pour paginer les résultats
    """
    params = {"limit": limit, "skip": skip}
    if settings.OPENFDA_API_KEY:
        params["api_key"] = settings.OPENFDA_API_KEY

    response = requests.get(settings.OPENFDA_BASE_URL, params=params)
    response.raise_for_status()
    data = response.json()
    return data.get("results", [])


def normalize_drug_data(raw_drug: dict) -> dict | None:
    """Extrait les champs utiles d'une notice, renvoie None si incomplète."""
    openfda_info = raw_drug.get("openfda", {})
    brand_names = openfda_info.get("brand_name", [])
    substance_names = openfda_info.get("substance_name", [])

    if not brand_names or not substance_names:
        return None

    return {
        "set_id": raw_drug.get("id", ""),
        "brand_name": brand_names[0],
        "substance_name": substance_names[0],
        "effective_time": raw_drug.get("effective_time", ""),
    }


def save_raw_json_to_disk(set_id: str, raw_drug: dict) -> str:
    """Sauvegarde le JSON brut sur disque, renvoie le chemin du fichier créé."""
    os.makedirs(RAW_JSON_DIR, exist_ok=True)
    file_path = os.path.join(RAW_JSON_DIR, f"{set_id}.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(raw_drug, f, ensure_ascii=False, indent=2)
    return file_path


# def ingest_drugs(db: Session, total_to_fetch: int = 100):
#     """Fonction principale : récupère, sauvegarde sur disque, enregistre en base."""
#     fetched_count = 0
#     skip = 0
#     batch_size = 20

#     while fetched_count < total_to_fetch:
#         print(f"Récupération des notices {skip} à {skip + batch_size}...")
#         raw_drugs = fetch_drugs_from_openfda(limit=batch_size, skip=skip)

#         if not raw_drugs:
#             print("Plus de notices disponibles chez openFDA.")
#             break

#         for raw_drug in raw_drugs:
#             normalized = normalize_drug_data(raw_drug)
#             if normalized is None:
#                 continue

#             existing = get_drug_by_set_id(db, normalized["set_id"])
#             if existing:
#                 print(f"  → {normalized['brand_name']} déjà en base, on passe.")
#                 continue

#             json_path = save_raw_json_to_disk(normalized["set_id"], raw_drug)

#             drug_data_for_db = {
#                 "set_id": normalized["set_id"],
#                 "brand_name": normalized["brand_name"],
#                 "substance_name": normalized["substance_name"],
#                 "effective_time": normalized["effective_time"],
#                 "raw_json_path": json_path,
#             }
#             create_drug(db, drug_data_for_db)
#             print(f"  ✓ {normalized['brand_name']} ajouté en base.")
#             fetched_count += 1

#         skip += batch_size

#     print(f"\nIngestion terminée : {fetched_count} notices ajoutées.")
import time

def ingest_drugs(db: Session, total_to_fetch: int = 3000):
    fetched_count = 0
    skip = 0
    batch_size = 100  # augmenté, dans la limite max de 1000 par appel

    while fetched_count < total_to_fetch:
        print(f"Récupération des notices {skip} à {skip + batch_size}...")

        try:
            raw_drugs = fetch_drugs_from_openfda(limit=batch_size, skip=skip)
        except requests.exceptions.RequestException as e:
            print(f"  ⚠ Erreur réseau, nouvelle tentative dans 5s : {e}")
            time.sleep(5)
            continue  # on retente le même lot, sans avancer skip

        if not raw_drugs:
            print("Plus de notices disponibles chez openFDA.")
            break

        for raw_drug in raw_drugs:
            normalized = normalize_drug_data(raw_drug)
            if normalized is None:
                continue

            existing = get_drug_by_set_id(db, normalized["set_id"])
            if existing:
                continue  # on n'affiche plus chaque doublon pour ne pas noyer les logs

            json_path = save_raw_json_to_disk(normalized["set_id"], raw_drug)
            drug_data_for_db = {
                "set_id": normalized["set_id"],
                "brand_name": normalized["brand_name"],
                "substance_name": normalized["substance_name"],
                "effective_time": normalized["effective_time"],
                "raw_json_path": json_path,
            }
            create_drug(db, drug_data_for_db)
            fetched_count += 1

        print(f"  → {fetched_count}/{total_to_fetch} notices ingérées jusqu'ici")
        skip += batch_size
        time.sleep(0.3)  # petite pause polie entre les lots, reste large sous 240/min

    print(f"\nIngestion terminée : {fetched_count} notices ajoutées.")

# ──────────────────────────────────────────────────────────────
# Bloc d'exécution autonome : ne se lance QUE si on exécute ce
# fichier directement (python -m app.rag.ingestion), jamais quand
# un autre module fait "import ingestion"
# ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    from app.core.database import SessionLocal

    db = SessionLocal()
    try:
        ingest_drugs(db, total_to_fetch=3000)
    except Exception as e:
        print(f"Erreur pendant l'ingestion : {e}")
    finally:
        db.close()