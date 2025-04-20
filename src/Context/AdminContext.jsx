import { useEffect } from "react";
import { createContext, useState } from "react";

export let AdminContext = createContext(null)

export default function  AdminContextProvider(props){

    const[AdminLogin, setAdminLogin] = useState(null)
    
    useEffect(()=>{
        if(localStorage.getItem('AdminToken') !== null)
        {
            setAdminLogin(localStorage.getItem('AdminToken'))
        }
    },[])

    return <AdminContext.Provider value={{AdminLogin , setAdminLogin}}>
        {props.children}
    </AdminContext.Provider>
}