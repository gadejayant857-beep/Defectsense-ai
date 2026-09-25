import csv
from pathlib import Path

from .database import get_connection, initialize_database

CSV_FILE = Path(__file__).resolve().parents[1] / "data" / "claims.csv"

REQUIRED_COLUMNS = {
    "claim_id",
    "product",
    "issue",
    "description",
    "severity",
    "date",
}

VALID_SEVERITIES = {
    "Critical",
    "High",
    "Medium",
    "Low",
}


def validate_claim(claim):
    missing = [
        field
        for field in REQUIRED_COLUMNS
        if not claim.get(field, "").strip()
    ]

    if missing:
        raise ValueError(
            f"{claim.get('claim_id', 'UNKNOWN')}: "
            f"missing fields: {', '.join(missing)}"
        )

    if claim["severity"] not in VALID_SEVERITIES:
        raise ValueError(
            f"{claim['claim_id']}: invalid severity "
            f"'{claim['severity']}'"
        )


def import_claims(csv_file=CSV_FILE):
    initialize_database()

    with Path(csv_file).open(
        newline="",
        encoding="utf-8",
    ) as file:
        reader = csv.DictReader(file)

        if not reader.fieldnames:
            raise ValueError("CSV file has no header.")

        missing_columns = REQUIRED_COLUMNS - set(reader.fieldnames)

        if missing_columns:
            raise ValueError(
                "Missing CSV columns: "
                + ", ".join(sorted(missing_columns))
            )

        claims = list(reader)

    for claim in claims:
        validate_claim(claim)

    with get_connection() as connection:
        inserted = 0

        for claim in claims:
            cursor = connection.execute(
                """
                INSERT OR IGNORE INTO claims (
                    claim_id,
                    product,
                    issue,
                    description,
                    severity,
                    date
                )
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    claim["claim_id"].strip(),
                    claim["product"].strip(),
                    claim["issue"].strip(),
                    claim["description"].strip(),
                    claim["severity"].strip(),
                    claim["date"].strip(),
                ),
            )

            inserted += cursor.rowcount

        connection.commit()

    return {
        "rows_read": len(claims),
        "rows_inserted": inserted,
        "rows_skipped": len(claims) - inserted,
    }


if __name__ == "__main__":
    result = import_claims()
    print(
        f"Rows read: {result['rows_read']}\n"
        f"Rows inserted: {result['rows_inserted']}\n"
        f"Rows skipped: {result['rows_skipped']}"
    )
