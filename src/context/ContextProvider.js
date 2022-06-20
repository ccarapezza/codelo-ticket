import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Context from "./Context";

function ContextProvider({ children }) {
  let history = useHistory();
  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserDataState] = useState(JSON.parse(localStorage.getItem('userdata')?localStorage.getItem('userdata'):null));
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const showMessage = (message, severity) => {
    setSnackbarMessage(message);
    setSeverity(severity);
    setSnackbarOpen(true);
  };

  const setUserData = (newUserData) => {
    if(newUserData){
      localStorage.setItem('userdata', JSON.stringify(newUserData));
    }
    setUserDataState(newUserData);
  }

  const login = (username, password) => {
    localStorage.clear();
    setUserData(null);
    setIsLogged(false);
    axios.post("/api/auth/signin",{
      username: username,
      password: password,
    }).then(function (response) {
      if(response.status === 200){
        setUserData(response.data);
        showMessage("Sesión iniciada, Bienvenido!", "success");
        history.push("/");
      }else{
        showMessage("Usuario y/o contraseña incorrectos.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      showMessage("Usuario y/o contraseña incorrectos.", "error");
      console.error(error);
    })
  }

  const logout = () => {
    localStorage.clear();
    setUserData(null);
    showMessage("Sesión cerrada.", "success");
    history.push("/");
  }

  useEffect(() => {
    if(userData?.accessToken){
      setIsLogged(true);
      //Set id token
      axios.defaults.headers.common["x-access-hash"] = null;
      axios.defaults.headers.common["x-access-token"] = userData?.accessToken;
    }else{
      setIsLogged(false);
    }
  }, [userData?.accessToken]);

  return (
    <Context.Provider value={{ 
        userData: userData,
        isLogged: isLogged,
        showMessage: (message, severity = "info") => {
          showMessage(message, severity);
        },
        login: (username, password) => {
          login(username, password);
        },
        logout: () =>{
          logout();
        }
      }}>
        {children}
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
          <Alert elevation={3} onClose={handleSnackbarClose} severity={severity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
    </Context.Provider>
  );
}

export default ContextProvider;