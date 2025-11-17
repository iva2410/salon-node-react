import { createContext, useEffect, useState } from "react"
import { gradovi,tipovi,usluge } from "../assets/assets"
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext=createContext()

const AppContextProvider = (props) =>{

    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const [token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'): false)
    const [userData,setUserData]=useState(false)
    const [saloni,setSaloni]=useState([])
   
const loadUserProfileData= async () =>{
        try {

            const {data}=await axios.get(backendUrl+'/api/user/profile',{headers:{token}})
            if (data.success) {
                setUserData(data.userData)
                
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
const loadSaloni=async()=>{
    try {
        const {data}=await axios.get(backendUrl+'/api/saloni/saloni')
        if(data.success){
            setSaloni(data.saloni)
        }else{
            toast.error(data.message)
        }
    } catch (error) {
        console.log(error)
            toast.error(error.message)
    }
}

const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((sum, { rating }) => sum + rating, 0);
    return (total / ratings.length).toFixed(1);  
}
    const contextValue={
        gradovi,
        usluge,
        tipovi,
        token,setToken,
        backendUrl,
        userData,setUserData,
        loadUserProfileData,
        saloni,setSaloni,
        loadSaloni,calculateAverageRating
    }
    
    useEffect(()=>{
        loadSaloni()
    },[])
    useEffect(()=>{
        if(token){
            loadUserProfileData()
        }else{
            setUserData(false)
        }
    },[token])
   
    
    return(
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;