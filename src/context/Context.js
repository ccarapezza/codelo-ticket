import { createContext } from "react";
const initial = {   
    userData: { },
    isLogged: false,
    showMessage: (message, severity = "info") => { },
    login: (username, password) => { },
    logout: () => { },
}

const Context = createContext(initial);
export default Context;