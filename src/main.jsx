import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

class BootBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return <div style={{padding:'32px',fontFamily:'monospace',background:'#070a0f',color:'#ff7070',minHeight:'100vh'}}>
        <h1 style={{color:'#2f8cff'}}>DefectSense AI</h1>
        <h2>Frontend Runtime Error</h2>
        <pre style={{whiteSpace:'pre-wrap'}}>{this.state.error?.stack || this.state.error?.message || String(this.state.error)}</pre>
      </div>
    }
    return this.props.children
  }
}

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <BootBoundary>
      <div style={{padding:'24px',fontFamily:'system-ui',background:'#070a0f',color:'#fff',minHeight:'100vh'}}>
        Loading DefectSense AI...
      </div>
    </BootBoundary>
  </StrictMode>
)

import('./App.jsx')
  .then(({ default: App }) => {
    root.render(
      <StrictMode>
        <BootBoundary>
          <App />
        </BootBoundary>
      </StrictMode>
    )
  })
  .catch((error) => {
    root.render(
      <div style={{padding:'32px',fontFamily:'monospace',background:'#070a0f',color:'#ff7070',minHeight:'100vh'}}>
        <h1 style={{color:'#2f8cff'}}>DefectSense AI</h1>
        <h2>App Load Error</h2>
        <pre style={{whiteSpace:'pre-wrap'}}>{error?.stack || error?.message || String(error)}</pre>
      </div>
    )
  })
