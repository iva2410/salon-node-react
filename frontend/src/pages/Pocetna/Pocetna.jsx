import React, { useState } from 'react'
import './Pocetna.css'
import Header from '../../components/Header/Header'
import Menu from '../../components/Menu/Menu'
import TopRated from '../../components/TopRated/TopRated'
import NewSalons from '../../components/NewSalons/NewSalons'

const Pocetna = () => {
  
  return (
    <div>
        <Header/>
        <Menu/>
        <TopRated/>
    </div>
  )
}

export default Pocetna