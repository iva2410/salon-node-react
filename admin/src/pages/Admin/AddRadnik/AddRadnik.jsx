import React, { useContext, useEffect, useState } from 'react'
import './AddRadnik.css'
import { AdminContext } from '../../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';
const AddRadnik = () => {

  const [selectSalon,setSelectedSalon]=useState('Izaberi salon')

  const {saloni,aToken,getAllSalons,backendUrl}=useContext(AdminContext)
console.log(saloni);

  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const handleSalonChange=(e)=>{
    setSelectedSalon(e.target.value)
   
  }
  console.log(selectSalon);   
  

  const submitRadnik=async(event)=>{
    event.preventDefault()
    try {
      const formData=new FormData()
      formData.append('ime', ime)
      formData.append('prezime', prezime)
      formData.append('password', password)
      formData.append('email', email)
      formData.append('salonId',selectSalon)
      const { data } = await axios.post(backendUrl + '/api/admin/add-radnik', formData, { headers: { aToken } })

      if (data.success) {
        toast.success(data.message)
        setIme('')
        setPrezime('')
        setPassword('')
        setEmail('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.message)
    }
  }
  useEffect(()=>{
    if(aToken){
      getAllSalons()
    }
  },[aToken])

  return (
    <form onSubmit={submitRadnik} className='radnik-container'  >
      <p className='p-add'>Dodaj radnika</p>
        <div className='container-div-radnik'>


          <div className='radnik'>
         
            <div >
              <label>Ime:
                <input onChange={(e) => setIme(e.target.value)}
                  type="text"
                  value={ime}

                  placeholder="Unesite ime"
                  className="dan-input" required
                /></label>
            </div>
            <div>
              <label>Prezime:
                <input onChange={(e) => setPrezime(e.target.value)}
                  type="text"
                  value={prezime}

                  placeholder="Unesite prezime"
                  className="dan-input" required
                /></label>
            </div>
            <div>
              <label>Email:
                <input onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  value={email}

                  placeholder="Unesite email"
                  className="dan-input" required
                /></label>
            </div>
            <div>
              <label>Šifra:
                <input onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  value={password}

                  placeholder="Unesite šifru"
                  className="dan-input" required
                /></label>
            </div>
            
          </div>
          
        

        <div className='radnik' >
              <p>Odaberi salon</p>
              <select className="styled-select"  onChange={handleSalonChange} value={selectSalon} >
                
              {saloni.map((salon) => (
                  <option key={salon._id} value={salon._id}>{salon.name}</option>
                ))}
              </select>
              <button className='btn-add' type="submit">
              Dodaj radnika
            </button>
          </div>
         
          </div>
          
      </form>
  )
}

export default AddRadnik