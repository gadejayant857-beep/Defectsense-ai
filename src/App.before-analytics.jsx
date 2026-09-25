import { useState } from 'react'
import './App.css'

function App() {
  const [active, setActive] = useState('Overview')

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
              <div className="table">
                <div className="table-head"><span>CLAIM ID</span><span>PRODUCT</span><span>ISSUE</span><span>RISK</span></div>
                <div className="table-row"><b>#CLM-10482</b><span>Model X1</span><span>Battery overheating</span><span className="risk critical">Critical</span></div>
                <div className="table-row"><b>#CLM-10481</b><span>Model A7</span><span>Brake vibration</span><span className="risk high">High</span></div>
                <div className="table-row"><b>#CLM-10480</b><span>Model X1</span><span>Display failure</span><span className="risk medium">Medium</span></div>
              </div>
            </section>
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
                <div className="table-row"><b>Battery overheating</b><span>Model X1</span><span>482</span><span className="risk critical">Critical</span></div>
                <div className="table-row"><b>Brake vibration</b><span>Model A7</span><span>317</span><span className="risk high">High</span></div>
                <div className="table-row"><b>Display failure</b><span>Model X1</span><span>246</span><span className="risk high">High</span></div>
                <div className="table-row"><b>Charging fault</b><span>Model B4</span><span>189</span><span className="risk medium">Medium</span></div>
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
            <button className="primary-btn">
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
