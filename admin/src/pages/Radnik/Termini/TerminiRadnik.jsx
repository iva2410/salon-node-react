import React, { useContext, useEffect } from 'react'
import { RadnikContext } from '../../../context/RadnikContext'
import { useState, useRef } from 'react'
import { getDaysInMonth } from "date-fns";
import { toast } from 'react-toastify';
import './TerminiRadnik.css'
import axios from 'axios';
import { assets } from '../../../assets/assets';

const TerminiRadnik = () => {
  const { rToken, termini, getTermini, backendUrl, otkazi, potvrdi } = useContext(RadnikContext)


  const months = [
    "Januar", "Februar", "Mart", "April", "Maj",
    "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
  ];
  const [selectedDay, setSelectedDate] = useState(new Date().getDate());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());  
  const daysInMonth = getDaysInMonth(new Date(2024, currentMonthIndex));
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);


  const monthsContainerRef = useRef(null);


  const displayFilteredTermini = (termini, selectedDay, currentMonthIndex) => {
    return termini.filter(termin => {
      const [day, month, year] = termin.slotDate.split("_");
      return (
        parseInt(day) === selectedDay &&
        parseInt(month) - 1 === currentMonthIndex
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
    if (rToken) {
      getTermini()
    }
  }, [rToken])

  useEffect(() => {
    if (monthsContainerRef.current) {
      const container = monthsContainerRef.current;
      const monthWidth = container.scrollWidth / months.length;
      const centerPosition = monthWidth * currentMonthIndex - container.offsetWidth / 2 + monthWidth / 2;
      container.scrollTo({ left: centerPosition, behavior: "smooth" });
    }
  }, [currentMonthIndex]);

  return (
    <div className='termini-container'>
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
        {displayFilteredTermini(termini, selectedDay, currentMonthIndex).length > 0 ? (
          <ul>
            {displayFilteredTermini(termini, selectedDay, currentMonthIndex).map((termin) => (
              <li key={termin._id}>
                {termin.slotTime}
                <div className='filter-termin'>
                  <div>
                  <p>{termin.usluga.map((usluga, index) => (
                    <span key={index}>{usluga} - {termin.cena[index]} RSD{index < termin.usluga.length - 1 ? ', ' : ''}</span>
                  ))}
                  </p>
                  <p>Ukupna cena: {termin.cena.reduce((sum, value) => sum + value, 0)} RSD</p>
                 </div>
                  {
                    termin.isCompleted ?
                      <p className='confirm zavrseno'>Završeno</p>
                      : termin.cancel ?
                        <p className='confirm otkazano'>Otkazan termin</p>
                        : termin.isConfirmed ? <p className='confirm potvrdjeno'>Potvrđeno</p>
                          : <div className='div-potvrda'>

                            <img className='btn-potvrda' onClick={() => potvrdi(termin._id)} src={assets.confirm} alt="" />

                            <img className='btn-potvrda' onClick={() => otkazi(termin._id)} src={assets.false_icon} alt="" />
                          </div>
                  }


                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p> </p>
        )}
      </div>


    </div>
  )

}

export default TerminiRadnik