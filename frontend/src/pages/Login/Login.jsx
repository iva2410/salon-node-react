import React, { useContext, useEffect, useState } from 'react'
import './Login.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
const Login = () => {

    const { backendUrl, token, setToken } = useContext(AppContext)
    const navigate = useNavigate()
    const [state, setState] = useState('Prijavi se')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setName] = useState('')
    const [lastName, setLastName] = useState('')

    const submit = async (e) => {
        e.preventDefault()
        try {
            if (state === 'Registruj se') {
                const { data } = await axios.post(backendUrl + '/api/user/register', { firstName, lastName, password, email })
                if (data.success) {
                    localStorage.setItem('token', data.token)
                    setToken(data.token)
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/user/login', { password, email })
                if (data.success) {
                    localStorage.setItem('token', data.token)
                    setToken(data.token)
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    useEffect(() => {
        if (token) {
            navigate('/')
        }
    }, [token])
    return (
        <form onSubmit={submit} className='form-container'>
            <div className='form-box'>
                <p className='form-header'>
                    {
                        state === 'Registruj se' ? "Kreirajte nalog" : "Prijavite se"
                    }
                </p>
                {
                    state === 'Registruj se' &&
                    <>
                    <div className='register'>
                        <p>Ime</p>
                        <input type="text" onChange={(e) => setName(e.target.value)} value={firstName} required />
                        </div>
                        <div className="register">
                        <p>Prezime</p>
                        <input type="text" onChange={(e) => setLastName(e.target.value)} value={lastName} required />
                    </div></>
                }
                <div className='register'>
                    <p>Email</p>
                    <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                </div>
                <div className='register'>
                    <p>Lozinka</p>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                </div>
                <button type="submit" className="submit-btn">{state === 'Registruj se' ? 'Kreirajte nalog' : "Prijavite se"}</button>
                {
                    state === 'Registruj se'
                        ? <p>Vec imate nalog? <span onClick={() => setState('Prijavi se')} className="switch-link">Prijavite se</span></p>
                        : <p>Nemate nalog? <span onClick={() => setState('Registruj se')} className="switch-link">Regitrujte se</span></p>
                }
            </div>

        </form>
    )
}

export default Login