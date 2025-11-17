import React, { useContext, useEffect, useState } from 'react'
import './NewSalons.css'
import { AppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'

const NewSalons = ({selectedCity}) => {
    const {saloni} =useContext(AppContext)
    const [salon,setSalon]=useState([])
    const navigate=useNavigate()
    useEffect(()=>{ 
        const filterSalon=saloni.filter((salon)=>salon.grad===selectedCity)
        setSalon(filterSalon.reverse())
    },[selectedCity])
  return (
    <div className='new-salons' id='new-salons'>
        <h1>Novi saloni u Vašem gradu</h1>
            <div className='new-salons-list'>
                {salon.slice(0,4).map((item,index)=>(
                    <div onClick={()=>navigate(`/${selectedCity}/${item.name}`)} className="new-list" key={index}>
                       <img src={item.image[0]} alt="" />
                        <div>
                            <p>{item.name}</p>
                        </div>
                    </div>
                ))}
            </div>
            <hr/>
    </div>
  )
}

export default NewSalons