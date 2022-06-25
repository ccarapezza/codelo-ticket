import React, { useState } from 'react'
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Container, IconButton, Toolbar } from "@mui/material";
import "./App.css";
import RoutesSection from './RoutesSection';
import Menu from './components/Menu';
import axios from "axios";
import ContextProvider from "./context/ContextProvider";
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@emotion/react";
import { blueGrey, deepOrange } from "@mui/material/colors";
import { useLocation } from 'react-router-dom';

axios.defaults.baseURL = process.env.NODE_ENV === "production"?"https://codelo-ticket-api.herokuapp.com/":"http://localhost:8080/";
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  console.log("status", error.response.status);
  if(error.response.status===403){
    if(!window.location.href.endsWith(".herokuapp.com/")){
      window.location.href = "/";
    }
  }
  return Promise.reject(error);
});

const theme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: blueGrey[900],
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: deepOrange[500],
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
})

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  let location = useLocation();

  return (
    <ThemeProvider theme={theme}>  
      <ContextProvider>
        <Container maxWidth={false} disableGutters={true}>
            {!location.pathname.includes("/ticket-viewer/")&&
              <>
                <AppBar position="sticky">
                  <Toolbar variant="dense">
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={(e) => { setMenuOpen(true); }}>
                      <MenuIcon />
                    </IconButton>
                  </Toolbar>
                </AppBar>
                <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
              </>
            }
          <RoutesSection />
        </Container>
      </ContextProvider>
    </ThemeProvider>
  );
}
