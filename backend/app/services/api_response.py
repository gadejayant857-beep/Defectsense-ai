from .report_engine import build_report
from .data_service import get_claims, get_defects


def get_dashboard_response():
    report = build_report()

    return {
        "status": "success",
        "service": "DefectSense AI",
        "version": "1.0",
        "dashboard": report["summary"],
        "claims": get_claims(),
        "defects": get_defects(),
        "early_warnings": report["early_warnings"],
        "critical_defects": report["critical_defects"],
        "intelligence": report["intelligence"],
        "analytics": report["analytics"],
    }
