import { Button, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';

export default function TicketForm(props) {
    const { defaultValues, ticket, setTicket, onSubmit } = props;
    const { register, reset, handleSubmit, formState: { errors } } = useForm({defaultValues: defaultValues});

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset])

    const setData = (param, value) => {
        setTicket(currentNewTicket => {
            return {
                ...currentNewTicket,
                [param]: value
            }
        })
    }

    return (
        <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
                <TextField
                    id="input-nombre"
                    autoComplete="input-nombre"
                    label="Nombre"
                    {...register("nombre", { required: true })}
                    error={errors?.nombre}
                    value={ticket?.nombre}
                    defaultValues={defaultValues?.nombre}
                    onChange={(e)=>{setData("nombre", e.target.value)}}
                    />
                <TextField
                    id="input-apellido"
                    autoComplete="input-apellido"
                    label="Apellido"
                    {...register("apellido", { required: true })}
                    error={errors?.apellido}
                    value={ticket?.apellido}
                    onChange={(e)=>{setData("apellido", e.target.value)}}
                />
                <TextField
                    id="input-dni"
                    autoComplete="input-dni"
                    label="DNI"
                    {...register("dni", { required: true })}
                    error={errors?.dni}
                    type="number"
                    value={ticket?.dni}
                    onChange={(e)=>{setData("dni", e.target.value)}}
                />
                <TextField
                    id="input-email"
                    autoComplete="input-email-not-autocomplete"
                    label="Email"
                    {...register("email", {
                        required: true,
                        pattern: {
                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: 'Please enter a valid email',
                        }
                    })}
                    error={errors?.email}
                    type="text"
                    value={ticket?.email}
                    onChange={(e)=>{setData("email", e.target.value)}}
                />
                <ToggleButtonGroup
                    value={ticket?.tipo}
                    onChange={(e, newTipo) => {
                        if(newTipo){
                            setData("tipo", newTipo);
                        }
                    }}
                    exclusive
                >
                    <ToggleButton value="PARTICIPANTE" sx={ticket?.tipo==="PARTICIPANTE"?{fontWeight: 'bold', color: "#0288d1!important", borderColor: "#0288d1!important"}:{}}>PARTICIPANTE</ToggleButton>
                    <ToggleButton value="INVITADO" sx={ticket?.tipo==="INVITADO"?{fontWeight: 'bold', color: "#ff5722!important", borderColor: "#ff5722!important"}:{}}>INVITADO</ToggleButton>
                    <ToggleButton value="SPONSOR" sx={ticket?.tipo==="SPONSOR"?{fontWeight: 'bold', color: "#11ac39!important", borderColor: "#11ac39!important"}:{}}>SPONSOR</ToggleButton>
                </ToggleButtonGroup>
                <TextField
                    id="input-observaciones"
                    autoComplete="input-observaciones"
                    label="Observaciones"
                    type="text"
                    value={ticket?.observaciones}
                    onChange={(e)=>{setData("observaciones", e.target.value)}}
                />
                <Button type="submit" variant="contained">GUARDAR</Button>
            </Stack>
        </form>
    )
}
