from .intelligence_engine import analyze_intelligence
from .analytics_engine import build_analytics


def build_report():
    intelligence = analyze_intelligence()
    analytics = build_analytics()

    warnings = [
        item for item in intelligence
        if item["early_warning"]
    ]

    critical = [
        item for item in intelligence
        if item["risk"] == "Critical"
    ]

    return {
        "summary": {
            "total_claims": analytics["total_claims"],
            "early_warnings": len(warnings),
            "critical_defects": len(critical),
            "top_defect": intelligence[0]["issue"] if intelligence else None,
        },
        "early_warnings": warnings,
        "critical_defects": critical,
        "intelligence": intelligence,
        "analytics": analytics,
    }
