import { createContext } from "react";
import {Person} from "../assets/assets";

export const AppContext = createContext();

const AppContextProvider = (props) =>{

    const value = {
        Person
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;