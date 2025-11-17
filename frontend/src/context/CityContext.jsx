import { createContext, useState } from "react"
import { gradovi, saloni } from "../assets/assets";

export const CityContext=createContext()

const CityContextProvider = ({children}) =>{

    const [selectedCity, setSelectedCity] = useState('Niš'); 

    const contextValue={
        saloni,
        gradovi
    }
  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity}}>
      {children}
    </CityContext.Provider>
    )
}

export default CityContextProvider;