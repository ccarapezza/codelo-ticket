import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import { Menu } from "@material-ui/icons";
import { Drawer, Box, List, ListItem, ListItemIcon, ListItemText, Divider, Chip } from "@mui/material";
import { useContext, useState } from "react";
import Context from "../context/Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faSignOutAlt, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { yellow } from "@mui/material/colors";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

export default function Page({ title, children, footer = true, style, loading = false, containerMaxWidth }) {
  const context = useContext(Context);
  const [menuOpen, setMenuOpen] = useState(false);
  let history = useNavigate();
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}
            onClick={(e) => {
              setMenuOpen(true);
            }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" component="div" sx={{display: "flex", alignItems: "center", flexGrow: 1 }}>
            {title}
            {context.isLogged&&
              <Chip size="small" sx={{mx: 1, color: "white", backgroundColor: yellow[900]}} label={<Box sx={{display: "flex", alignItems: "center"}}>
                <FontAwesomeIcon icon={faKey} style={{marginRight: 5, fontSize: "0.6rem"}}/>
                <Typography sx={{fontSize: "0.6rem"}}>Admin</Typography>
              </Box>}/>
            }
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
          {context.isLogged&&
            <List>
              <Divider key={"admin-menu-title"}>
                <Chip label="Menú Administrador" color="primary"/>
              </Divider>
              <ListItem button key={"create-ticket"} onClick={(e)=>{history.push("/ticket/create")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-3x">
                    <FontAwesomeIcon icon={faUserPlus} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Nuevo Ticket"} />
              </ListItem>
              <ListItem button key={"logout"} onClick={(e)=>{context.logout()}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-3x">
                    <FontAwesomeIcon icon={faSignOutAlt} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Cerrar Sesión"} />
              </ListItem>
            </List>
          }
        </Box>
      </Drawer>
      <Container maxWidth={containerMaxWidth} sx={{p: 2, mb:footer && context.isParticipanteLogged?16:2, ...style }}>
        {loading?
          <Loading/>
        :
          children
        }
      </Container>
    </>
  );
}
