import axios from "axios";
import { useEffect } from "react";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const [aToken,setAToken]=useState(localStorage.getItem('aToken')?localStorage.getItem('aToken') : '')
    const [saloni,setSaloni]=useState([])
    const [termini,setTermini]=useState([])
    const [dashData,setDashData]=useState(null)
    const backendUrl=import.meta.env.VITE_BACKEND_URL

    const getAllSalons=async()=>{
        try {
            const {data}=await axios.get(backendUrl+'/api/admin/all-salons',{headers:{aToken}})
            if (data.success) {
                setSaloni(data.salons)
              
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const listaTermina=async()=>{
        try {
            const {data}=await axios.get(backendUrl+'/api/admin/lista-termina',{headers:{aToken}})
            if (data.success) {
                setTermini(data.termini)
                
                
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })
            if (data.success) {
                setDashData(data.data)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const calculateAverageRating = (ratings) => {
        if (!ratings || ratings.length === 0) return 0;
        const total = ratings.reduce((sum, { rating }) => sum + rating, 0);
        return (total / ratings.length).toFixed(1);  
      }
    
  console.log(saloni);
    const value = {
        aToken,setAToken,
        backendUrl,saloni,
        getAllSalons,
        calculateAverageRating,
        termini,setTermini,
        listaTermina,
        dashData, setDashData,
        getDashData,
    }
   
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider