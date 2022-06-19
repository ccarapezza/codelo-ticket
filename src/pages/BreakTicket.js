import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, IconButton, Stack } from '@mui/material'
import { Container } from '@mui/system';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faSquareFull, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { QrReader } from 'react-qr-reader';

export default function BreakTicket() {
    const [camera, setCamera] = useState("environment");

    const [hashTicket, setHashTicket] = useState();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

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


    useEffect(() => {
    }, [])

    return (
        <Container sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
            <Card sx={{ mt: 5, border: "1px solid lightgray", width: "100%" }}>
                <CardHeader title="Cortar Ticket" sx={{ borderBottom: "1px solid lightgray" }} />
                <CardContent>
                    {loading ?
                        <p>Loading...</p>
                        : hashTicket && !error ?
                            <Stack >
                            </Stack>
                            :
                            <Card>
                                <CardHeader
                                    sx={{ pb: 0 }}
                                    subheader="Escaneé el código del ticket para cortarlo"
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
                                    {/* 
                                <div>
                                    <input type="text" value={hashMuestra} onChange={(e)=>{setHashMuestra(e.target.value)}} />
                                    <button onClick={(e)=>{validarMuestra()}}>Login</button>
                                </div>
                                <div>QR RESULT:{hashMuestra}</div>
                                <div>{JSON.stringify(error)}</div>
                            */}
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
