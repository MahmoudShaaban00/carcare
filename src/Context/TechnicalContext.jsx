import { createContext, useEffect, useState } from "react";


export let TechnicalContext = createContext(null)

export default function TechnicalContextProvider(props) {
    
    const [TechnicalLogin, setTechnicalLogin] = useState(null)


    useEffect(() => {
        if (localStorage.getItem('TechnicalToken') !== null) {
            setTechnicalLogin(localStorage.getItem('TechnicalToken'))
        }
    }, [])

    return <TechnicalContext.Provider value={{ TechnicalLogin, setTechnicalLogin  }}>
        {props.children}
    </TechnicalContext.Provider>
}