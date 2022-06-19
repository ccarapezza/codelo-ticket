import { Edit } from '@mui/icons-material';
import { Card, CardContent, CardHeader, Chip, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'

export default function TicketList() {

  function createData(nombre, apellido, dni, isParticipante, isPago, observaciones, isBroke) {
    return { nombre, apellido, dni, isParticipante, isPago, observaciones, isBroke };
  }

  const rows = [
    createData('Jorge','Juarez', 23737737, true, true, "", true),
    createData('Roberto','Perez', 34081431, false, true, "", false),
    createData('Irma','Rodriguez', 34081431, true, false, "Falta muestra", false),
    createData('Marta','Hidalgo', 34081431, true, true, "", false),
  ];
  
  return (
    <Container sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
      <Card sx={{ mt: 5, border: "1px solid lightgray", width: "100%" }}>
        <CardHeader title="Tickets" sx={{ borderBottom: "1px solid lightgray" }} />
        <CardContent>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{fontWeight: "bold"}}>Nombre</TableCell>
                  <TableCell sx={{fontWeight: "bold"}}>Apellido</TableCell>
                  <TableCell sx={{fontWeight: "bold"}}>DNI</TableCell>
                  <TableCell sx={{fontWeight: "bold"}}>Tipo</TableCell>
                  <TableCell sx={{fontWeight: "bold"}}>Pago</TableCell>
                  <TableCell sx={{fontWeight: "bold"}}>Observaciones</TableCell>
                  <TableCell sx={{fontWeight: "bold"}}>Editar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: row.isBroke?'pink':'' }}
                  >
                    <TableCell>{row.nombre}</TableCell>
                    <TableCell>{row.apellido}</TableCell>
                    <TableCell>{row.dni}</TableCell>
                    <TableCell>{row.isParticipante?<Chip color="info" label="PARTICIPANTE" />:<Chip color="secondary" label="INVITADO" />}</TableCell>
                    <TableCell>{row.isPago?<Chip color="success" label="PAGO" />:<Chip color="error" label="NO PAGO" />}</TableCell>
                    <TableCell>{row.observaciones}</TableCell>
                    <TableCell>
                      <IconButton>
                        <Edit />
                      </IconButton>
                    </TableCell>
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  )
}
