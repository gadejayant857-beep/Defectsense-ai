import csv
from collections import Counter
from datetime import datetime
from pathlib import Path

from .risk_engine import calculate_risk
from .severity_engine import severity_score

DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "claims.csv"


def load_claims():
    with DATA_FILE.open(newline="", encoding="utf-8") as file:
        return list(csv.DictReader(file))


def calculate_growth(previous_count, current_count):
    if previous_count == 0:
        return 100.0 if current_count > 0 else 0.0

    return round(
        ((current_count - previous_count) / previous_count) * 100,
        1,
    )


def calculate_confidence(
    total_count,
    average_severity,
    anomaly,
    current_count,
):
    volume_component = min(total_count, 5) * 10
    severity_component = average_severity * 0.4
    anomaly_component = 25 if anomaly else 0
    current_signal_component = min(current_count, 3) * 5

    return round(
        min(
            100,
            volume_component
            + severity_component
            + anomaly_component
            + current_signal_component,
        )
    )


def analyze_intelligence():
    claims = load_claims()

    if not claims:
        return []

    parsed_claims = [
        {
            **claim,
            "parsed_date": datetime.strptime(
                claim["date"],
                "%Y-%m-%d",
            ).date(),
        }
        for claim in claims
    ]

    dates = sorted(claim["parsed_date"] for claim in parsed_claims)

    start_date = dates[0]
    end_date = dates[-1]

    total_days = (end_date - start_date).days + 1
    split_days = max(1, total_days // 2)

    previous_end = start_date.fromordinal(
        start_date.toordinal() + split_days - 1
    )

    previous_claims = [
        claim
        for claim in parsed_claims
        if claim["parsed_date"] <= previous_end
    ]

    current_claims = [
        claim
        for claim in parsed_claims
        if claim["parsed_date"] > previous_end
    ]

    total_issue_counts = Counter(
        claim["issue"] for claim in parsed_claims
    )

    previous_issue_counts = Counter(
        claim["issue"] for claim in previous_claims
    )

    current_issue_counts = Counter(
        claim["issue"] for claim in current_claims
    )

    results = []

    for issue, total_count in total_issue_counts.most_common():

        matching = [
            claim
            for claim in parsed_claims
            if claim["issue"] == issue
        ]

        average_severity = sum(
            severity_score(claim["severity"])
            for claim in matching
        ) / len(matching)

        risk = calculate_risk(total_count)

        risk_score = round(
            (risk["score"] * 0.6)
            + (average_severity * 0.4)
        )

        previous_count = previous_issue_counts.get(issue, 0)
        current_count = current_issue_counts.get(issue, 0)

        growth_percent = calculate_growth(
            previous_count,
            current_count,
        )

        anomaly = (
            previous_count == 0 and current_count > 0
        ) or growth_percent >= 100

        if previous_count == 0 and current_count > 0:
            trend = "New signal"
            trend_score = 85
        elif growth_percent >= 50:
            trend = "Strong increase"
            trend_score = 90
        elif growth_percent > 0:
            trend = "Increasing"
            trend_score = 70
        elif growth_percent == 0:
            trend = "Stable"
            trend_score = 45
        else:
            trend = "Decreasing"
            trend_score = 30

        confidence_score = calculate_confidence(
            total_count,
            average_severity,
            anomaly,
            current_count,
        )

        early_warning = (
            anomaly
            or growth_percent >= 50
            or risk_score >= 70
        )

        if anomaly and previous_count == 0:
            explanation = (
                f"{issue} is a new emerging signal with "
                f"{current_count} current-period claim(s) and "
                f"no previous-period claims. The system "
                f"flagged this as an anomaly."
            )
        elif growth_percent > 0:
            explanation = (
                f"{issue} increased from {previous_count} "
                f"previous-period claim(s) to {current_count} "
                f"current-period claim(s), a "
                f"{growth_percent}% increase."
            )
        elif growth_percent < 0:
            explanation = (
                f"{issue} decreased from {previous_count} "
                f"previous-period claim(s) to {current_count} "
                f"current-period claim(s), a "
                f"{abs(growth_percent)}% decrease."
            )
        else:
            explanation = (
                f"{issue} remained stable at "
                f"{current_count} current-period claim(s). "
                f"The overall risk score remains "
                f"{risk_score}/100."
            )

        results.append({
            "issue": issue,
            "claims": total_count,
            "previous_claims": previous_count,
            "current_claims": current_count,
            "growth_percent": growth_percent,
            "anomaly": anomaly,
            "average_severity": round(average_severity),
            "risk": risk["risk"],
            "score": risk_score,
            "confidence_score": confidence_score,
            "trend": trend,
            "trend_score": trend_score,
            "early_warning": early_warning,
            "explanation": explanation,
            "analysis_period": {
                "previous_end": previous_end.isoformat(),
                "current_start": (
                    current_claims[0]["parsed_date"].isoformat()
                    if current_claims
                    else None
                ),
                "current_end": end_date.isoformat(),
            },
        })

    return results
