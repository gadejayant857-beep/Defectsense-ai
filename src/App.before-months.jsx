import { useState } from 'react'
import './App.css'

function App() {
  const [active, setActive] = useState('Overview')
  const [claimSearch, setClaimSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('All')
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [selectedDefect, setSelectedDefect] = useState(null)
  const claims = [
    { id: '#CLM-10482', product: 'Model X1', issue: 'Battery overheating', risk: 'Critical' },
    { id: '#CLM-10481', product: 'Model A7', issue: 'Brake vibration', risk: 'High' },
    { id: '#CLM-10480', product: 'Model X1', issue: 'Display failure', risk: 'Medium' },
    { id: '#CLM-10479', product: 'Model B4', issue: 'Charging fault', risk: 'High' },
    { id: '#CLM-10478', product: 'Model C2', issue: 'Camera failure', risk: 'Medium' }
  ]

  const defects = [
    { name: 'Battery overheating', product: 'Model X1', claims: 482, severity: 'Critical' },
    { name: 'Brake vibration', product: 'Model A7', claims: 317, severity: 'High' },
    { name: 'Display failure', product: 'Model X1', claims: 246, severity: 'High' },
    { name: 'Charging fault', product: 'Model B4', claims: 189, severity: 'Medium' }
  ]

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
            <div className="claims-stats">
              <div className="stat-card"><p>Total Claims</p><h3>12,486</h3><span className="up">+18.4%</span></div>
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
              <div className="table">
                <div className="table-head"><span>CLAIM ID</span><span>PRODUCT</span><span>ISSUE</span><span>RISK</span></div>
                {filteredClaims.map((claim) => (
                  <div className="table-row" key={claim.id}>
                    <b onClick={() => setSelectedClaim(claim)} style={{cursor: "pointer"}}>{claim.id}</b>
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
                <div className="table">
                  <div className="table-row"><b>Product</b><span>{selectedClaim.product}</span></div>
                  <div className="table-row"><b>Detected Defect</b><span>{selectedClaim.issue}</span></div>
                  <div className="table-row"><b>Risk Level</b><span className="risk">{selectedClaim.risk}</span></div>
                  <div className="table-row"><b>AI Confidence</b><span>94.2%</span></div>
                </div>
                <div className="detail-grid">
                  <div><p>COMPLAINT SUMMARY</p><h4>Customer reports recurring symptoms related to the detected defect.</h4></div>
                  <div><p>DETECTED KEYWORDS</p><h4>overheating • battery • temperature • shutdown</h4></div>
                  <div><p>RECOMMENDED ACTION</p><h4>Prioritize engineering review and monitor claim frequency.</h4></div>
                </div>
              </section>
            )}
          </section>
        )}

        {active === "Defects" && (
          <section className="defects-dashboard">
            <div className="claims-stats">
              <div className="stat-card"><p>Active Defects</p><h3>24</h3><span className="alert">+6 detected</span></div>
              <div className="stat-card"><p>Critical</p><h3>4</h3><span className="risk">Immediate review</span></div>
              <div className="stat-card"><p>High Severity</p><h3>9</h3><span className="risk">Needs attention</span></div>
              <div className="stat-card"><p>AI Confidence</p><h3>94.2%</h3><span className="up">+2.8%</span></div>
            </div>

            <section className="panel">
              <div className="panel-header">
                <div><p className="eyebrow">DEFECT INTELLIGENCE</p><h3>Emerging defect signals</h3></div>
              </div>
              <div className="table">
                <div className="table-head"><span>DEFECT</span><span>PRODUCT</span><span>CLAIMS</span><span>SEVERITY</span></div>
                {defects.map((defect) => (
                  <div className="table-row" key={defect.name}>
                    <b onClick={() => setSelectedDefect(defect)} style={{cursor: "pointer"}}>{defect.name}</b>
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
            <div className="claims-stats">
              <div className="stat-card"><p>Claims Analyzed</p><h3>12,486</h3><span className="up">+18.4%</span></div>
              <div className="stat-card"><p>Detection Accuracy</p><h3>91.6%</h3><span className="up">+4.2%</span></div>
              <div className="stat-card"><p>Avg. Risk Score</p><h3>78/100</h3><span className="risk">High attention</span></div>
              <div className="stat-card"><p>Early Warnings</p><h3>186</h3><span className="up">+23 this month</span></div>
            </div>

            <section className="panel">
              <div className="panel-header">
                <div><p className="eyebrow">CLAIM TREND</p><h3>Monthly warranty claims</h3></div>
              </div>
              <div style={{height: "220px", display: "flex", alignItems: "end", gap: "10px", padding: "20px 0"}}>
                {[45,58,52,70,64,82,76,95,88,100,92,108].map((value, i) => (
                  <div key={i} style={{flex: 1, height: value + "px", background: "#43f59a", opacity: 0.45 + i * 0.04, borderRadius: "6px 6px 2px 2px"}}></div>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div><p className="eyebrow">RISK DISTRIBUTION</p><h3>Current defect severity</h3></div>
              </div>
              <div className="table">
                <div className="table-row"><b>Critical</b><span>4 defects</span><span>17%</span><span className="risk critical">Immediate</span></div>
                <div className="table-row"><b>High</b><span>9 defects</span><span>38%</span><span className="risk high">Attention</span></div>
                <div className="table-row"><b>Medium</b><span>11 defects</span><span>45%</span><span className="risk medium">Monitor</span></div>
              </div>
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
            <button className="primary-btn" onClick={() => setActive("Claims")}>
              Analyze Claims <span>→</span>
            </button>
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
            <h3>12,486</h3>
            <span className="up">+18.4%</span>
          </div>

          <div className="stat-card">
            <p>Active Defects</p>
            <h3>24</h3>
            <span className="alert">+6 detected</span>
          </div>

          <div className="stat-card">
            <p>Risk Score</p>
            <h3>78/100</h3>
            <span className="risk">High attention</span>
          </div>

          <div className="stat-card">
            <p>Early Detection</p>
            <h3>91.6%</h3>
            <span className="up">+4.2%</span>
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

            <div className="table-row">
              <b>Model X1</b>
              <span>Battery overheating</span>
              <span>482</span>
              <span className="risk critical">Critical</span>
            </div>

            <div className="table-row">
              <b>Model A7</b>
              <span>Brake vibration</span>
              <span>317</span>
              <span className="risk high">High</span>
            </div>

            <div className="table-row">
              <b>Model X1</b>
              <span>Display failure</span>
              <span>246</span>
              <span className="risk medium">Medium</span>
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
