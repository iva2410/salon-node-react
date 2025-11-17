import axios from "axios";
import { useEffect } from "react";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const RadnikContext = createContext()

const RadnikContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [rToken, setRToken] = useState(localStorage.getItem('rToken') ? localStorage.getItem('rToken') : '')
    const [termini, setTermini] = useState([])
    const [dashData, setDashData] = useState(false)
    

    const getTermini = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/radnici/termini', { headers: { rToken } })
            if (data.success) {
                setTermini(data.termini)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const otkazi = async (terminId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/radnici/otkazi-termin', { terminId }, { headers: { rToken } })
            if (data.success) {
                toast.success(data.message)
                getTermini()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const potvrdi = async (terminId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/radnici/potvrdi-termin', { terminId }, { headers: { rToken } })
            if (data.success) {
                toast.success(data.message)
                getTermini()
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

    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/radnici/radnik-dashboard', { headers: { rToken } })
            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
  
   
      
    const value = {
        backendUrl, rToken,
        setRToken,
        termini, setTermini,
        getTermini,
        otkazi, potvrdi,
        dashData, setDashData,
        getDashData,
        
        calculateAverageRating
    }
    return (
        <RadnikContext.Provider value={value}>
            {props.children}
        </RadnikContext.Provider>
    )
}

export default RadnikContextProvider