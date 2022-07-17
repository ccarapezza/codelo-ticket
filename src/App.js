import React, { useState } from 'react'
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Backdrop, Box, Button, CircularProgress, Container, CssBaseline, IconButton, Stack, Toolbar } from "@mui/material";
import "./App.css";
import RoutesSection from './RoutesSection';
import Menu from './components/Menu';
import axios from "axios";
import ContextProvider from "./context/ContextProvider";
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@emotion/react";
import { useLocation } from 'react-router-dom';
import { faServer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Brightness4, Brightness7, Refresh } from '@mui/icons-material';
import codeloTicketLogo from './assets/codelo-ticket-logo.png';
import { blueGrey, deepOrange } from '@mui/material/colors';

axios.defaults.baseURL = process.env.NODE_ENV === "production"?"https://codelo-ticket-api.herokuapp.com/":"http://localhost:8080/";
//axios.defaults.baseURL = "https://codelo-ticket-api.herokuapp.com/";
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

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });


export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  let location = useLocation();
  const [networkError, setNetworkError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = React.useState('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
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
      }),
    [mode],
  );

  axios.get("/").then(function (response) {
    console.log("Server is alive...")
  }).catch(function (error) {
    // handle error
    console.log(error);
    if(error?.code==="ERR_NETWORK"){
      console.error("Network error...");
      setNetworkError(true);
    }
  }).finally(function(){
    setLoading(false);
  })

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>  
        <CssBaseline enableColorScheme />
        <ContextProvider>

          <Backdrop
            sx={{backgroundColor: "rgba(0, 0, 0, 0.9)", color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={networkError||loading}
            onClick={()=>{}}
          >
            {loading?
              <CircularProgress color="inherit" />
            :
              <Stack sx={{display:"flex", alignItems: "center"}}>
                <span className="fa-layers fa-fw fa-4x">
                  <FontAwesomeIcon icon={faServer}/>
                </span>
                <p>Servidor no disponible...</p>
                <Button startIcon={<Refresh/>} variant="outlined" sx={{color:"white", borderColor:"white"}} onClick={()=>{window.location.href = "/"}}>Reintentar</Button>
              </Stack>
            }
          </Backdrop>

          {!networkError?
            <Container maxWidth={false} disableGutters={true}>
                {!location.pathname.includes("/ticket-viewer/")&&
                  <>
                    <AppBar position="sticky">
                      <Toolbar variant="dense" sx={{display:"flex", justifyContent: "space-between"}}>
                        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={(e) => { setMenuOpen(true); }}>
                          <MenuIcon />
                        </IconButton>
                        <IconButton edge="end" color="inherit" sx={{ ml: 1 }} onClick={colorMode.toggleColorMode}>
                          {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                      </Toolbar>
                    </AppBar>
                    <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                  </>
                }
              <RoutesSection />
            </Container>
          :
            <Box sx={{ display: "flex", alignContent: "center", justifyContent: "center"}}>
              <img alt="Codelo Ticket!" style={{ width: "100%", maxWidth: "550px", marginTop: "20px", marginBottom: "20px" }} src={codeloTicketLogo}></img>
            </Box>
          }

        </ContextProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
