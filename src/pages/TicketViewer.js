import axios from 'axios';
import React, { useContext, useState } from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import Context from '../context/Context';
import logoCopa from '../assets/logo-copa.jpg';
import QRCode from 'qrcode'

export default function TicketViewer() {
    const [loading, setLoading] = useState(false);
    const [ticketData, setTicketData] = useState();
    const { hash } = useParams();
    const context = useContext(Context);

    useEffect(() => {
        setLoading(true);
        setTicketData();
        if(hash){
            axios.post("/api/ticket/verify",{
                hash: hash
            }).then(function(response) {
                if(response.status === 200){
                    context.showMessage("Ticket verificado correctamente!", "success");
                    QRCode.toDataURL(response?.data?.hash, function (err, qrHash) {
                        setTicketData({
                            ...response.data,
                            qrHash: qrHash
                        });
                    })
                }else{
                    context.showMessage("No se ha podido verificar el Ticket. Contacte con el administrador.", "error");
                    console.error(response);  
                }
            })
            .catch(function (error) {
                context.showMessage("No se ha podido verificar el Ticket. Contacte con el administrador.", "error");
                console.error(error);
            })
            .finally(function () {
                setLoading(false);
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hash]);

    return (loading?
        <Loading/>
        :
        <div style={{marginTop: "20px"}}>
            <div style={{margin: "0 auto 15px", width: "fit-content", border: "1px solid black", display: "grid"}}>
                <div style={{textAlign: "center", backgroundColor: "black", color: "white", fontWeight: "bold", padding: "10px"}}>
                    <p>{ticketData?.nombre+" "+ticketData?.apellido}</p><p>E-TICKET #{ticketData?.id}</p>
                </div>
                {ticketData?.qrHash&&
                    <img alt={ticketData?.qrHash} src={ticketData?.qrHash} style={{margin: "0 auto"}}/>
                }
            </div>
            <div style={{border: "1px solid black", width: "fit-content", margin: "0 auto", display: "table"}}>
                <img alt="logo-copa" width='200' src={logoCopa} style={{display: "table-cell"}}/>
                <ul style={{listStyleType: "none", display: "table-cell", verticalAlign: "middle", padding: "15px"}}>
                    <li><b>Fecha:</b> Domingo 17 de Julio</li>
                    <li><b>Hora:</b> 12:00 hrs.</li>
                    <li><b>Ubicaci&oacute;n:</b> - </li>
                    <li><b>Titular:</b> {ticketData?.nombre+" "+ticketData?.apellido} </li>
                    <li><b>DNI:</b> {ticketData?.dni} </li>
                    <li><b>Email:</b> {ticketData?.email} </li>
                    <li><b>Fecha de compra:</b> {(new Date(ticketData?.createdAt).toLocaleString())} </li>
                </ul>
            </div>
        </div>
    )
}
