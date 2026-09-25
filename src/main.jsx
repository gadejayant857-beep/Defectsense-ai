import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#070a0c',color:'#f4f7f6',fontFamily:'system-ui'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:'48px',fontWeight:'800'}}>DefectSense AI</div>
        <div style={{marginTop:'12px',color:'#2f8cff'}}>React + Vite: SUCCESS</div>
      </div>
    </div>
  </StrictMode>,
)
