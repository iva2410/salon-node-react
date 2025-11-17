import React from 'react'
import './Termini.css'
import { useContext } from 'react'
import { AdminContext } from '../../../context/AdminContext'
import { useEffect } from 'react'
import { useState, useRef } from 'react'
import { getDaysInMonth } from "date-fns";
import { assets } from '../../../assets/assets'
const Termini = () => {

  const { termini, listaTermina, aToken, saloni, getAllSalons } = useContext(AdminContext)
  const months = [
    "Januar", "Februar", "Mart", "April", "Maj",
    "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
  ];
  const [selectedDay, setSelectedDate] = useState(new Date().getDate());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth()); 
  const daysInMonth = getDaysInMonth(new Date(2024, currentMonthIndex));
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const [salon, setSalon] = useState('')

  const monthsContainerRef = useRef(null);
  
  const handleChangeSalon = (e) => {
    setSalon(e.target.value)

  }
console.log(salon);

  const displayFilteredTermini = (termini, selectedDay, currentMonthIndex,salon) => {
    return termini.filter(termin => {
      const [day, month, year] = termin.slotDate.split("_");
      return (
        parseInt(day) === selectedDay &&
        parseInt(month) - 1 === currentMonthIndex &&
        termin.naziv===salon
      );
    }).sort((a, b) => a.slotTime.localeCompare(b.slotTime)); 
  }



  const handleDayClick = (day) => {
    setSelectedDate(day);
  }

  const handleMonthClick = (index) => {
    setCurrentMonthIndex(index);

  }


  useEffect(() => {
    if (aToken) {
      listaTermina()
    }
  },[aToken])

  useEffect(() => {
    if (aToken) {
      getAllSalons()
    }
  }, [aToken])
  useEffect(() => {
    if (monthsContainerRef.current) {
      const container = monthsContainerRef.current;
      const monthWidth = container.scrollWidth / months.length;
      const centerPosition = monthWidth * currentMonthIndex - container.offsetWidth / 2 + monthWidth / 2;
      container.scrollTo({ left: centerPosition, behavior: "smooth" });
    }
  }, [currentMonthIndex]);
  useEffect(() => {
    if (saloni.length > 0) {
      setSalon(saloni[0].name); 
    }
  }, [saloni]); 
  return (
    <div className='termini-container'>

      <div className='div-termin' >
        <p className='p-add'>Termini</p>
        <select className="styled-select" onChange={handleChangeSalon} value={salon} >

          {saloni.map((salon) => (
            <option key={salon._id} value={salon.name}>{salon.name}</option>
          ))}
        </select>

      </div>
      <div className="calendar">
        <div className="months-container" ref={monthsContainerRef}>
          <div className="months">
            {months.map((month, index) => (
              <span
                key={month}
                className={`month ${index === currentMonthIndex ? "active" : ""}`}
                onClick={() => handleMonthClick(index)}
              >
                {month}
              </span>
            ))}
          </div>
        </div>
        <div className="days">
          {daysArray.map((day, index) => (
            <div
              key={index}
              className={`day ${selectedDay === day ? "selected" : ""}`} 
              onClick={() => handleDayClick(day)} 
            >
              <span>{day}</span>
            </div>
          ))}
        </div>


      </div>
      <div className="filtered-termini">
        {displayFilteredTermini(termini, selectedDay, currentMonthIndex,salon).length > 0 ? (
          <ul>
            {displayFilteredTermini(termini, selectedDay, currentMonthIndex,salon).map((termin) => (
              <li key={termin._id}>
                {termin.slotTime}
                <div className='filter-termin'>
                  <div>

                  
                <p>{termin.usluga?.map((usluga, index) => (
                    <span key={index}>{usluga} - {termin.cena[index]} RSD{index < termin.usluga.length - 1 ? ', ' : ''}</span>
                  ))}
                  </p>
                  <p>Ukupna cena: {termin.cena.reduce((sum, value) => sum + value, 0)} RSD</p>
                
                  <p> (Radnik: {termin.radnikData?.ime} {termin.radnikData.prezime}) </p>
                </div> 
                 {
                    termin.cancel ?
                    <p className='confirm otkazano'>Otkazan termin</p>
                    :
                    termin.isCompleted ?
                      <p className='confirm zavrseno'>Završeno</p>
                      :  termin.isConfirmed ? <p className='confirm potvrdjeno'>Potvrđeno</p>
                          : <p className='confirm cekanje'>Na čekanju</p>
                  }
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p></p>
        )}
      </div>


    </div>
  )
}

export default Termini