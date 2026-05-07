import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LangProvider } from './contexts/LangContext.jsx'
import { CityProvider } from './contexts/CityContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LangProvider>
      <CityProvider>
        <App />
      </CityProvider>
    </LangProvider>
  </StrictMode>,
)
