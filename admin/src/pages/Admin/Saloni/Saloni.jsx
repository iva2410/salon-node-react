import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../../context/AdminContext'
import { NavLink } from 'react-router-dom'
import './Saloni.css'
import { toast } from 'react-toastify'
import axios from 'axios'
const Saloni = () => {
  const { aToken, saloni, getAllSalons, calculateAverageRating, backendUrl } = useContext(AdminContext)
  const [selectedSalon, setSelectedSalon] = useState(null)
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false)

  const fetchStats = async (salonId) => {
    try {
      setLoading(true)
      const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { params: { salonId }, headers: { aToken } })
      console.log("Odgovor sa servera:", data);
      setStats(data.stats);
      setLoading(false);
    } catch (error) {
      toast.error('Greška prilikom preuzimanja statistike.');
      setLoading(false);
    }
  }
  const openPopUp = (salon) => {
    setSelectedSalon(salon)
    fetchStats(salon._id)
  }
  console.log(stats);


  const closePopUp = () => {
    setSelectedSalon(null)
  }

  const removeSalon = async (salonId) => {
    try {
      const confirmDelete = window.confirm('Da li ste sigurni da želite da obrišete ovaj salon?');
      if (!confirmDelete) return;
      const { data } = await axios.delete(backendUrl + `/api/admin/obrisi-salon/${salonId}`, { headers: { aToken } })
      if (data.success) {
        toast.success('Salon uspešno obrisan!');
        getAllSalons()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message);

    }
  }
  const removeRadnik = async (radnikId) => {
    try {
      const confirmDelete = window.confirm('Da li ste sigurni da želite da obrišete radnika?');
      if (!confirmDelete) return;
      const { data } = await axios.delete(backendUrl + `/api/admin/obrisi-radnika/${radnikId}`, { headers: { aToken } })
      if (data.success) {
        toast.success('Radnik uspešno obrisan!');
        getAllSalons()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message);

    }
  }
  useEffect(() => {
    if (aToken) {
      getAllSalons()
    }
  }, [aToken])

  return (
    <div className='saloni-lista'>
      <p className='p-add'>Lista salona</p>
      <table className='saloni-table'>
        <thead>
          <tr>
            <th>#</th>
            <th>Naziv</th>
            <th>Lokacija</th>
            <th>Tip salona</th>
            <th>Prosečna ocena</th>
            <th>Broj zaposlenih</th>
            <th>Broj usluga</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {saloni.map((salon, index) => (
            <tr key={salon._id}>
              <td>{index + 1}</td>
              <td data-label="Naziv">{salon.name}</td>
              <td data-label="Grad">{salon.grad}</td>
              <td data-label="Tip">{salon.tip}</td>
              <td data-label="Procečna ocena">{calculateAverageRating(salon.ratings)}
              </td>
              <td data-label="Broj zaposlenih">{salon.zaposleni?.length || 0}</td>
              <td data-label="Broj usluga">{salon.usluge?.length || 0}</td>
              <td>
                <button onClick={() => openPopUp(salon)} className="action-btn view-btn">Pogledaj</button>
                <button onClick={() => removeSalon(salon._id)} className='action-btn delete-btn'>Obriši</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {
        selectedSalon && (
          <div className="popup">
            <div className="popup-content">
              <button onClick={() => closePopUp()} className='close-button'>X</button>
              <h2>Detalji za salon: {selectedSalon.name}</h2>
              {loading ? (
                <p>Učitavanje statistike...</p>
              ) : stats ? (
                <div>
                  <p>Broj zakazanih termina: {stats.termini}</p>
                  <p>Najpopularnija usluga: {stats.najpopularnijaUsluga}</p>
                  <p>Broj recenzija: {stats.brojRecenzija}</p>
                  <p>Zarada ovog meseca: {stats.earnings} RSD</p>
                  <h3>Zaposleni:</h3>
                  {stats.zaposleni.length > 0 ? (
                    <ul>
                      {stats.zaposleni.map((radnik) => (
                        <li key={radnik._id}>
                          {radnik.ime} {radnik.prezime} - {radnik.email}
                        <button onClick={()=>removeRadnik(radnik._id)} className='action-btn delete-btn'>Obriši</button> 
                        </li>
                       
                      ))}
                    </ul>
                  ) : (
                    <p>Trenutno nema zaposlenih u ovom salonu.</p>
                  )}
                </div>

              ) : (
                <p>Greška pri učitavanju statistike.</p>
              )}

            </div>
          </div>
        )
      }
    </div>
  )
}

export default Saloni