import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// DefectSense production boot v2

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('DefectSense Runtime Error:', error, info)
  }

  render() {
    if (this.state.error) {
      const message = this.state.error?.stack || this.state.error?.message || String(this.state.error)
      document.title = 'DefectSense Error'
      return (
        <div style={{ padding: '32px', fontFamily: 'monospace', background: '#070a0c', color: '#f4f7f6', minHeight: '100vh', boxSizing: 'border-box' }}>
          <h1 style={{color:'#2f8cff'}}>DefectSense AI</h1>
          <h2 style={{color:'#ff7070'}}>React Runtime Error</h2>
          <pre style={{ whiteSpace: 'pre-wrap', textAlign:'left', color:'#ff7070', fontSize:'13px', lineHeight:'1.6' }}>
            {message}
          </pre>
        </div>
      )
    }

    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
