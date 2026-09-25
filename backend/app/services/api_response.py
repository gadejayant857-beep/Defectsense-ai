from .report_engine import build_report


def get_dashboard_response():
    report = build_report()

    return {
        "status": "success",
        "service": "DefectSense AI",
        "version": "1.0",
        "dashboard": report["summary"],
        "early_warnings": report["early_warnings"],
        "critical_defects": report["critical_defects"],
        "intelligence": report["intelligence"],
        "analytics": report["analytics"],
    }
