import React from 'react'
import { useContext } from 'react'
import { RadnikContext } from '../../../context/RadnikContext'
import { useEffect } from 'react'
import { assets } from '../../../assets/assets'
import './Dashboard.css'
const Dashboard = () => {
  const { dashData,getDashData, rToken, calculateAverageRating } = useContext(RadnikContext)
 
  const slotDate = (slotDate) => {
    
    const dateArray = slotDate.split('_')
    return dateArray[0]+ "." + dateArray[1] + "."+ dateArray[2]+"."
  }
 
 
  useEffect(() => {
    if (rToken) {
      getDashData()
    }
  }, [rToken])
  return dashData && (
    <div className='dashboard-container'>
      <div className='dashboard-kartice'>
        <div className='dashboard-kartica'>
          <img src={assets.wallet} alt="" />
          <p>Zarada (trenutni mesec)</p>
          <p className="value">{dashData.earnings} RSD</p>
          <p className={`comparison ${dashData.earnings >= dashData.prosliMesecEarnings ? "positive" : "negative"}`}>
            {dashData.earnings - dashData.prosliMesecEarnings >= 0
              ? `+${dashData.earnings - dashData.prosliMesecEarnings} `
              : `${dashData.earnings - dashData.prosliMesecEarnings} `}
            RSD
          </p>
        </div>
        <div className='dashboard-kartica'>
          <img src={assets.calendarRadnik} alt="" />
          <p>Termini</p>
          <p className='value'>{dashData.termini}</p>
        </div>
        <div className='dashboard-kartica'>
          <img src={assets.people} alt="" />
          <p>Klijenti</p>
          <p className='value'>{dashData.klijenti}</p>
        </div>
        <div className='dashboard-kartica'>
          <img src={assets.comments} alt="" />
          <p>Recenzije</p>
          <p className='value'>{dashData.komentari}</p>
        </div>
        <div className='dashboard-kartica'>
          <img src={assets.rating} alt="" />
          <p>Ocena korisnika</p>
          <p className='value'> {calculateAverageRating(dashData.ocena)}</p>
        </div>
      </div>


      

      <div className='dashboard-recent'>
        <h3>Termini na čekanju</h3>
          <ul>
            {dashData.poslednjiTermini.map((termin,index)=>(
              !termin.isCompleted && !termin.cancel && !termin.isConfirmed &&(
              <li key={termin._id}>
              <p>Datum: {slotDate(termin.slotDate)}</p>
              <p>Cena: {termin.cena.reduce((sum, value) => sum + value, 0)} RSD</p>
             
            </li>
              )
            ))}
          </ul>
      </div>
    </div>
  )
}

export default Dashboard