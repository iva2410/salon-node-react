import React, { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'
import './Sidebar.css'
import { RadnikContext } from '../../context/RadnikContext'

const Sidebar = () => {
    const {aToken}=useContext(AdminContext)
    const {rToken}=useContext(RadnikContext)
  return (
    <div className='sidebar'>
        {
            aToken && <ul>
                <NavLink  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}  to={'/admin-saloni'}>
                    <img src={assets.salons} alt="" />
                    <p>Lista salona</p>
                </NavLink>

                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}  to={'/dodaj-salon'}>
                    <img src={assets.add_icon} alt="" />
                    <p>Dodaj salon</p>
                </NavLink>

                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}  to={'/dodaj-radnika'}>
                    <img src={assets.people} alt="" />
                    <p>Dodaj radnika</p>
                </NavLink>

                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}  to={'/admin-termini'}>
                    <img src={assets.calendar} alt="" />
                    <p>Termini</p>
                </NavLink>
            </ul>
        }
        {
            rToken && <ul>
                <NavLink  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}  to={'/radnik-dashboard'}>
                    <img src={assets.salons} alt="" />
                    <p>Dashboard</p>
                </NavLink>

                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}  to={'/radnik-salon'}>
                    <img src={assets.add_icon} alt="" />
                    <p>Salon</p>
                </NavLink>

                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}  to={'/radnik-termini'}>
                    <img src={assets.calendar} alt="" />
                    <p>Termini</p>
                </NavLink>

                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}  to={'/radnik-komentari'}>
                    <img src={assets.comments} alt="" />
                    <p>Recenzije</p>
                </NavLink>
            </ul>
        }
    </div>
  )
}

export default Sidebar