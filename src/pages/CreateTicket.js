import { Button, Card, CardContent, CardHeader, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { Container } from '@mui/system'
import React, { useState } from 'react'

export default function CreateTicket() {
  const [tipoParticipante, setTipoParticipante] = useState("PARTICIPANTE");
  return (
    <Container sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
      <Card sx={{ mt: 5, border: "1px solid lightgray", width: "100%" }}>
        <CardHeader title="Nuevo Ticket" sx={{ borderBottom: "1px solid lightgray" }} />
        <CardContent>
          <Stack spacing={2}>
            <TextField
                id="input-nombre"
                label="Nombre"
            />
            <TextField
                id="input-apellido"
                label="Apellido"
            />
            <TextField
                id="input-dni"
                label="DNI"
                type="number"
            />
            <ToggleButtonGroup
              color="primary"
              value={tipoParticipante}
              onChange={(e)=>{
                setTipoParticipante(e.target.value)
              }}
            >
              <ToggleButton value="PARTICIPANTE">PARTICIPANTE</ToggleButton>
              <ToggleButton value="INVITADO">INVITADO</ToggleButton>
            </ToggleButtonGroup>
            <TextField
                id="input-observaciones"
                label="Observaciones"
                type="text"
            />
            <Button variant="contained">GUARDAR</Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  )
}
