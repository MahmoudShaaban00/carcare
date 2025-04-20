import { createContext, useEffect, useState } from "react";
export let UserContext =createContext(null);

 export default function UserContextProvider(props){
 
    const [UserLogin , setUserLogin]=useState(null)
    const [UserId , setUserId] = useState(null)
    
    useEffect(()=>{
        if(localStorage.getItem('UserToken') !== null)
                {
                        setUserLogin(localStorage.getItem('UserToken'))
                        setUserId(localStorage.getItem("UserId"))
                }
    },[])

    return <UserContext.Provider value={{UserLogin , setUserLogin , UserId , setUserId }}>
            {props.children}
    </UserContext.Provider>

}