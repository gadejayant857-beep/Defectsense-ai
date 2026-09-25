import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const root = document.getElementById('root')

function showBootError(title, error) {
  root.innerHTML = '<div style="min-height:100vh;background:#0b0f14;color:#f4f7f6;font-family:monospace;padding:32px;box-sizing:border-box"><h2 style="margin-top:0">' + title + '</h2><pre style="white-space:pre-wrap;color:#ff6b6b;font-size:14px">' + String(error?.stack || error?.message || error || 'Unknown error') + '</pre></div>'
}

import('./App.jsx')
  .then(({ default: App }) => {
    root.innerHTML = ''
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
  .catch((error) => showBootError('DefectSense App Load Error', error))
