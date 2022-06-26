import { faChartPie, faCut, faHome, faList, faSignIn, faSignOut, faTicket, faTicketSimple } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import Context from '../context/Context';

export default function Menu(props) {
    const { menuOpen, setMenuOpen } = props;
    let navigate = useNavigate();
    const context = useContext(Context);

    return (
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
                    <ListItem button key={"home"} onClick={(e) => navigate("/")}>
                        <ListItemIcon>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faHome} transform="shrink-6 left-2" />
                            </span>
                        </ListItemIcon>
                        <ListItemText primary={"Inicio"} />
                    </ListItem>

                    {!context.isLogged&&
                    <ListItem button key={"login"} onClick={(e) => navigate("/login")}>
                        <ListItemIcon>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faSignIn} transform="shrink-6 left-2" />
                            </span>
                        </ListItemIcon>
                        <ListItemText primary={"Iniciar Sesión"} />
                    </ListItem>
                    }   

                    {context.isLogged&&
                        <>
                            <ListItem button key={"break-ticket"} onClick={(e) => navigate("/break-ticket")}>
                                <ListItemIcon>
                                    <span className="fa-layers fa-fw fa-3x">
                                        <FontAwesomeIcon icon={faCut} transform="shrink-6 left-2" />
                                    </span>
                                </ListItemIcon>
                                <ListItemText primary={"Cortar Ticket"} />
                            </ListItem>
                            <ListItem button key={"create-ticket"} onClick={(e) => navigate("/create-ticket")}>
                                <ListItemIcon>
                                    <span className="fa-layers fa-fw fa-3x">
                                        <FontAwesomeIcon icon={faTicket} transform="shrink-6 left-2" />
                                    </span>
                                </ListItemIcon>
                                <ListItemText primary={"Crear Ticket"} />
                            </ListItem>

                            <ListItem button key={"reserve-ticket"} onClick={(e) => navigate("/reserve-ticket")}>
                                <ListItemIcon>
                                    <span className="fa-layers fa-fw fa-3x">
                                        <FontAwesomeIcon icon={faTicketSimple} transform="shrink-6 left-2" />
                                    </span>
                                </ListItemIcon>
                                <ListItemText primary={"Reservar Ticket"} />
                            </ListItem>

                            <ListItem button key={"list-ticket"} onClick={(e) => navigate("/ticket-list")}>
                                <ListItemIcon>
                                    <span className="fa-layers fa-fw fa-3x">
                                        <FontAwesomeIcon icon={faList} transform="shrink-6 left-2" />
                                    </span>
                                </ListItemIcon>
                                <ListItemText primary={"Lista Tickets"} />
                            </ListItem>

                            <ListItem button key={"control-ticket"} onClick={(e) => navigate("/cut-ticket-control")}>
                                <ListItemIcon>
                                    <span className="fa-layers fa-fw fa-3x">
                                        <FontAwesomeIcon icon={faChartPie} transform="shrink-6 left-2" />
                                    </span>
                                </ListItemIcon>
                                <ListItemText primary={"Control"} />
                            </ListItem>

                            <ListItem button key={"close-session"} onClick={(e) => context.logout()}>
                                <ListItemIcon>
                                    <span className="fa-layers fa-fw fa-3x">
                                        <FontAwesomeIcon icon={faSignOut} transform="shrink-6 left-2" />
                                    </span>
                                </ListItemIcon>
                                <ListItemText primary={"Cerrar Sesión"} />
                            </ListItem>
                        </>
                    }
                </List>
            </Box>
        </Drawer>
    )
}
