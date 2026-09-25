import csv
from collections import Counter
from pathlib import Path

DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "claims.csv"


def load_claims():
    with DATA_FILE.open(newline="", encoding="utf-8") as file:
        return list(csv.DictReader(file))


def build_analytics():
    claims = load_claims()

    product_counts = Counter(claim["product"] for claim in claims)
    severity_counts = Counter(claim["severity"] for claim in claims)
    issue_counts = Counter(claim["issue"] for claim in claims)

    total_claims = len(claims)

    return {
        "total_claims": total_claims,
        "products": [
            {"product": product, "claims": count}
            for product, count in product_counts.most_common()
        ],
        "severity": [
            {"severity": level, "claims": count}
            for level, count in severity_counts.most_common()
        ],
        "top_defects": [
            {"issue": issue, "claims": count}
            for issue, count in issue_counts.most_common()
        ],
    }
