import React, { useContext } from 'react'
import './Header.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { CityContext } from '../../context/CityContext'
const Header = () => {
  const navigate=useNavigate()
  const {selectedCity} = useContext(CityContext)
  console.log(selectedCity);
  return (
    <div className='header'>
        <div className="header-contents">
            <h2>Odaberite tretman po svojoj meri</h2>
            <p>Uživajte u vrhunskim salonima i upravljajte svojim terminima sa BeBeauty aplikacijom - јоš lakše i brže!</p>
            <button onClick={()=>{navigate(`/saloni/${selectedCity}`); scrollTo(0,0)}}>Istražite</button>
         
        </div>
    </div>
  )
}

export default Header