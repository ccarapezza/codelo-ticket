import React, { useContext, useEffect, useState } from 'react'
import { Alert, Box, Button, Card, CardContent, CardHeader, Chip, IconButton, Stack, Typography } from '@mui/material'
import { Container } from '@mui/system';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faCannabis, faJoint, faSquareFull, faSyncAlt, faTicket, faUser } from '@fortawesome/free-solid-svg-icons';
import { QrReader } from 'react-qr-reader';
import Context from '../context/Context';
import axios from 'axios';
import { ArrowBack, ContentCut, MonetizationOn } from '@mui/icons-material';

export default function BreakTicket() {
    const [camera, setCamera] = useState("environment");

    const [hashTicket, setHashTicket] = useState();
    const [mesa, setMesa] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const [ticketData, setTicketData] = useState();

    const context = useContext(Context);

    const switchCamera = () => {
        setCamera(camera === "environment" ? "user" : "environment");
    };

    const handleScan = (data) => {
        if (data) {
            setHashTicket(data);
        }
    };

    const handleError = (err) => {
        setError(err);
        console.error(err);
    };

    const clearForms = () => {
        setTicketData();
        setHashTicket();
    };

    const getMesaByDni = (dni) => {
        setMesa("");
        setLoading(true);
        axios.get("/api/ticket/participante-by-dni",{
            params:{
            dni: dni
            },
        })
        .then(function (response) {
            // handle success
            if(response.status === 200){
            setMesa(response.data?.mesa?.name);
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            setLoading(false);
        })
    };
    
    useEffect(() => {
        if(hashTicket){
            setLoading(true)
            axios.post("/api/ticket/verify",{
              hash: hashTicket
            }).then(function (response) {
                if(response.status === 200){
                    context.showMessage("Ticket verificado correctamente!", "success");
                    setTicketData(response.data);
                    getMesaByDni(response.data?.dni);
                }else{
                    clearForms();
                    context.showMessage("No se ha podido verificar el Ticket. Contacte con el administrador.", "error");
                    console.error(response);  
                }
            })
            .catch(function (error) {
                clearForms();
                context.showMessage("No se ha podido verificar el Ticket. Contacte con el administrador.", "error");
                console.error(error);
            })
            .finally(function () {
                setLoading(false);
            })
        }
    }, [hashTicket])

    const confirmarCorteTicket = () => {
        axios.put("/api/ticket/cut-ticket-by-hash",{
          hash: ticketData?.hash
        }).then(function (response) {     
          if(response.status === 200){
            context.showMessage("Ticket cortado.", "success");
          }else{
            context.showMessage("Ticket inv??lido. Contacte con el administrador.", "error");
            console.error(response);  
          }
        })
        .catch(function (error) {
            context.showMessage("No se ha confirmado el pago del Ticket. Contacte con el administrador.", "error");
            console.error(error);
        }).finally(function () {
            clearForms();
        })
        
    };

    return (
        <Container sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
            <Card sx={{ mt: 1, border: "1px solid lightgray", width: "100%" }}>
                <CardHeader title="Cortar Ticket" sx={{ borderBottom: "1px solid lightgray" }} />
                <CardContent>
                    {loading ?
                        <p>Loading...</p>
                        : hashTicket && ticketData && !error ?
                            <Stack>
                                <Button sx={{mb: 2}} color="error" variant="outlined" startIcon={<ArrowBack/>} onClick={()=>{clearForms()}} size="small">Volver</Button>
                                {ticketData.ingresado&&
                                    <Alert sx={{mb: 2}} severity="error">EL TICKET YA SE ENCUENTRA CORTADO</Alert>
                                }
                                {!ticketData.pago&&
                                    <Alert icon={<MonetizationOn/>} sx={{my: 2}} severity="warning">EL TICKET NO FU?? ABONADO</Alert>
                                }
                                <Box sx={{ display: "flex", alignContent: "center", justifyContent: "center", flexDirection: "column", textAlign: "center", mb: 2}}>
                                    <Chip size="small" variant="outlined" sx={{borderColor: "black", p:3}} label={<Stack><b style={{textTransform: "uppercase"}}>{ticketData.nombre+" "+ticketData.apellido}</b><span><FontAwesomeIcon icon={faTicket}/> E-TICKET <b>#{ticketData.id}</b></span></Stack>}/>
                                </Box>
                                {ticketData.tipo==="PARTICIPANTE"?
                                    <Box sx={{ display: "flex", alignContent: "center", justifyContent: "center", flexDirection: "column", textAlign: "center", my:2 }}>
                                        <span className="fa-layers fa-fw fa-3x" title="Participante" style={{alignSelf: "center"}}>
                                            <FontAwesomeIcon style={{color: "#0288d1"}} icon={faUser} transform="shrink-4 left-2"/>
                                            <FontAwesomeIcon icon={faCannabis} transform="shrink-8 down-4 right-4"/>
                                        </span>
                                        <Typography variant="h6">PARTICIPANTE</Typography>
                                    </Box>
                                    :
                                    <Box sx={{ display: "flex", alignContent: "center", justifyContent: "center", flexDirection: "column", textAlign: "center", my:2}}>
                                        <span className="fa-layers fa-fw fa-3x" title="Invitado" style={{alignSelf: "center"}}>
                                            <FontAwesomeIcon style={{color: "#ff5722"}} icon={faUser} transform="shrink-4 left-2"/>
                                            <FontAwesomeIcon icon={faJoint} transform="shrink-10 down-2 right-4"/>
                                        </span>
                                        <Typography variant="h6">PARTICIPANTE</Typography>
                                    </Box>
                                }
                                <Box sx={{ display: "flex", alignContent: "center", justifyContent: "center", flexDirection: "column", textAlign: "center", mb: 2}}>
                                    <Chip variant="outlined" label={<b>{"MESA "+parseInt(Math.random() * (15 - 1) + 1)}</b>}/>
                                </Box>
                                <small><strong>DNI: </strong>{ticketData.dni}</small>
                                <small><strong>E-mail: </strong>{ticketData.email}</small>
                                <small><strong>Fecha de compra: </strong>{new Date(ticketData.createdAt).toLocaleString()}</small>
                                {ticketData.ingresado&&
                                    <Alert sx={{my: 2}} severity="error">EL TICKET YA SE ENCUENTRA CORTADO</Alert>
                                }

                                {!ticketData.pago&&
                                    <Alert icon={<MonetizationOn/>} sx={{my: 2}} severity="warning">EL TICKET NO FU?? ABONADO</Alert>
                                }

                                {!ticketData.ingresado&&ticketData.pago&&
                                    <Button sx={{mt: 3}} variant="contained" color="success" startIcon={<ContentCut/>} onClick={()=>{confirmarCorteTicket()}} size="small">Cortar Ticket</Button>
                                }
                            </Stack>
                            :
                            <Card>
                                <CardHeader
                                    sx={{ pb: 0 }}
                                    subheader="Escane?? el c??digo del ticket para cortarlo"
                                    action={
                                        <IconButton aria-label="settings" onClick={(e) => { switchCamera() }}>
                                            <span className="fa-layers fa-fw fa-2x fa-dark">
                                                <FontAwesomeIcon icon={faCamera} />
                                                <FontAwesomeIcon icon={faSquareFull} transform="shrink-4 down-1" />
                                                <FontAwesomeIcon icon={faSyncAlt} inverse transform="shrink-8 down-1" />
                                            </span>
                                        </IconButton>
                                    } />
                                <CardContent>
                                     
                                        <div>
                                            <input type="text" value={hashTicket} onChange={(e)=>{setHashTicket(e.target.value)}} />
                                        </div>
                                        <div>QR RESULT:{hashTicket}</div>
                                        <div>{JSON.stringify(error)}</div>
                                    
                                    <QrReader
                                        facingMode={camera}
                                        delay={300}
                                        onError={handleError}
                                        onScan={handleScan}
                                        style={{ width: "100%" }}
                                    />
                                </CardContent>
                            </Card>
                    }
                </CardContent>
            </Card>
        </Container>
    )
}
