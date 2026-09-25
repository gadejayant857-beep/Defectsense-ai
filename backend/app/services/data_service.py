from .database import get_connection
from .risk_engine import calculate_risk


def get_claims():
    with get_connection() as connection:
        claims = connection.execute(
            """
            SELECT claim_id, product, issue, description, severity, date
            FROM claims
            ORDER BY date
            """
        ).fetchall()

        issue_counts = connection.execute(
            """
            SELECT issue, COUNT(*) AS count
            FROM claims
            GROUP BY issue
            """
        ).fetchall()

    counts = {
        row["issue"]: row["count"]
        for row in issue_counts
    }

    return [
        {
            "id": f"#{claim['claim_id']}",
            "product": claim["product"],
            "issue": claim["issue"],
            "description": claim["description"],
            "severity": claim["severity"],
            "date": claim["date"],
            "risk": calculate_risk(
                counts.get(claim["issue"], 0)
            )["risk"],
        }
        for claim in claims
    ]


def get_defects():
    with get_connection() as connection:
        defects = connection.execute(
            """
            SELECT issue, COUNT(*) AS claims
            FROM claims
            GROUP BY issue
            ORDER BY claims DESC
            """
        ).fetchall()

        products = connection.execute(
            """
            SELECT issue, product
            FROM claims
            GROUP BY issue
            ORDER BY date
            """
        ).fetchall()

    product_map = {
        row["issue"]: row["product"]
        for row in products
    }

    return [
        {
            "name": defect["issue"],
            "product": product_map.get(
                defect["issue"],
                "Unknown",
            ),
            "claims": defect["claims"],
            "severity": calculate_risk(
                defect["claims"]
            )["risk"],
        }
        for defect in defects
    ]
