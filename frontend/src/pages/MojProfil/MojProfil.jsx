import React, { useContext, useState } from 'react'
import './MojProfil.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'

const MojProfil = () => {
  const { token, backendUrl, loadUserProfileData, userData, setUserData } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const navigate = useNavigate()
  const updateUser = async () => {
    try {
      const formData = new FormData()
      formData.append('firstName', userData.firstName)
      formData.append('lastName', userData.lastName)
      formData.append('phone', userData.phone)
      console.log(userData);
      
      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })


      if (data.success) {
        console.log(data);
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  return userData && (
    <div className='profil'>
      {
        isEdit ?
          <div className='izmena'>
            <input type="text" value={userData.firstName} onChange={e => setUserData(prev => ({ ...prev, firstName: e.target.value }))} />
            <input type="text" value={userData.lastName} onChange={e => setUserData(prev => ({ ...prev, lastName: e.target.value }))} />
            <input type="text" value={userData.phone} onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} />

          </div>

          : <h1>{userData.firstName} {userData.lastName}  <small>{userData.email}</small> <small>{userData.phone}</small></h1>
      }

      {isEdit ?
        <button onClick={updateUser}>Sačuvaj informacije</button>
        : <button onClick={() => setIsEdit(true)}>Izmeni</button>
      }
      <div className='kartice'>
        <div onClick={()=>navigate('/omiljeni-saloni')} className='svidjanja'>
          <h4>Sviđanja <span className="mdi mdi-heart-outline"></span></h4>
          <p>Saloni koji Vam se sviđaju</p>
        </div>
        <div onClick={()=>navigate('/komentari')} className='svidjanja'>
          <h4>Moji utisci <span className="mdi mdi-message-outline"></span></h4>
          <p>Utisci i ocene o salonima</p>
        </div>
        <div onClick={()=>navigate('/pitanja')} className='svidjanja'>
          <h4>Pomoć <span className="mdi mdi-help"></span></h4>
          <p>Najčešća pitanja i odgovori</p>
        </div>

      </div>
    </div>
  )
}

export default MojProfil