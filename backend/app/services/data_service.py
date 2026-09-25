from .defect_detector import load_claims, detect_defects
from .risk_engine import calculate_risk


def get_claims():
    claims = load_claims()

    return [
        {
            "id": f"#{claim['claim_id']}",
            "product": claim["product"],
            "issue": claim["issue"],
            "description": claim["description"],
            "severity": claim["severity"],
            "date": claim["date"],
            "risk": calculate_risk(
                sum(1 for item in claims if item["issue"] == claim["issue"])
            )["risk"],
        }
        for claim in claims
    ]


def get_defects():
    defects = detect_defects()

    results = []

    for defect in defects:
        risk = calculate_risk(defect["claims"])

        matching_claims = [
            claim for claim in load_claims()
            if claim["issue"] == defect["issue"]
        ]

        product = matching_claims[0]["product"] if matching_claims else "Unknown"

        results.append({
            "name": defect["issue"],
            "product": product,
            "claims": defect["claims"],
            "severity": risk["risk"],
        })

    return results
