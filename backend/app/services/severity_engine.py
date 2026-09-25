SEVERITY_WEIGHTS = {
    "Critical": 100,
    "High": 75,
    "Medium": 50,
    "Low": 25,
}


def severity_score(severity):
    return SEVERITY_WEIGHTS.get(severity, 0)
