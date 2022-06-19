import { Button, Card, CardContent, CardHeader, Container, Stack, TextField } from '@mui/material'
import React from 'react'

export default function Login() {
    return (
        <Container sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
            <Card sx={{ m: 5, border: "1px solid lightgray" }}>
                <CardHeader title="Administración" sx={{ borderBottom: "1px solid lightgray" }} />
                <CardContent>
                    <Stack spacing={2}>
                        <TextField
                            id="outlined-basic"
                            label="Usuario"
                        />
                        <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                        />
                        <Button variant="contained">Ingresar</Button>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    )
}
