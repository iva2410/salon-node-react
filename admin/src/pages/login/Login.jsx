import React, { useContext, useState } from 'react'
import './Login.css'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { RadnikContext } from '../../context/RadnikContext'
import { useNavigate } from 'react-router-dom'
const Login = () => {

  const [state,setState]=useState('Admin')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const {setRToken} =useContext(RadnikContext)
  const {setAToken,backendUrl} =useContext(AdminContext) 
  const navigate=useNavigate()
  const submit =async (event)=>{
    event.preventDefault()

    try {
      
      if(state==='Admin'){
        const {data}=await axios.post(backendUrl+ '/api/admin/login',{email,password})
        if(data.success){
          localStorage.setItem('aToken',data.token)
          navigate('/admin-saloni')
          setAToken(data.token);
        }else{
          toast.error(data.message)
        }
      }else {
        const {data}=await axios.post(backendUrl+'/api/radnici/login',{email,password})
        if(data.success){
            localStorage.setItem('rToken',data.token)
            navigate('/radnik-dashboard')
            setRToken(data.token)
            
        } else{
            toast.error(data.message)
        }
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={submit} className='form-container'>
      <div className='form-box'>
            <p className='form-header'><span className='span-state'>{state}</span> Login </p>
            <div className='login'>
                <p>Email</p>
                <input onChange={(e)=>setEmail(e.target.value)} value={email}  type="email" required />
            </div>
            <div className='login'>
                <p>Password</p>
                <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" required />
            </div>
            <button>Prijavi se</button>
            {
                state === 'Admin' 
                ? <p className="switch-link" onClick={()=>setState('Radnik')}>Radnik Login? </p>
                : <p className="switch-link" onClick={()=>setState('Admin')}>Admin Login?</p>
            }
        </div>
    </form>
  )
}

export default Login