import { Button, Card, CardContent, CardHeader, Container, Stack, TextField } from '@mui/material'
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form';
import Context from '../context/Context';

export default function Login() {
    const contex = useContext(Context);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = () => {
        contex.login(username, password);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Container sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
                    <Card sx={{ m: 5, border: "1px solid lightgray" }}>
                        <CardHeader title="Administración" sx={{ borderBottom: "1px solid lightgray" }} />
                        <CardContent>
                            <Stack spacing={2}>
                                <TextField
                                    {...register("username", { required: true })}
                                    error={errors.username}
                                    id="outlined-basic"
                                    autoComplete="username"
                                    label="Usuario"
                                    value={username}
                                    onChange={(e)=>setUsername(e?.target?.value)}
                                />
                                <TextField
                                    {...register("password", { required: true })}
                                    error={errors.password}
                                    id="outlined-password-input"
                                    autoComplete="current-password"
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e)=>setPassword(e?.target?.value)}
                                />
                                <Button type="submit" variant="contained">Ingresar</Button>
                            </Stack>
                        </CardContent>
                    </Card>
            </Container>
        </form>
    )
}
