import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import './Menu.css'
import { tip } from '../../assets/assets'
import NewSalons from '../NewSalons/NewSalons'
import { CityContext } from '../../context/CityContext'

const Menu = () => {
    const {selectedCity} =useContext(CityContext)
    return (
        <div className='explore-menu' id='explore-menu'>
            <h1>Usluge</h1>
            <div className="explore-menu-list">
                {tip.map((item, index) => (
                    
                        <Link onClick={()=>{scrollTo(0,0)}} className='explore-menu-list-item' key={index} to={`/saloni/${item.name}/${selectedCity}`}>
                            <img src={item.image} alt="" />
                            <p>{item.name}</p>
                        </Link>
                    
                ))}
            </div>
            <hr />
        </div>
    )
}

export default Menu