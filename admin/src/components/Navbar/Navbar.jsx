import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import {NavLink, useNavigate} from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import { RadnikContext } from '../../context/RadnikContext'
const Navbar = () => {
    const {aToken,setAToken} =useContext(AdminContext)
    const {rToken,setRToken}=useContext(RadnikContext)
    const navigate=useNavigate()
    const [showMenu,setShowMenu]=useState(false);
    const logout =()=>{
        navigate('/')
        aToken && setAToken ('')
        aToken && localStorage.removeItem('aToken')
       
        rToken && setRToken('')
        rToken && localStorage.removeItem('rToken')

    }
  return (
    <div className='navbar'>
        <div className='navbar-left' onClick={()=>navigate('/admin-saloni')}>
        <p className='left-p'>BeBeauty</p>
        <img src={assets.women} alt="" className='logo1' />
      </div>


      <img className="menu-icon" onClick={()=>setShowMenu(true)} src={assets.menu} alt="" />
      <div className={`menu-container ${showMenu ? 'open' : ''}`}> 
        <div className='menu-header'>
          <img className="close-icon" onClick={()=>setShowMenu(false)}  src={assets.cross} alt="" />
        </div>
        {
            aToken &&
        <ul className='menu-list'>
                    <NavLink  onClick={()=>setShowMenu(false)} to='/admin-saloni'>Lista salona</NavLink>
                    <NavLink  onClick={()=>setShowMenu(false)} to='/dodaj-salon'>Dodaj salon</NavLink>
                    <NavLink  onClick={()=>setShowMenu(false)} to='/dodaj-radnika'>Dodaj radnika</NavLink>
                    <NavLink  onClick={()=>setShowMenu(false)} to='/admin-termini'>Termini</NavLink>
          </ul>
}
{
            rToken &&
        <ul className='menu-list'>
                    <NavLink  onClick={()=>setShowMenu(false)} to='/radnik-dashboard'>Dashboard</NavLink>
                    <NavLink  onClick={()=>setShowMenu(false)} to='/radnik-salon'>Salon</NavLink>
                    <NavLink  onClick={()=>setShowMenu(false)} to='/radnik-termini'>Termini</NavLink>
                    <NavLink  onClick={()=>setShowMenu(false)} to='/radnik-komentari'>Recenzije</NavLink>
          </ul>
}
          </div>

      
      <button onClick={logout} className='btn-logout'>Odjavi se</button>
    </div>
  )
}

export default Navbar