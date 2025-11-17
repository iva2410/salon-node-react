import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import './Saloni.css'
import { CityContext } from '../../context/CityContext'
const Saloni = () => {
  const {selectedCity} = useContext(CityContext)
  const { tip } = useParams()
  const { saloni , loadSaloni ,calculateAverageRating} = useContext(AppContext)
  const [salonFilter, setSalonFilter] = useState([])
  const [showFilter,setShowFilter]=useState(false)
  
  const applyFilter = () => {
    let filteredSalons = saloni;
  
    if (tip) {
      filteredSalons = filteredSalons.filter(salon => {
        const matchesTip = salon.tip === tip;
        const hasMatchingUsluga = salon.usluge.some(usluga => {
          
          return usluga.usluga === tip || usluga.podtip.includes(tip);
        });
  
        return matchesTip || hasMatchingUsluga;
      });
    }
  
    if (selectedCity) {
      filteredSalons = filteredSalons.filter(salon => salon.grad === selectedCity);
    }
  
    setSalonFilter(filteredSalons);
  }

 
  
  useEffect(()=>{
    loadSaloni()
},[])
  useEffect(() => {
    applyFilter()
   
  }, [saloni, tip, selectedCity])
  const navigate = useNavigate()
  return (
    <div className='saloni-div'>
      <p className='zakazivanja'>Saloni u Vašem gradu</p>
      <div className='filteri'>

      
      <button className={`btn-filter ${showFilter ? 'active' : ''}`} onClick={()=>setShowFilter(prev=>!prev)}>Filteri</button>
        <div className={`div-filter ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <ul>
          <li onClick={()=>tip==='Frizerski salon' ? navigate(`/saloni/${selectedCity}`) : navigate(`/saloni/Frizerski salon/${selectedCity}`)}>Frizerski saloni</li>
          <li onClick={()=>tip==='Kozetički salon' ? navigate(`/saloni/${selectedCity}`) : navigate(`/saloni/Kozmetički salon/${selectedCity}`)}>Kozmetički saloni</li>
          <li onClick={()=>tip==='Masaža' ? navigate(`/saloni/${selectedCity}`) : navigate(`/saloni/Masaže/${selectedCity}`)}>Masaža</li>
          <li onClick={()=>tip==='Manikir i pedikir' ? navigate(`/saloni/${selectedCity}`) : navigate(`/saloni/Manikir/${selectedCity}`)}>Nokti</li>
          <li onClick={()=>tip==='Depilacija' ? navigate(`/saloni/${selectedCity}`) : navigate(`/saloni/Depilacija/${selectedCity}`)}>Depilacija</li>
          <li onClick={()=>tip==='Muški frizeri' ? navigate(`/saloni/${selectedCity}`) : navigate(`/saloni/Muško šišanje/${selectedCity}`)}>Muški frizeri</li>
          <li onClick={()=>tip==='Lice' ? navigate(`/saloni/${selectedCity}`) : navigate(`/saloni/Tretmani lica/${selectedCity}`)}>Lice</li>
          <li onClick={()=>tip==='Šminkanje' ? navigate(`/saloni/${selectedCity}`) : navigate(`/saloni/Šminkanje/${selectedCity}`)}>Šminkanje</li>
          </ul>
        </div>
        
          <div className='saloni-lista'>
            {
              salonFilter.map((item, index) => (
                <div onClick={()=>navigate(`/${selectedCity}/${item.name}`)} className='saloni'  key={index}>
                  <img src={item.image[0]} alt="" />
                  <div className='info'>
                    <p className='ime'>{item.name} </p>
                    <p className='ocena'> {calculateAverageRating(item.ratings)} </p>
                  </div>
                
                </div>

              ))}
          </div>
        
      </div>
    </div>
  )
}

export default Saloni