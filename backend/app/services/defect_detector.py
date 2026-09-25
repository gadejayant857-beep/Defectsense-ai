import csv
from collections import Counter
from pathlib import Path

DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "claims.csv"


def load_claims():
    with DATA_FILE.open(newline="", encoding="utf-8") as file:
        return list(csv.DictReader(file))


def detect_defects():
    claims = load_claims()
    counts = Counter(claim["issue"] for claim in claims)

    return [
        {"issue": issue, "claims": count}
        for issue, count in counts.most_common()
    ]
