import React from 'react'
import { assets } from '../../assets/assets'
import './About.css'

const About = () => {
  return (
    <div className='about-container'>
        <h2>O nama</h2>
        <p> BeBeauty je način za otkrivanje salona lepote, frizerskih i kozmetičkih
        salona i masaža. Sada možete direktno zakazati svoj termin, onda kada
        Vama odgovara, sa više poverenja i više mogućnosti izbora. Zakazivanje
        tretmana lepote treba da bude lakše i brže.
        <br />
        <br />
        U središtu platforme stoji sistem za rezervacije u realnom vremenu koji
        radi bilo gde, 24 časa dnevno i koji povezuje korisnike i salone.
        Korisnici mogu sami da odaberu salon i termin, pa i zaposlenog u
        salonu, onako kako njima odgovara. </p>
<img src={assets.slika} alt="" />
    </div>
  )
}

export default About