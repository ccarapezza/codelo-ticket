import React, { useState } from 'react'
import { faHome, faList, faPlus, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Container, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import BreakTicket from "./pages/BreakTicket";
import CreateTicket from "./pages/CreateTicket";
import Home from "./pages/Home";
import Login from "./pages/Login";
import TicketList from "./pages/TickerList";

export default function App() {
  let navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <Container maxWidth="false" disableGutters="true">
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon 
              onClick={(e) => {
                setMenuOpen(true);
              }}/>
          </IconButton>
          <Typography variant="h6" color="inherit" component="div">
            Codelo-TICKET
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
        }}
      >
        <Box sx={{ width: 250 }} role="presentation"
          onClick={() => {
            setMenuOpen(false);
          }}
          onKeyDown={() => {
            setMenuOpen(false);
          }}
        >
          <List>
            <ListItem button key={"home"} onClick={(e)=>navigate("/")}>
              <ListItemIcon>
                <span className="fa-layers fa-fw fa-3x">
                  <FontAwesomeIcon icon={faHome} transform="shrink-6 left-2"/>
                </span>
              </ListItemIcon>
              <ListItemText primary={"Inicio"} />
            </ListItem>
            <ListItem button key={"break-ticket"} onClick={(e)=>navigate("/break-ticket")}>
              <ListItemIcon>
                <span className="fa-layers fa-fw fa-3x">
                  <FontAwesomeIcon icon={faTicket} transform="shrink-6 left-2"/>
                </span>
              </ListItemIcon>
              <ListItemText primary={"Cortar Ticket"} />
            </ListItem>
            <ListItem button key={"home"} onClick={(e)=>navigate("/create-ticket")}>
              <ListItemIcon>
                <span className="fa-layers fa-fw fa-3x">
                  <FontAwesomeIcon icon={faPlus} transform="shrink-6 left-2"/>
                </span>
              </ListItemIcon>
              <ListItemText primary={"Crear Ticket"} />
            </ListItem>

            <ListItem button key={"home"} onClick={(e)=>navigate("/ticket-list")}>
              <ListItemIcon>
                <span className="fa-layers fa-fw fa-3x">
                  <FontAwesomeIcon icon={faList} transform="shrink-6 left-2"/>
                </span>
              </ListItemIcon>
              <ListItemText primary={"Lista Tickets"} />
            </ListItem>
           </List>
        </Box>
      </Drawer>
      <Routes/>
    </Container>
  );
}
