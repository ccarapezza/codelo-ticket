import React, { useState } from 'react'
import { Box, Card, CardContent, CardHeader, Chip, Stack, Tab, Tabs } from '@mui/material'
import { Container } from '@mui/system'
import axios from 'axios';
import Loading from "../components/Loading";
import { useEffect } from 'react';
import { deepOrange, lightGreen, pink, teal } from '@mui/material/colors';
import Chart from 'react-google-charts';
import { DoorBack, MonetizationOn } from '@mui/icons-material';

export default function TicketCutControl() {

  const [ticketList, setTicketList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);

  const [ingresados, setIngresados] = useState(0);
  const [noIngresados, setNoIngresados] = useState(0);

  const [pagos, setPagos] = useState(0);
  const [noPagos, setNoPagos] = useState(0);

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
    setLoadingChart(true);
    const ingresadosCount = ticketList.filter(ticket=>ticket.ingresado).length
    const noIngresadosCount = ticketList.length-ingresadosCount;
    const pagosCount = ticketList.filter(ticket=>ticket.pago).length
    const noPagosCount = ticketList.length-pagosCount;
    setIngresados(ingresadosCount);
    setNoIngresados(noIngresadosCount);
    setPagos(pagosCount);
    setNoPagos(noPagosCount);
    setLoadingChart(false);
  }, [ticketList])
  
  const [tab, setTab] = useState(0);
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };
  return (
    <Container sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
      {loading?
        <Loading/>
      :
        <Card sx={{ mt: 5, border: "1px solid lightgray", width: "100%" }}>
          <CardHeader title="Control" sx={{ borderBottom: "1px solid lightgray" }} />
          <CardContent>

          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tab} onChange={handleChange} aria-label="basic tabs example">
                <Tab sx={{color:tab===0?"orange!important":""}} icon={<DoorBack/>} label="Ingresos" id={`tab-1`} aria-controls={`tabpanel-1`}/>
                <Tab sx={{color:tab===1?"orange!important":""}} icon={<MonetizationOn/>} label="Pagos y Reservas" id={`tab-2`} aria-controls={`tabpanel-2`} />
              </Tabs>
            </Box>
            <Box
                value={tab}
                index={0}
                role="tabpanel"
                hidden={tab !== 0}
                id={`tabpanel-1`}
                aria-labelledby={`tab-1`}
              >
                <Stack direction={"row"} sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
                  <Chip size="small" variant='outlined' sx={{ m: 1, color: lightGreen[400] }} label={<b>Ingresados: {ingresados}</b>}/>
                  <Chip size="small" variant='outlined' sx={{ m: 1, color: deepOrange[500]  }} label={<b>No ingresados: {noIngresados}</b>}/>
                </Stack>
                {loadingChart?
                  <Loading loadingMessage='Cargando gráfico...'/>
                :
                  <Chart
                    chartType="PieChart"
                    options={{is3D: true, colors: [lightGreen[500], deepOrange[400]], legend: {position: 'none'}, backgroundColor: 'transparent',}}
                    data={[["Ingresados", "Cantidad"], ["Ingresados", ingresados], ["No Ingresados", noIngresados]]}
                    width="100%"
                    height="400px"
                  />
                }
            </Box>
            <Box value={tab}
                index={1}
                role="tabpanel"
                hidden={tab !== 1}
                id={`tabpanel-2`}
                aria-labelledby={`tab-2`}
              >
                <Stack direction={"row"} sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
                  <Chip size="small" variant='outlined' sx={{ m: 1, color: teal[500] }} label={<b>Pagos: {pagos}</b>}/>
                  <Chip size="small" variant='outlined' sx={{ m: 1, color: pink[500] }} label={<b>No pagos: {noPagos}</b>}/>
                </Stack>
                {loadingChart?
                  <Loading loadingMessage='Cargando gráfico...'/>
                :
                  <Chart
                    chartType="PieChart"
                    options={{is3D: true, colors: [teal[500], pink[500]], legend: {position: 'none'}, backgroundColor: 'transparent',}}
                    data={[["Condición", "Cantidad"], ["Pagos", pagos], ["No Pagos", noPagos]]}
                    width="100%"
                    height="400px"
                  />
                }
            </Box>
          </Box>

            

            
            <Stack sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
              <Chip variant='outlined' label={<b>{ticketList.length} Tickets Totales</b>}/>
            </Stack>

          </CardContent>
        </Card>
      }
    </Container>
  )
}
