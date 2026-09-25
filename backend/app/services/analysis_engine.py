from .defect_detector import detect_defects
from .risk_engine import calculate_risk


def analyze_claims():
    defects = detect_defects()

    results = []

    for defect in defects:
        risk = calculate_risk(defect["claims"])

        results.append({
            "issue": defect["issue"],
            "claims": defect["claims"],
            "risk": risk["risk"],
            "score": risk["score"],
        })

    return results
