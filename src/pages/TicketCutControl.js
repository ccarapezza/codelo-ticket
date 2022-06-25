import React, { useState } from 'react'
import { Card, CardContent, CardHeader, Chip, Stack } from '@mui/material'
import { Container } from '@mui/system'
import axios from 'axios';
import Loading from "../components/Loading";
import { useEffect } from 'react';
import { green, red } from '@mui/material/colors';
import Chart from 'react-google-charts';

export default function TicketCutControl() {

  const [ticketList, setTicketList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [ingresados, setIngresados] = useState(0);
  const [noIngresados, setNoIngresados] = useState(0);

  const listAllTickets = () => {
    setLoading(true);
    setTicketList([]);
    axios.get("/api/ticket/list")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        setTicketList(response.data);
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
    listAllTickets();
  }, [])

  useEffect(() => {
    const ingresadosCount = ticketList.filter(ticket=>ticket.ingresado).length
    const noIngresadosCount = ticketList.length-ingresadosCount;
    setIngresados(ingresadosCount);
    setNoIngresados(noIngresadosCount);
  }, [ticketList])
  

  return (
    <Container sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
      {loading?
        <Loading/>
      :
        <Card sx={{ mt: 5, border: "1px solid lightgray", width: "100%" }}>
          <CardHeader title="Control de ingreso" sx={{ borderBottom: "1px solid lightgray" }} />
          <CardContent>
            <Stack direction={"row"} sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
              <Chip size="small" color="success" variant='outlined' sx={{ m: 1, color: green[500] }} label={<b>Ingresados: {ingresados}</b>}/>
              <Chip size="small" color="error" variant='outlined' sx={{ m: 1, color: red[400]  }} label={<b>No ingresados: {noIngresados}</b>}/>
            </Stack>
            <Chart
              chartType="PieChart"
              options={{is3D: true, colors: [green[500], red[400]], legend: {position: 'none'}}}
              data={[["Ingresados", "Cantidad"], ["Ingresados", ingresados], ["No Ingresados", noIngresados]]}
              width="100%"
              height="400px"
            />
            <Stack sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
              <Chip variant='outlined' label={<b>Total de participantes: {ticketList.length}</b>}/>
            </Stack>
          </CardContent>
        </Card>
      }
    </Container>
  )
}
