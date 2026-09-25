def calculate_risk(claim_count):
    if claim_count >= 4:
        return {"risk": "Critical", "score": 90}
    if claim_count >= 2:
        return {"risk": "High", "score": 70}
    return {"risk": "Medium", "score": 45}
