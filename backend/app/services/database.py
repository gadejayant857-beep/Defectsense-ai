import sqlite3
from pathlib import Path

DATABASE_FILE = Path(__file__).resolve().parents[1] / "data" / "defectsense.db"


def get_connection():
    connection = sqlite3.connect(DATABASE_FILE)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    with get_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS claims (
                claim_id TEXT PRIMARY KEY,
                product TEXT NOT NULL,
                issue TEXT NOT NULL,
                description TEXT NOT NULL,
                severity TEXT NOT NULL,
                date TEXT NOT NULL
            )
        """)

        connection.commit()
