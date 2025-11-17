import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'

const Navbar = () => {

  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext)
  const navigate = useNavigate()
  

  const handleClick=(e)=>{
    if(!token)
      {
      e.preventDefault()
      toast.warn('Prijavite se')
      navigate('/login')
    }
  }

  const handleProtected=(e)=>{
    if(!token){
      e.preventDefault()
      toast.warn('Prijavite se')
      setShowMenu(false)
      navigate('/login')
    }else{
      setShowMenu(false)
    }
  }
  const logout = () => {
    navigate('/')
    setToken(false)
    localStorage.removeItem('token')
  }

  return (
    <div className='navbar'>
      <div className='navbar-left' onClick={() => navigate('/')}>
        <p className='left-p'>BeBeauty</p>
        <img src={assets.women} alt="" className='logo1' />
      </div>
      <ul className="navbar-menu">
        <NavLink to='/'>
          <li >POČETNA</li>
        </NavLink>
        <NavLink to='/saloni'>
          <li >SALONI</li>
        </NavLink>
        <NavLink to='/informacije'>
          <li >O NAMA</li>
        </NavLink>
        <NavLink to='/moj-profil' onClick={handleClick}>
          <li>PROFIL</li>
        </NavLink>
        <NavLink to='/moji-termini'  onClick={handleClick}>
          <li>ZAKAZIVANJA</li>
        </NavLink>
        

      </ul>
      <div className="navbar-right">
        {
          token && userData
            ? <button className='btn-login' onClick={(logout)}>Odjavi se</button>

            : <button className='btn-login' onClick={() => navigate('/login')}>Prijavite se</button>
        }
        <img className="menu-icon" onClick={() => setShowMenu(true)} src={assets.menu_icon} alt="" />
        <div className={`menu-container ${showMenu ? 'open' : ''}`}>
          <div className='menu-header'>
            <img className='logo' src={assets.women} alt="" />
            <img className="close-icon" onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
          </div>
          <ul className='menu-list'>
            <NavLink onClick={() => setShowMenu(false)} to='/'>POČETNA</NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/saloni'>SALONI</NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/informacije'>O NAMA</NavLink>
            <NavLink onClick={handleProtected} to='/moj-profil'>PROFIL</NavLink>
            <NavLink onClick={handleProtected} to='/moji-termini'>ZAKAZIVANJA</NavLink>
          </ul>
        </div>
      </div>
    </div>

  )
}

export default Navbar