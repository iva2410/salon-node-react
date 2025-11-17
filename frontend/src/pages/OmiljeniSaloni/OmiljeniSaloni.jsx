import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const OmiljeniSaloni = () => {
    const {token,backendUrl,calculateAverageRating}=useContext(AppContext)
    const [favorites,setFavorites]=useState([])

    const favoriteSalons=async()=>{
        try {
            const { data } = await axios.get(backendUrl + '/api/user/lista-omiljenih',{headers:{token}})
            if (data.success) {
                setFavorites(data.omiljeniSaloni)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)

        }
    }
    console.log(favorites);

    useEffect(()=>{
        if(token){
            favoriteSalons()
        }
    },[token])
    
  return (
    <div>

<div className='saloni-lista'>
            {
              favorites.map((item, index) => (
                <div onClick={()=>navigate(`/${item.name}`)} className='saloni'  key={index}>
                  <img src={item.image[0]} alt="" />
                  <div className='info'>
                    <p className='ime'>{item.name} </p>
                    <p className='ocena'> {calculateAverageRating(item.ratings)}</p>
                  </div>
                
                </div>

              ))}
          </div>

    </div>
  )
}

export default OmiljeniSaloni