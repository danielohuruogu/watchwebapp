import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThreeProvider } from './utils/utils.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThreeProvider>
      <App />
    </ThreeProvider>
  </StrictMode>,
)
