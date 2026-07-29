# alembic/env.py

import sys
import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# ────────────────────────────────────────────────────────────
# AJOUT 1 : permet à Python de trouver le dossier app/ depuis alembic/
# ────────────────────────────────────────────────────────────
sys.path.append(os.getcwd())  # ajoute la racine du projet au chemin de recherche Python

# ────────────────────────────────────────────────────────────
# AJOUT 2 : on importe ta config (pour lire DATABASE_URL depuis le .env)
# ────────────────────────────────────────────────────────────
from app.core.config import get_settings
settings = get_settings()

# ────────────────────────────────────────────────────────────
# AJOUT 3 : on importe Base ET tous tes modèles — c'est OBLIGATOIRE,
# sinon Alembic ne "voit" pas tes tables et generate --autogenerate
# créera une migration vide
# ────────────────────────────────────────────────────────────
from app.core.database import Base
from app.models.user import User
from app.models.drug import Drug
from app.models.drug_chunk import DrugChunk
from app.models.audit_log import AuditLog

# Ceci existait déjà dans le fichier généré automatiquement :
config = context.config

# ────────────────────────────────────────────────────────────
# AJOUT 4 : on injecte l'URL de la base depuis settings, au lieu 
# de la valeur (vide) de alembic.ini
# ────────────────────────────────────────────────────────────
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ────────────────────────────────────────────────────────────
# AJOUT 5 : on dit à Alembic que "target_metadata" c'est TA Base,
# celle qui connaît tous tes modèles via les imports ci-dessus.
# C'était probablement "target_metadata = None" par défaut.
# ────────────────────────────────────────────────────────────
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()