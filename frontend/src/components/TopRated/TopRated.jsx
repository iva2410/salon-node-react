import React, { useContext, useEffect, useState } from 'react'
import './TopRated.css'

import { AppContext } from '../../context/AppContext'
import { gradoviPadezi } from '../../assets/assets'
import NewSalons from '../NewSalons/NewSalons.jsx'
import { CityContext } from '../../context/CityContext.jsx'
import { useNavigate } from 'react-router-dom'



const TopRated = () => {

    const { saloni,calculateAverageRating } = useContext(AppContext)
    const {gradovi}=useContext(AppContext)
    const navigate=useNavigate()

    const {selectedCity, setSelectedCity} = useContext(CityContext)
    const [showCities, setShowCities] = useState(false)
     
    const dropDown = () => {
        setShowCities(!showCities)
    }

    const selectCity = (city) => {
        setSelectedCity(city)
        setShowCities(false);
        
    }

  

   
    const saloniWithAverageRating = saloni.map((salon) => ({
        ...salon,
        averageRating: calculateAverageRating(salon.ratings),
    }))
    const filtriraniSaloni=saloniWithAverageRating.filter((salon)=>salon.grad===selectedCity)

    return (
        <div className='top-rated' id='top-rated'>
                <h1>Najbolje ocenjeni saloni u <a onClick={dropDown}> {gradoviPadezi[selectedCity]}
                    </a>
                </h1>
            
                <span>
                    {
                        showCities && (
                            <div className='top-rated-span'>
                                <p>Izaberite svoj grad:</p>
                                <ul>
                                    {
                                        gradovi.map((grad, index) => (
                                            <div key={index} onClick={() => selectCity(grad.ime)} className='gradovi'>
                                                {grad.ime}
                                            </div>
                                        ))

                                    }
                                </ul>
                            </div>
                        )}
                </span>
           

            <div className="top-rated-list">
                {filtriraniSaloni.sort((a, b) => b.averageRating - a.averageRating).slice(0, 4).map((item, index) => (
                    
                    <div  onClick={()=>navigate(`/${selectedCity}/${item.name}`)} className='top-rated-list-item' key={index} >
                        <img src={item.image[0]} alt="" />
                        <div className='info'>
                            <p className='ime'>{item.name} </p> 
                            <p className='ocena'> {item.averageRating} </p> 
                        </div>
                       
                    </div>
                ))}
            </div>
            <hr />
            <NewSalons selectedCity={selectedCity}/>
            
            

        </div>
        
    )
   

}

export default TopRated