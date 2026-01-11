import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.jsx'
import { TermProvider } from './context/TermContext.jsx'
import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <TermProvider>
    <AuthProvider>
    <App />
    </AuthProvider>
    </TermProvider>
  // </StrictMode>,
)
