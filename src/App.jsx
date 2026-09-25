import { useEffect, useState } from 'react'
import { getDashboard, getClaims, getDefects, getIntelligence } from './api/defectSenseApi'
import './App.css'

function buildDefectSenseReport(claims, defects, intelligence) {
  const criticalClaims = claims.filter((claim) => claim.severity === "Critical")
  const warnings = intelligence.filter((item) => item.early_warning)

  return {
    generated_at: new Date().toISOString(),
    summary: {
      total_claims: claims.length,
      total_defects: defects.length,
      critical_claims: criticalClaims.length,
      active_warnings: warnings.length,
    },
    defects,
    intelligence,
    critical_claims: criticalClaims,
  }
}

function downloadDefectSenseFile(filename, content, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
function App() {
  const [active, setActive] = useState('Overview')
  const [claimSearch, setClaimSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('All')
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [aiTarget, setAiTarget] = useState(null)
  const [selectedDefect, setSelectedDefect] = useState(null)
  const [aiDefect, setAiDefect] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [selectedRisk, setSelectedRisk] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)
  const [claimsData, setClaimsData] = useState([])
  const [defectsData, setDefectsData] = useState([])
  const [intelligenceData, setIntelligenceData] = useState([])

  useEffect(() => {
    Promise.all([
      getDashboard(),
      getClaims(),
      getDefects(),
      getIntelligence(),
    ]).then(([dashboard, claims, defects, intelligence]) => {
      setDashboardData(dashboard)
      setClaimsData(claims)
      setDefectsData(defects)
      setIntelligenceData(intelligence)
    }).catch((error) => {
      console.error("DefectSense API error:", error)
    })
  }, [])

  const dashboard = dashboardData?.dashboard

  const claims = claimsData
  const defects = defectsData

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch = (claim.id + ' ' + claim.product + ' ' + claim.issue).toLowerCase().includes(claimSearch.toLowerCase())
    const matchesRisk = riskFilter === 'All' || claim.risk === riskFilter
    return matchesSearch && matchesRisk
  })



  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">D</div>
          <div>
            <h2>DefectSense</h2>
            <span>AI Intelligence</span>
          </div>
        </div>

        <nav>
          {['Overview', 'Claims', 'Defects', 'Analytics'].map((item) => (
            <button
              key={item}
              className={active === item ? 'nav-item active' : 'nav-item'}
              onClick={() => setActive(item)}
            >
              <span className="nav-dot"></span>
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="ai-status">
            <span></span>
            AI Engine Online
          </div>
          <small>v1.0.0 • Synapse 2026</small>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">WARRANTY INTELLIGENCE</p>
            <h1>{active}</h1>
          </div>
          <button className="profile">J</button>
        </header>

        {active === "Claims" && (
          <section className="claims-dashboard">
            <div className="ai-result-card"><div><p className="eyebrow">AI DETECTION</p><h3>{aiTarget ? aiTarget.issue : "Emerging defect detected"}</h3><p>{aiTarget ? aiTarget.product + " warranty claims are showing signals related to " + aiTarget.issue + "." : "Battery overheating signals are increasing across Model X1 warranty claims."}</p></div><div className="ai-result-metrics"><span><b>94.2%</b> Confidence</span><span><b>{aiTarget ? aiTarget.risk : "Critical"}</b> Risk</span><span><b>{aiTarget ? aiTarget.issue : "+42.8%"}</b> {aiTarget ? "Detected defect" : "Claim growth"}</span></div></div>
            <div className="claims-stats">
              <div className="stat-card"><p>Total Claims</p><h3>{dashboard?.total_claims ?? '—'}</h3><span className="up">Backend data</span></div>
              <div className="stat-card"><p>Open Claims</p><h3>3,284</h3><span className="alert">1,126 pending</span></div>
              <div className="stat-card"><p>Resolved</p><h3>8,742</h3><span className="up">92.1% success</span></div>
              <div className="stat-card"><p>High Risk</p><h3>460</h3><span className="risk">Needs attention</span></div>
            </div>

            <section className="panel">
              <div className="panel-header">
                <div><p className="eyebrow">RECENT CLAIMS</p><h3>Warranty claim activity</h3></div>
              </div>
              <div className="claim-controls">
                <input
                  type="text"
                  placeholder="Search claims..."
                  value={claimSearch}
                  onChange={(e) => setClaimSearch(e.target.value)}
                />
                <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
                  <option value="All">All Risk</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                </select>
              </div>
              <div className="table data-table">
                <div className="table-head"><span>CLAIM ID</span><span>PRODUCT</span><span>ISSUE</span><span>RISK</span></div>
                {filteredClaims.map((claim) => (
                  <div className="table-row" key={claim.id}>
                    <b onClick={() => { setSelectedClaim(claim); setAiTarget(claim) }} style={{cursor: "pointer"}}>{claim.id}</b>
                    <span>{claim.product}</span>
                    <span>{claim.issue}</span>
                    <span className="risk">{claim.risk}</span>
                  </div>
                ))}
              </div>
            </section>

            {selectedClaim && (
              <section className="panel">
                <div className="panel-header">
                  <div><p className="eyebrow">CLAIM ANALYSIS</p><h3>{selectedClaim.id}</h3></div>
                  <button className="primary-btn" onClick={() => setSelectedClaim(null)}>Close</button>
                </div>
                <div className="table data-table">
                  <div className="table-row"><b>Product</b><span>{selectedClaim.product}</span></div>
                  <div className="table-row"><b>Detected Defect</b><span>{selectedClaim.issue}</span></div>
                  <div className="table-row"><b>Risk Level</b><span className="risk">{selectedClaim.risk}</span></div>
                  <div className="table-row"><b>AI Confidence</b><span>94.2%</span></div>
                </div>
                <div className="detail-grid">
                  <div><p>COMPLAINT SUMMARY</p><h4>Customer reports recurring symptoms related to the detected defect.</h4></div>
                  <div><p>DETECTED KEYWORDS</p><h4>{selectedClaim.issue === "Brake vibration" ? "brake • vibration • steering • suspension" : selectedClaim.issue === "Display failure" ? "display • screen • flicker • touch" : selectedClaim.issue === "Charging fault" ? "charging • adapter • power • port" : selectedClaim.issue === "Camera failure" ? "camera • lens • focus • image" : "overheating • battery • temperature • shutdown"}</h4></div>
                  <div><p>RECOMMENDED ACTION</p><h4>{selectedClaim.issue === "Brake vibration" ? "Prioritize brake and suspension engineering review." : selectedClaim.issue === "Display failure" ? "Prioritize display hardware and touch-system investigation." : selectedClaim.issue === "Charging fault" ? "Prioritize charging-system and power-port investigation." : selectedClaim.issue === "Camera failure" ? "Prioritize camera module and image-system investigation." : "Prioritize engineering review and monitor claim frequency."}</h4></div>
                </div>
              </section>
            )}
          </section>
        )}

        {active === "Defects" && (
          <section className="defects-dashboard">
              <div className="ai-result-card"><div><p className="eyebrow">AI DETECTION</p><h3>{aiDefect ? aiDefect.name : "Emerging defect detected"}</h3><p>{aiDefect ? aiDefect.product + " warranty claims are showing signals related to " + aiDefect.name + "." : "Battery overheating signals are increasing across Model X1 warranty claims."}</p></div><div className="ai-result-metrics"><span><b>94.2%</b> Confidence</span><span><b>{aiDefect ? aiDefect.severity : "Critical"}</b> Risk</span><span><b>{aiDefect ? aiDefect.claims : "+42.8%"}</b> {aiDefect ? "Related claims" : "Claim growth"}</span></div></div><div className="claims-stats">
              <div className="stat-card"><p>Active Defects</p><h3>{dashboard?.critical_defects ?? '—'}</h3><span className="alert">Critical defects</span></div>
              <div className="stat-card"><p>Critical</p><h3>4</h3><span className="risk">Immediate review</span></div>
              <div className="stat-card"><p>High Severity</p><h3>9</h3><span className="risk">Needs attention</span></div>
              <div className="stat-card"><p>AI Confidence</p><h3>94.2%</h3><span className="up">+2.8%</span></div>
            </div>

            <section className="panel">
              <div className="panel-header">
                <div><p className="eyebrow">DEFECT INTELLIGENCE</p><h3>Emerging defect signals</h3></div>
              </div>
              <div className="table data-table">
                <div className="table-head"><span>DEFECT</span><span>PRODUCT</span><span>CLAIMS</span><span>SEVERITY</span></div>
                {defects.map((defect) => (
                  <div className="table-row" key={defect.name}>
                    <b onClick={() => { setSelectedDefect(defect); setAiDefect(defect) }} style={{cursor: "pointer"}}>{defect.name}</b>
                    <span>{defect.product}</span>
                    <span>{defect.claims}</span>
                    <span className="risk">{defect.severity}</span>
                  </div>
                ))}
              </div>
            </section>

            {selectedDefect && (
              <section className="panel">
                <div className="panel-header">
                  <div><p className="eyebrow">DEFECT ANALYSIS</p><h3>{selectedDefect.name}</h3></div>
                  <button className="primary-btn" onClick={() => setSelectedDefect(null)}>Close</button>
                </div>
                <div className="table">
                  <div className="table-row"><b>Product</b><span>{selectedDefect.product}</span></div>
                  <div className="table-row"><b>Related Claims</b><span>{selectedDefect.claims}</span></div>
                  <div className="table-row"><b>Severity</b><span className="risk">{selectedDefect.severity}</span></div>
                  <div className="table-row"><b>AI Confidence</b><span>94.2%</span></div>
                </div>
                <div className="detail-grid">
                  <div><p>PATTERN SUMMARY</p><h4>Claim frequency is showing a recurring pattern across affected units.</h4></div>
                  <div><p>RECOMMENDED ACTION</p><h4>Prioritize investigation and continue monitoring claim growth.</h4></div>
                </div>
              </section>
            )}
          </section>
        )}

        {active === "Analytics" && (
          <section className="analytics-dashboard">
            <div className="ai-result-card"><div><p className="eyebrow">AI DETECTION</p><h3>Emerging defect detected</h3><p>Battery overheating signals are increasing across Model X1 warranty claims.</p></div><div className="ai-result-metrics"><span><b>94.2%</b> Confidence</span><span><b>Critical</b> Risk</span><span><b>+42.8%</b> Claim growth</span></div></div><div className="claims-stats">
              <div className="stat-card"><p>Claims Analyzed</p><h3>12,486</h3><span className="up">+18.4%</span></div>
              <div className="stat-card"><p>Detection Accuracy</p><h3>{dashboard?.early_warnings ?? '—'}</h3><span className="up">Early warnings</span></div>
              <div className="stat-card"><p>Avg. Risk Score</p><h3>{dashboard?.critical_defects ? '94/100' : '—'}</h3><span className="risk">AI risk signal</span></div>
              <div className="stat-card"><p>Early Warnings</p><h3>186</h3><span className="up">+23 this month</span></div>
            </div>
              <section className="panel"><div className="panel-header"><div><p className="eyebrow">AI INSIGHTS</p><h3>What the model is seeing</h3></div></div><div className="claims-stats"><div className="stat-card"><p>Critical Signal</p><h3>Battery overheating</h3><span className="risk critical">Model X1</span></div><div className="stat-card"><p>Rising Trend</p><h3>+42.8%</h3><span className="up">Claim growth</span></div><div className="stat-card"><p>Early Warning</p><h3>Recall risk</h3><span className="risk high">Detected</span></div></div></section>

            <section className="panel">
              <div className="panel-header">
                <div><p className="eyebrow">CLAIM TREND</p><h3>Monthly warranty claims</h3></div>
              </div>
              <div style={{padding: "20px 0"}}>
                  <div style={{height: "180px", display: "flex", alignItems: "end", gap: "10px"}}>
                    {[45,58,52,70,64,82,76,95,88,100,92,108].map((value, i) => (
                      <div onClick={() => setSelectedMonth({ month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], value })} key={i} style={{flex: 1, height: value + "px", background: "#2f8cff", opacity: 0.45 + i * 0.04, borderRadius: "6px 6px 2px 2px", cursor: "pointer"}}></div>
                    ))}
                  </div>
                <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                  {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((month) => (
                    <span key={month} style={{flex: 1, textAlign: "center", fontSize: "13px", color: "#7f8a96"}}>{month}</span>
                  ))}
                </div>
              </div>
              {selectedMonth && <div style={{marginTop: "14px", padding: "14px 16px", border: "1px solid rgba(47,140,255,0.25)", borderRadius: "12px", background: "rgba(47,140,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center"}}><div><p className="eyebrow">SELECTED MONTH</p><h4 style={{margin: "4px 0 0", color: "#f4f7f6"}}>{selectedMonth.month}</h4></div><div style={{textAlign: "right"}}><p className="eyebrow">CLAIMS</p><h4 style={{margin: "4px 0 0", color: "#2f8cff"}}>{selectedMonth.value}</h4></div></div>}
            </section>

            <section className="panel">
              <div className="panel-header">
                <div><p className="eyebrow">RISK DISTRIBUTION</p><h3>Current defect severity</h3></div>
              </div>
              <div className="table">
                <div onClick={() => setSelectedRisk("Critical")} className="table-row"><b>Critical</b><span>4 defects</span><span style={{background:"rgba(47,140,255,0.12)",padding:"6px 12px",borderRadius:"8px",minWidth:"58px",textAlign:"center"}}>17%</span><span className="risk critical">Immediate</span></div>
                <div onClick={() => setSelectedRisk("High")} className="table-row"><b>High</b><span>9 defects</span><span style={{background:"rgba(47,140,255,0.12)",padding:"6px 12px",borderRadius:"8px",minWidth:"58px",textAlign:"center"}}>38%</span><span className="risk high">Attention</span></div>
                <div onClick={() => setSelectedRisk("Medium")} className="table-row"><b>Medium</b><span>11 defects</span><span style={{background:"rgba(47,140,255,0.12)",padding:"6px 12px",borderRadius:"8px",minWidth:"58px",textAlign:"center"}}>45%</span><span className="risk medium">Monitor</span></div>
              </div>
                {selectedRisk && <div style={{marginTop: "14px", padding: "16px", border: "1px solid rgba(47,140,255,0.25)", borderRadius: "12px", background: "rgba(47,140,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center"}}><div><p className="eyebrow">SELECTED RISK</p><h4 style={{margin: "4px 0 0", color: "#f4f7f6"}}>{selectedRisk}</h4></div><div style={{textAlign: "right"}}><p className="eyebrow">STATUS</p><h4 style={{margin: "4px 0 0", color: "#2f8cff"}}>{selectedRisk === "Critical" ? "Immediate Review" : selectedRisk === "High" ? "Needs Attention" : "Monitor"}</h4></div></div>}
            </section>
          </section>
        )}

        {active === "Overview" && <>
        <section className="hero">
          <div>
            <p className="eyebrow">EARLY DEFECT DETECTION</p>
            <h2>
              Turn warranty data into
              <br />
              <span>early warnings.</span>
            </h2>
            <p className="hero-text">
              DefectSense AI analyzes warranty claims and complaint patterns
              to identify emerging defects before they escalate.
            </p>
            <button className="primary-btn" onClick={() => { setIsAnalyzing(true); setTimeout(() => { setIsAnalyzing(false); setActive("Claims") }, 1800) }}>
              Analyze Claims <span>→</span>
            </button>
            {isAnalyzing && <div className="ai-processing"><span className="ai-spinner"></span><div><b>AI Analysis in progress...</b><p>Scanning warranty claims and detecting emerging patterns</p></div></div>}

            <div className="ai-engine-status">
              <span className="ai-engine-pulse"></span>
              <div>
                <b>AI Detection Engine</b>
                <span>Monitoring warranty signals in real time</span>
              </div>
              <strong>ONLINE</strong>
            </div>
          </div>

          <div className="hero-visual">
            <div className="signal-card">
              <div className="signal-top">
                <span>DEFECT SIGNAL</span>
                <b>LIVE</b>
              </div>
              <div className="signal-value">+42.8%</div>
              <p>Battery-related complaints</p>
              <div className="signal-line">
                <i></i><i></i><i></i><i></i><i></i><i></i><i></i>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <p>Warranty Claims</p>
            <h3>{dashboard?.total_claims ?? '—'}</h3>
            <span className="up">Backend data</span>
          </div>

          <div className="stat-card">
            <p>Active Defects</p>
            <h3>{dashboard?.critical_defects ?? '—'}</h3>
            <span className="alert">Critical defects</span>
          </div>

          <div className="stat-card">
            <p>Risk Score</p>
            <h3>{dashboard?.critical_defects ? '94/100' : '—'}</h3>
            <span className="risk">AI risk signal</span>
          </div>

          <div className="stat-card">
            <p>Early Detection</p>
            <h3>{dashboard?.early_warnings ?? '—'}</h3>
            <span className="up">Early warnings</span>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">CLAIM INTELLIGENCE</p>
              <h3>Top emerging defects</h3>
            </div>
          </div>

          <div className="table">
            <div className="table-head">
              <span>PRODUCT</span>
              <span>DEFECT SIGNAL</span>
              <span>CLAIMS</span>
              <span>RISK</span>
            </div>

            {defects.slice(0, 3).map((defect) => (
              <div
                onClick={() => {
                  setSelectedDefect(defect)
                  setAiDefect(defect)
                  setActive("Defects")
                }}
                className="table-row"
                key={defect.name}
              >
                <b>{defect.product}</b>
                <span>{defect.name}</span>
                <span>{defect.claims}</span>
                <span className={"risk " + defect.severity.toLowerCase()}>{defect.severity}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="overview-insights">
          <div className="overview-warning">
            <div className="overview-warning-icon">AI</div>
            <div>
              <p className="eyebrow">AI EARLY WARNING</p>
              <h3>Battery overheating signal is accelerating</h3>
              <p>Model X1 complaints show a rising pattern across recent warranty claims.</p>
            </div>
            <span className="warning-badge">CRITICAL</span>
          </div>

          <div className="overview-activity panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">SYSTEM ACTIVITY</p>
                <div className="section-head" style={{marginTop: '28px'}}>
                  <div>
                    <h3>Live early-warning signals</h3>
                    <small>Date-based intelligence from the analysis engine</small>
                  </div>
                </div>

                <div className="claims-table" style={{marginTop: '14px'}}>
                  <div className="table-head">
                    <span>Defect</span>
                    <span>Change</span>
                    <span>Anomaly</span>
                    <span>Confidence</span>
                  </div>

                  {intelligenceData.map((item) => (
                    <div className="table-row" key={item.issue}>
                      <b>{item.issue}</b>
                      <span className={item.growth_percent > 0 ? "risk high" : ""}>
                        {item.growth_percent > 0 ? "+" : ""}
                        {item.growth_percent}%
                      </span>
                      <span className={item.anomaly ? "risk critical" : "risk medium"}>
                        {item.anomaly ? "Detected" : "Normal"}
                      </span>
                      <span>{item.confidence_score}%</span>
                    </div>
                  ))}
                </div>

                <div className="advanced-intelligence">
                  <div className="section-head">
                    <div>
                      <p className="eyebrow">INTELLIGENCE OVERVIEW</p>
                      <h3>Risk signals</h3>
                    </div>
                    <span className="section-meta">{intelligenceData.length} signals</span>
                  </div>

                  <div className="risk-signal-grid">
                    {intelligenceData.map((item) => (
                      <article className="risk-signal-card" key={item.issue}>
                        <div className="risk-signal-top">
                          <span className={`risk ${item.risk.toLowerCase()}`}>
                            {item.risk}
                          </span>
                          {item.anomaly && (
                            <span className="signal-anomaly">Anomaly</span>
                          )}
                        </div>

                        <h4>{item.issue}</h4>

                        <div className="risk-signal-metrics">
                          <div>
                            <span>Risk</span>
                            <strong>{item.score}/100</strong>
                          </div>
                          <div>
                            <span>Confidence</span>
                            <strong>{item.confidence_score}/100</strong>
                          </div>
                          <div>
                            <span>Trend</span>
                            <strong>{item.trend}</strong>
                          </div>
                        </div>

                        <p>{item.explanation}</p>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="smart-alerts">
                  <div className="section-head">
                    <div>
                      <p className="eyebrow">SMART ALERTS</p>
                      <h3>Early-warning center</h3>
                    </div>
                    <span className="section-meta">
                      {intelligenceData.filter((item) => item.early_warning).length} active
                    </span>
                  </div>

                  <div className="alert-list">
                    {intelligenceData
                      .filter((item) => item.early_warning)
                      .map((item) => (
                        <article className="alert-card" key={`alert-${item.issue}`}>
                          <div className="alert-indicator"></div>

                          <div className="alert-content">
                            <div className="alert-heading">
                              <div>
                                <span className={`risk ${item.risk.toLowerCase()}`}>
                                  {item.risk}
                                </span>
                                <h4>{item.issue}</h4>
                              </div>

                              <strong>{item.score}/100</strong>
                            </div>

                            <p>
                              {item.trend === "New signal"
                                ? "New defect signal detected in recent claims."
                                : `${item.claims} claims detected with ${item.risk.toLowerCase()} risk.`}
                            </p>

                            <div className="alert-footer">
                              <span>Confidence {item.confidence_score}%</span>
                              <span>{item.trend}</span>
                              {item.anomaly && <span className="alert-anomaly">Anomaly detected</span>}
                            </div>
                          </div>
                        </article>
                      ))}
                  </div>
                </div>

                <div className="advanced-analytics">
                  <div className="section-head">
                    <div>
                      <p className="eyebrow">ADVANCED ANALYTICS</p>
                      <h3>Operational trends</h3>
                    </div>
                    <span className="section-meta">Live dataset</span>
                  </div>

                  <div className="analytics-grid">
                    <article className="analytics-card">
                      <div className="analytics-card-head">
                        <div>
                          <span>Claims by product</span>
                          <strong>{claimsData.length} total claims</strong>
                        </div>
                      </div>

                      <div className="analytics-bars">
                        {[...new Set(claimsData.map((claim) => claim.product))]
                          .map((product) => {
                            const count = claimsData.filter((claim) => claim.product === product).length
                            const percentage = claimsData.length
                              ? Math.round((count / claimsData.length) * 100)
                              : 0

                            return (
                              <div className="analytics-bar-row" key={product}>
                                <div className="analytics-label">
                                  <span>{product}</span>
                                  <strong>{count}</strong>
                                </div>
                                <div className="analytics-track">
                                  <div
                                    className="analytics-fill"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </article>

                    <article className="analytics-card">
                      <div className="analytics-card-head">
                        <div>
                          <span>Severity distribution</span>
                          <strong>Risk concentration</strong>
                        </div>
                      </div>

                      <div className="severity-list">
                        {["Critical", "High", "Medium", "Low"].map((severity) => {
                          const count = claimsData.filter(
                            (claim) => claim.severity === severity
                          ).length
                          const percentage = claimsData.length
                            ? Math.round((count / claimsData.length) * 100)
                            : 0

                          return (
                            <div className="severity-row" key={severity}>
                              <div>
                                <span className={`risk ${severity.toLowerCase()}`}>
                                  {severity}
                                </span>
                                <strong>{count}</strong>
                              </div>
                              <span>{percentage}%</span>
                            </div>
                          )
                        })}
                      </div>
                    </article>
                  </div>

                  <div className="analytics-card analytics-wide">
                    <div className="analytics-card-head">
                      <div>
                        <span>Top defect signals</span>
                        <strong>Detected across current claims</strong>
                      </div>
                    </div>

                    <div className="defect-bars">
                      {defects.slice(0, 5).map((defect) => {
                        const maxClaims = Math.max(
                          ...defects.map((item) => item.claims),
                          1
                        )
                        const percentage = Math.round(
                          (defect.claims / maxClaims) * 100
                        )

                        return (
                          <div className="defect-bar-row" key={defect.issue}>
                            <div className="analytics-label">
                              <span>{defect.issue}</span>
                              <strong>{defect.claims}</strong>
                            </div>
                            <div className="analytics-track">
                              <div
                                className="analytics-fill"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="reports-center">
                  <div className="section-head">
                    <div>
                      <p className="eyebrow">REPORTING</p>
                      <h3>Reports & exports</h3>
                    </div>
                    <span className="section-meta">Current dataset</span>
                  </div>

                  <div className="report-panel">
                    <div className="report-summary">
                      <div>
                        <span>Total claims</span>
                        <strong>{claimsData.length}</strong>
                      </div>
                      <div>
                        <span>Defect signals</span>
                        <strong>{defects.length}</strong>
                      </div>
                      <div>
                        <span>Critical claims</span>
                        <strong>{claimsData.filter((claim) => claim.severity === "Critical").length}</strong>
                      </div>
                      <div>
                        <span>Active warnings</span>
                        <strong>{intelligenceData.filter((item) => item.early_warning).length}</strong>
                      </div>
                    </div>

                    <div className="report-actions">
                      <button
                        type="button"
                        className="primary-action"
                        onClick={() => {
                          const report = buildDefectSenseReport(
                            claimsData,
                            defects,
                            intelligenceData
                          )
                          downloadDefectSenseFile(
                            `defectsense-report-${new Date().toISOString().slice(0, 10)}.json`,
                            JSON.stringify(report, null, 2),
                            "application/json"
                          )
                        }}
                      >
                        Export JSON report
                      </button>

                      <button
                        type="button"
                        className="secondary-action"
                        onClick={() => {
                          const headers = ["claim_id", "product", "issue", "severity", "date"]
                          const rows = claimsData.map((claim) =>
                            headers.map((header) =>
                              JSON.stringify(claim[header] ?? "")
                            ).join(",")
                          )
                          downloadDefectSenseFile(
                            `defectsense-claims-${new Date().toISOString().slice(0, 10)}.csv`,
                            [headers.join(","), ...rows].join("\n"),
                            "text/csv;charset=utf-8"
                          )
                        }}
                      >
                        Export claims CSV
                      </button>
                    </div>

                    <p className="report-note">
                      Reports contain the current dashboard dataset, intelligence signals,
                      defect analysis and critical claims.
                    </p>
                  </div>
                </div>

                <div className="workspace-center">
                  <div className="section-head">
                    <div>
                      <p className="eyebrow">WORKSPACE</p>
                      <h3>DefectSense workspace</h3>
                    </div>
                    <span className="workspace-status">Active</span>
                  </div>

                  <div className="workspace-panel">
                    <div className="workspace-main">
                      <div className="workspace-icon">DS</div>
                      <div>
                        <strong>DefectSense AI</strong>
                        <span>Product intelligence workspace</span>
                      </div>
                    </div>

                    <div className="workspace-meta">
                      <div>
                        <span>Workspace ID</span>
                        <strong>DS-2026-PROD</strong>
                      </div>
                      <div>
                        <span>Data source</span>
                        <strong>Claims intelligence</strong>
                      </div>
                      <div>
                        <span>Access</span>
                        <strong>Team workspace</strong>
                      </div>
                    </div>

                    <div className="workspace-team">
                      <div className="workspace-team-head">
                        <div>
                          <span className="eyebrow">TEAM</span>
                          <h4>Workspace members</h4>
                        </div>
                        <span>2 members</span>
                      </div>

                      <div className="member-list">
                        <div className="member">
                          <div className="member-avatar">J</div>
                          <div>
                            <strong>Jayant</strong>
                            <span>Workspace owner</span>
                          </div>
                          <b>Owner</b>
                        </div>

                        <div className="member">
                          <div className="member-avatar">V</div>
                          <div>
                            <strong>Vedant</strong>
                            <span>Project collaborator</span>
                          </div>
                          <b>Member</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h3>Latest intelligence</h3>
              </div>
            </div>

            <div className="activity-item">
              <span className="activity-dot"></span>
              <div>
                <b>482 claims analyzed</b>
                <p>Battery overheating pattern detected</p>
              </div>
              <span>Now</span>
            </div>

            <div className="activity-item">
              <span className="activity-dot"></span>
              <div>
                <b>New defect signal</b>
                <p>Model A7 brake vibration cluster identified</p>
              </div>
              <span>8m</span>
            </div>

            <div className="activity-item">
              <span className="activity-dot"></span>
              <div>
                <b>Risk score updated</b>
                <p>Overall warranty risk moved to 78/100</p>
              </div>
              <span>21m</span>
            </div>
          </div>
        </section>

        </>}

        <footer>
          <span>DefectSense AI</span>
          <span>Warranty Claims Mining • Early Defect Detection</span>
        </footer>
      </main>
    </div>
  )
}

export default App
