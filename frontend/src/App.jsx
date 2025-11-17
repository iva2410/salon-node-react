import React from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Pocetna from './pages/Pocetna/Pocetna'
import Saloni from './pages/Saloni/Saloni'
import Zakazivanja from './pages/Zakazivanja/Zakazivanja'
import MojProfil from './pages/MojProfil/MojProfil'
import Footer from './components/Footer/Footer'
import Login from './pages/Login/Login'
import Salon from './pages/Salon/Salon'
import Termini from './pages/Termini/Termini'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OmiljeniSaloni from './pages/OmiljeniSaloni/OmiljeniSaloni'
import Recenzije from './pages/Recenzije/Recenzije'
import Reviews from './pages/Reviews/Reviews'
import About from './pages/About/About'
import Pitanja from './pages/Pitanja/Pitanja'

const App = () => {
  return (
    <>
    <div className='app'>
    <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Pocetna/>} />
        <Route path='/saloni' element={<Saloni/>} />
        <Route path='/saloni/:grad' element={<Saloni/>} />
        <Route path='/saloni/:tip/:grad' element={<Saloni/>} />
        <Route path='/moji-termini' element={<Zakazivanja/>} />
        <Route path='/moj-profil' element={<MojProfil/>} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/:grad/:naziv' element={<Salon/>}/>
        <Route path='/termin/:naziv/:usluga' element={<Termini/>}/>
        <Route path='/omiljeni-saloni' element={<OmiljeniSaloni/>}/>
        <Route path='/komentari' element={<Reviews/>}/>
        <Route path='/informacije' element={<About/>}/>
        <Route path='/pitanja' element={<Pitanja/>}/>
      </Routes>
      <Footer/>
    </div>
    
    </>
  )
}

export default App