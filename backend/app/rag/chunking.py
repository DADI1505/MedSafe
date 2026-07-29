
# app/rag/chunking.py
#
# Contient la logique de découpage (importable) ET peut être exécuté
# directement pour découper TOUS les médicaments déjà en base :
#   python -m app.rag.chunking

import json
from sqlalchemy.orm import Session

RELEVANT_SECTIONS = {
    "warnings": "warnings",
    "contraindications": "contraindications",
    "dosage_and_administration": "dosage",
    "drug_interactions": "interactions",
    "adverse_reactions": "adverse_reactions",
    "pregnancy": "pregnancy",
}

MAX_CHUNK_LENGTH = 1000


def chunk_drug_notice(raw_drug_json: dict) -> list[dict]:
    """Découpe une notice JSON en fragments, organisés par section."""
    chunks = []
    chunk_index = 0

    for openfda_key, our_section_name in RELEVANT_SECTIONS.items():
        section_content = raw_drug_json.get(openfda_key)
        if not section_content:
            continue

        full_section_text = " ".join(section_content)

        if len(full_section_text) <= MAX_CHUNK_LENGTH:
            chunks.append({
                "section_type": our_section_name,
                "chunk_text": full_section_text,
                "chunk_index": chunk_index,
            })
            chunk_index += 1
        else:
            sub_chunks = split_text_by_sentences(full_section_text, MAX_CHUNK_LENGTH)
            for sub_chunk_text in sub_chunks:
                chunks.append({
                    "section_type": our_section_name,
                    "chunk_text": sub_chunk_text,
                    "chunk_index": chunk_index,
                })
                chunk_index += 1

    return chunks


def split_text_by_sentences(text: str, max_length: int) -> list[str]:
    """Découpe un texte long en respectant les fins de phrases."""
    sentences = text.split(". ")
    result_chunks = []
    current_chunk = ""

    for sentence in sentences:
        if len(current_chunk) + len(sentence) > max_length and current_chunk:
            result_chunks.append(current_chunk.strip())
            current_chunk = sentence
        else:
            current_chunk += sentence + ". "

    if current_chunk:
        result_chunks.append(current_chunk.strip())

    return result_chunks


def chunk_all_drugs_in_db(db: Session):
    """
    Parcourt tous les médicaments déjà en base, charge leur JSON brut
    depuis le disque (via raw_json_path), les découpe, et enregistre
    les chunks dans la table drug_chunks.
    """
    from app.models.drug import Drug
    from app.models.drug_chunk import DrugChunk

    all_drugs = db.query(Drug).all()

    if not all_drugs:
        print("Aucun médicament en base. Lance d'abord ingestion.py.")
        return

    total_chunks = 0

    for drug in all_drugs:
        print(f"Chunking de {drug.brand_name}...")

        with open(drug.raw_json_path, "r", encoding="utf-8") as f:
            raw_json = json.load(f)

        chunks = chunk_drug_notice(raw_json)

        for chunk_data in chunks:
            db_chunk = DrugChunk(
                drug_id=drug.id,
                section_type=chunk_data["section_type"],
                chunk_text=chunk_data["chunk_text"],
                chunk_index=chunk_data["chunk_index"],
                faiss_vector_id=total_chunks,  # position future dans FAISS
            )
            db.add(db_chunk)
            total_chunks += 1

    db.commit()
    print(f"\n{total_chunks} chunks créés en base.")


# ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    from app.core.database import SessionLocal

    db = SessionLocal()
    try:
        chunk_all_drugs_in_db(db)
    except Exception as e:
        print(f"Erreur pendant le chunking : {e}")
        db.rollback()
    finally:
        db.close()