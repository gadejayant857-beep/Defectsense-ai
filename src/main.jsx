import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

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
      return (
        <div style={{ padding: '32px', fontFamily: 'monospace', background: '#0b0f14', color: '#f4f7f6', minHeight: '100vh', boxSizing: 'border-box' }}>
          <h1>DefectSense Runtime Error</h1>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#ff6b6b' }}>
            {this.state.error.stack || this.state.error.message}
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
