import React, { useContext, useEffect, useState } from 'react'
import './Zakazivanja.css'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Recenzije from '../Recenzije/Recenzije'

const Zakazivanja = () => {

  const { backendUrl, token, loadSaloni } = useContext(AppContext)

  const [termini, setTermini] = useState([])
  const months = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"]

  const [naredna, setNaredna] = useState(true)
  const [prosla, setProsla] = useState(false)
  const [otkazana, setOtkazana] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false); 
  const [selectedTermin, setSelectedTermin] = useState(null); 
  const handleReviewSubmit = (usluga, terminId) => {
    const updatedTermini = termini.map((termin) =>
      termin._id === terminId
        ? { ...termin, hasReview: true }
        : termin
    );
    setTermini(updatedTermini); 
  };




  console.log(termini);



  const zamena1 = () => {
    setNaredna(false)
    setProsla(true)
    setOtkazana(false)
  }

  const zamena = () => {
    setNaredna(true)
    setProsla(false)
    setOtkazana(false)
  }

  const zamena2 = () => {
    setNaredna(false)
    setProsla(false)
    setOtkazana(true)
  }
  const slotDateDay = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0]
    //return dateArray[0]+ " " + months[Number(dateArray[1])]+ " "+ dateArray[2]
  }
  const slotDateMonth = (slotDate) => {
    const dateArray = slotDate.split('_')
    return months[Number(dateArray[1] - 1)]
    //return dateArray[0]+ " " + months[Number(dateArray[1])]+ " "+ dateArray[2]
  }


  const getTermini = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/lista-termina', { headers: { token } })
      if (data.success) {
        setTermini(data.termini.reverse())
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }



  const otkazi = async (terminId) => {
    try {

      const { data } = await axios.post(backendUrl + '/api/user/otkazi-tretman', { terminId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        loadSaloni()
        getTermini()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const openReviewModal = (termin) => {
    setSelectedTermin(termin);
    setShowReviewModal(true); 
  };

  const closeReviewModal = () => {
    setShowReviewModal(false); 
    setSelectedTermin(null); 
  };
  useEffect(() => {
    if (token) {
      getTermini()
    }
  }, [token])

  console.log(selectedTermin);

  return (
    <div className='zakazivanja-div'>
      <p className='zakazivanja'>Zakazivanja</p>
      <ul className='row-zakazivanja'>
        <li className={`naredna ${naredna ? 'active' : ''}`} onClick={zamena}>NAREDNA</li>
        <li className={`prosla ${prosla ? 'active' : ''}`} onClick={zamena1}>PROŠLA </li>
        <li className={`otkazana ${otkazana ? 'active' : ''}`} onClick={zamena2}>OTKAZANA </li>

      </ul>
      {
        naredna && (
          <div className='div-termini'>
            {termini.map((item, index) =>
            (
              !item.cancel && !item.isCompleted && (
                <div className='row' key={index}>
                  <div className='row-left'>
                    <div className='row-date'>
                      <p >{slotDateMonth(item.slotDate)}</p>
                      <p className='day'> {slotDateDay(item.slotDate)} </p>
                    </div>
                    <div className='row-time'>
                      <p><span className="mdi mdi-clock"></span> {item.slotTime}</p>
                      {Array.isArray(item.cena) && (
                        <p className="ukupna-cena">
                          Ukupno: {item.cena.reduce((total, currentPrice) => total + currentPrice, 0)} RSD
                        </p>
                      )}
                    </div>
                    <div className='row-info'>
                      <div className='row-info-naziv' >
                        {Array.isArray(item.usluga) ? (
                          item.usluga.map((usl, idx) => (
                            <p key={idx}>{usl}</p>
                          ))
                        ) : (
                          <p>{item.usluga} </p>)}
                      </div>

                      <p className='row-info-naziv'>Salon: {item.naziv} <br/>
                       <p>Radnik: {item.radnikData.ime} {item.radnikData.prezime}</p>
                      </p> 
                    </div >
                  </div>
                  <div className='row-right'>
                    {item.isConfirmed ? (
                      <p className='confirm'>Potvrđeno</p>
                    ) :
                      <button onClick={() => otkazi(item._id)} className='otkazi-btn'>Otkaži</button>
                    }
                  </div>

                </div>)
            ))}
          </div>
        )
      }


      {
        prosla && (
          <div className='div-termini'>
            {termini.slice(0, 15).map((item, index) =>
            (
              !item.cancel && item.isCompleted && (
                <div className='row' key={index}>
                  <div className='row-jedan'>
                    <div className='row-date'>
                      <p >{slotDateMonth(item.slotDate)}</p>
                      <p className='day'> {slotDateDay(item.slotDate)} </p>
                    </div>
                    <div className='row-time'>
                      <p><span className="mdi mdi-clock"></span> {item.slotTime}</p>
                      {Array.isArray(item.cena) && (
                        <p className="ukupna-cena">
                          Ukupno: {item.cena.reduce((total, currentPrice) => total + currentPrice, 0)} RSD
                        </p>
                      )}
                    </div>
                  </div>
                  <div className='row-info-jedan'>
                    <p className='row-info-naziv-jedan'>
                      {Array.isArray(item.usluga) && (
                        <><div className='usluga-container'>
                          {item.usluga.map((usl, idx) => (
                            <p key={idx}>{usl}</p>
                          ))}
                         
                        </div>
                         <button
                         onClick={() => openReviewModal(item)}
                         className='review'
                       >
                         {item.hasReview ? 'Izmeni recenziju' : 'Dodaj recenziju'}
                       </button></>
                      )}

                    </p>
                    <p className='row-info-naziv'>Salon: {item.naziv} <br/>
                       <p>Radnik: {item.radnikData.ime} {item.radnikData.prezime}</p>
                      </p> 

                  </div>



                </div>)
            ))}
          </div>
        )
      }
      {showReviewModal && selectedTermin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-btn" onClick={closeReviewModal}>X</button>
            <Recenzije selectedTermin={selectedTermin} closeModal={closeReviewModal} onReviewSubmit={(usluga) => handleReviewSubmit(usluga, selectedTermin._id)} />          </div>
        </div>
      )}
      {
        otkazana && (
          <div className='div-termini'>
            {termini.slice(0, 15).map((item, index) =>
            (
              item.cancel && (
                <div className='row-dva' key={index}>
                  <div className='row-left'>
                    <div className='row-date'>
                      <p >{slotDateMonth(item.slotDate)}</p>
                      <p className='day'> {slotDateDay(item.slotDate)} </p>
                    </div>
                    <div className='row-time'>
                      <p><span className="mdi mdi-clock"></span> {item.slotTime}</p>
                      {Array.isArray(item.cena) && (
                        <p className="ukupna-cena">
                          Ukupno: {item.cena.reduce((total, currentPrice) => total + currentPrice, 0)} RSD
                        </p>
                      )}
                    </div>
                  </div>
                  <div className='row-info'>
                    <p className='row-info-naziv'>
                      {Array.isArray(item.usluga) ? (
                        item.usluga.map((usl, idx) => (
                          <div key={idx} className="usluga-container">
                            <p>{usl}</p>
                          </div>
                        ))
                      ) : (
                        <div className="usluga-container">
                          <p>{item.usluga}</p></div>)}
                    </p>
                    <p className='row-info-naziv'>Salon: {item.naziv} <br/>
                       <p>Radnik: {item.radnikData.ime} {item.radnikData.prezime}</p>
                      </p> 
                  </div>


                </div>)
            ))}
          </div>
        )
      }
    </div>
  )
}

export default Zakazivanja