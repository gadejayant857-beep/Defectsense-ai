const dashboardResponse = {
  status: 'success',
  service: 'DefectSense AI',
  version: '1.0',

  dashboard: {
    total_claims: 8,
    early_warnings: 2,
    critical_defects: 1,
    top_defect: 'Battery overheating',
  },


  claims: [
    { id: '#CLM-10001', product: 'Model X1', issue: 'Battery overheating', description: 'Battery temperature rises during charging', severity: 'Critical', date: '2026-09-01', risk: 'Critical' },
    { id: '#CLM-10002', product: 'Model X1', issue: 'Battery overheating', description: 'Device becomes unusually hot after charging', severity: 'Critical', date: '2026-09-02', risk: 'Critical' },
    { id: '#CLM-10003', product: 'Model A7', issue: 'Brake vibration', description: 'Vibration felt while braking at medium speed', severity: 'High', date: '2026-09-03', risk: 'High' },
    { id: '#CLM-10004', product: 'Model X1', issue: 'Display failure', description: 'Screen flickers intermittently during use', severity: 'Medium', date: '2026-09-04', risk: 'Medium' },
    { id: '#CLM-10005', product: 'Model B4', issue: 'Charging fault', description: 'Charging stops before reaching full capacity', severity: 'High', date: '2026-09-05', risk: 'Medium' },
    { id: '#CLM-10006', product: 'Model X1', issue: 'Battery overheating', description: 'Unexpected shutdown after device temperature increased', severity: 'Critical', date: '2026-09-06', risk: 'Critical' },
    { id: '#CLM-10007', product: 'Model A7', issue: 'Brake vibration', description: 'Steering wheel vibrates during braking', severity: 'High', date: '2026-09-07', risk: 'High' },
    { id: '#CLM-10008', product: 'Model X1', issue: 'Battery overheating', description: 'High temperature warning appears while charging', severity: 'Critical', date: '2026-09-08', risk: 'Critical' },
  ],

  defects: [
    { name: 'Battery overheating', product: 'Model X1', claims: 4, severity: 'Critical' },
    { name: 'Brake vibration', product: 'Model A7', claims: 2, severity: 'High' },
    { name: 'Display failure', product: 'Model X1', claims: 1, severity: 'Medium' },
    { name: 'Charging fault', product: 'Model B4', claims: 1, severity: 'Medium' },
  ],

  early_warnings: [
    {
      issue: 'Battery overheating',
      claims: 4,
      average_severity: 100,
      risk: 'Critical',
      score: 94,
      trend: 'Strong increase',
      trend_score: 90,
      early_warning: true,
    },
    {
      issue: 'Brake vibration',
      claims: 2,
      average_severity: 75,
      risk: 'High',
      score: 72,
      trend: 'Increasing',
      trend_score: 70,
      early_warning: true,
    },
  ],

  critical_defects: [
    {
      issue: 'Battery overheating',
      claims: 4,
      average_severity: 100,
      risk: 'Critical',
      score: 94,
      trend: 'Strong increase',
      trend_score: 90,
      early_warning: true,
    },
  ],

  intelligence: [
    {
      issue: 'Battery overheating',
      claims: 4,
      previous_claims: 2,
      current_claims: 2,
      growth_percent: 0,
      anomaly: false,
      average_severity: 100,
      risk: 'Critical',
      score: 94,
      confidence_score: 90,
      trend: 'Stable',
      trend_score: 45,
      early_warning: true,
      explanation: 'Battery overheating remained stable at 2 current-period claim(s). The overall risk score remains 94/100.',
    },
    {
      issue: 'Brake vibration',
      claims: 2,
      previous_claims: 1,
      current_claims: 1,
      growth_percent: 0,
      anomaly: false,
      average_severity: 75,
      risk: 'High',
      score: 72,
      confidence_score: 55,
      trend: 'Stable',
      trend_score: 45,
      early_warning: true,
      explanation: 'Brake vibration remained stable at 1 current-period claim(s). The overall risk score remains 72/100.',
    },
    {
      issue: 'Display failure',
      claims: 1,
      previous_claims: 1,
      current_claims: 0,
      growth_percent: -100,
      anomaly: false,
      average_severity: 50,
      risk: 'Medium',
      score: 47,
      confidence_score: 30,
      trend: 'Decreasing',
      trend_score: 30,
      early_warning: false,
      explanation: 'Display failure decreased from 1 previous-period claim(s) to 0 current-period claim(s), a 100.0% decrease.',
    },
    {
      issue: 'Charging fault',
      claims: 1,
      previous_claims: 0,
      current_claims: 1,
      growth_percent: 100,
      anomaly: true,
      average_severity: 75,
      risk: 'Medium',
      score: 57,
      confidence_score: 70,
      trend: 'New signal',
      trend_score: 85,
      early_warning: true,
      explanation: 'Charging fault is a new emerging signal with 1 current-period claim(s) and no previous-period claims. The system flagged this as an anomaly.',
    },
  ],

  analytics: {
    total_claims: 8,

    products: [
      { product: 'Model X1', claims: 5 },
      { product: 'Model A7', claims: 2 },
      { product: 'Model B4', claims: 1 },
    ],

    severity: [
      { severity: 'Critical', claims: 4 },
      { severity: 'High', claims: 3 },
      { severity: 'Medium', claims: 1 },
    ],

    top_defects: [
      { issue: 'Battery overheating', claims: 4 },
      { issue: 'Brake vibration', claims: 2 },
      { issue: 'Display failure', claims: 1 },
      { issue: 'Charging fault', claims: 1 },
    ],
  },
}

export async function getDashboard() {
  return dashboardResponse
}

export async function getClaims() {
  const response = await getDashboard()
  return response.claims
}

export async function getDefects() {
  const response = await getDashboard()
  return response.defects
}

export async function getIntelligence() {
  const response = await getDashboard()
  return response.intelligence
}

export async function getAnalytics() {
  const response = await getDashboard()
  return response.analytics
}

export async function getEarlyWarnings() {
  const response = await getDashboard()
  return response.early_warnings
}

export async function getCriticalDefects() {
  const response = await getDashboard()
  return response.critical_defects
}
