import csv
from collections import Counter
from pathlib import Path

from .risk_engine import calculate_risk
from .severity_engine import severity_score

DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "claims.csv"


def load_claims():
    with DATA_FILE.open(newline="", encoding="utf-8") as file:
        return list(csv.DictReader(file))


def analyze_intelligence():
    claims = load_claims()
    issue_counts = Counter(claim["issue"] for claim in claims)

    results = []

    for issue, count in issue_counts.most_common():
        matching = [claim for claim in claims if claim["issue"] == issue]

        average_severity = sum(
            severity_score(claim["severity"]) for claim in matching
        ) / len(matching)

        risk = calculate_risk(count)

        final_score = round(
            (risk["score"] * 0.6) +
            (average_severity * 0.4)
        )

        if count >= 4:
            trend = "Strong increase"
            trend_score = 90
        elif count >= 2:
            trend = "Increasing"
            trend_score = 70
        else:
            trend = "Stable signal"
            trend_score = 45

        early_warning = final_score >= 70

        if early_warning:
            explanation = (
                f"{issue} shows an emerging defect signal based on "
                f"{count} related warranty claims and an average severity "
                f"of {round(average_severity)}."
            )
        else:
            explanation = (
                f"{issue} currently shows a lower-volume signal with "
                f"{count} related warranty claim(s)."
            )

        results.append({
            "issue": issue,
            "claims": count,
            "average_severity": round(average_severity),
            "risk": risk["risk"],
            "score": final_score,
            "trend": trend,
            "trend_score": trend_score,
            "early_warning": early_warning,
            "explanation": explanation,
        })

    return results
