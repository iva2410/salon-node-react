import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext.jsx'
import CityContextProvider from './context/CityContext.jsx'
import TopRated from './components/TopRated/TopRated.jsx'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <CityContextProvider>
    <AppContextProvider>
      <App />
     
    </AppContextProvider>
  </CityContextProvider>
    
  </BrowserRouter>
)
