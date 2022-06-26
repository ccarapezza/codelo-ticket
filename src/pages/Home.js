import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ContentCut, Login, Logout } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, Box, Button, Paper, Stack } from '@mui/material';
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import codeloTicketLogo from '../assets/codelo-ticket-logo.png';
import Context from '../context/Context';

export default function Home() {
  const context = useContext(Context);
  let navigate = useNavigate();

  return (<>
    <Stack sx={{ display: "flex", alignContent: "center", justifyContent: "center"}}>
      <Box sx={{ display: "flex", alignContent: "center", justifyContent: "center"}}>
        <img alt="Codelo Ticket!" style={{ width: "100%", maxWidth: "550px", marginTop: "20px", marginBottom: "20px" }} src={codeloTicketLogo}></img>
      </Box>
      {!context.isLogged?
        <Button variant="contained" endIcon={<Login/>} onClick={()=>navigate("/login")} sx={{width: "fit-content", alignSelf: "center"}} size="small">Ingresar</Button>
        :
        <Box sx={{ display: "flex", alignContent: "center", justifyContent: "center", p: 2, flexDirection: "column", textAlign: "center" }}>
          <Button variant="contained" onClick={()=>context.logout()} sx={{width: "fit-content", alignSelf: "center"}} size="small" startIcon={<Logout/>}>Cerrar sesión</Button>
        </Box>
      }
    </Stack>

    {context.isLogged&&
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={""}
          onChange={(event, newValue) => {
            
          }}
        >
          <BottomNavigationAction onClick={()=>{navigate("/break-ticket")}} label="Cortar Tickets" icon={<Box sx={{ display: "flex", WebkitAlignItems: "center", justifyContent: "center"}}><ContentCut /><FontAwesomeIcon icon={faTicket} /></Box>} />
        </BottomNavigation>
      </Paper>
    }
  </>)
}
