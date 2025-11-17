import React, { useContext } from 'react'
import Login from './pages/login/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Saloni from './pages/Admin/Saloni/Saloni';
import Termini from './pages/Admin/Termini/Termini';
import AddRadnik from './pages/Admin/AddRadnik/AddRadnik';
import AddSalon from './pages/Admin/AddSalon/AddSalon';
import { RadnikContext } from './context/RadnikContext';
import Dashboard from './pages/Radnik/Dashboard/Dashboard';
import Salon from './pages/Radnik/Salon/Salon';
import TerminiRadnik from './pages/Radnik/Termini/TerminiRadnik';
import Komentari from './pages/Radnik/Komentari/Komentari';

const App = () => {
  const {aToken}=useContext(AdminContext)
  const {rToken}=useContext(RadnikContext)
  return aToken || rToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex '>
        <Sidebar/>
        <Routes>
          <Route path='/admin-saloni' element={<Saloni/>}/>
          <Route path='/admin-termini' element={<Termini/>}/>

          <Route path='/dodaj-radnika' element={<AddRadnik/>}/>
          <Route path='/dodaj-salon' element={<AddSalon/>}/>
          

          <Route path='/radnik-dashboard' element={<Dashboard/>}/>
          <Route path='/radnik-komentari' element={<Komentari/>}/>
          <Route path='/radnik-salon' element={<Salon/>}/>
          <Route path='/radnik-termini' element={<TerminiRadnik/>}/>

        </Routes>
      </div>
    </div>
  ) : (
    <>
    <Login/>
    <ToastContainer/>
    </>
  )
}

export default App