import { Button, Card, CardContent, CardHeader, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { Container } from '@mui/system'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from "axios";
import Context from '../context/Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faTicket } from '@fortawesome/free-solid-svg-icons';

export default function CreateTicket(props) {
  const { reserve, edit } = props;
  const context = useContext(Context);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { id } = useParams();

  const [newTicket, setNewTicket] = useState({
    nombre:"",
    apellido:"",
    dni:"",
    email:"",
    tipo:"PARTICIPANTE",
    observaciones:""
  });

  const clearForm = (param, value) => {
    setNewTicket({
      nombre:"",
      apellido:"",
      dni:"",
      email:"",
      tipo:"PARTICIPANTE",
      observaciones:""
    });
  }

  const setData = (param, value) => {
    setNewTicket(currentNewTicket => {
        return {
            ...currentNewTicket,
            [param]: value
        }
    })
  }

  const createTicket = () => {
    axios.post(reserve?"/api/ticket/reserve":"/api/ticket/create",{
      ...newTicket,
      observaciones: newTicket.observaciones?newTicket.observaciones:null
    }).then(function (response) {     
      if(response.status === 200){
        context.showMessage(reserve?"Ticket reservado correctamente!":"Ticket creado correctamente!", "success");
        clearForm();
      }else{
        context.showMessage(reserve?"No se ha reservado el Ticket. Contacte con el administrador.":"No se ha creado el Ticket. Contacte con el administrador.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      context.showMessage(reserve?"No se ha reservado el Ticket. Contacte con el administrador.":"No se ha creado el Ticket. Contacte con el administrador.", "error");
      console.error(error);
    })
  };

  const updateTicket = () => {
    axios.put("/api/ticket/update",{
      id:id,
      ...newTicket,
      observaciones: newTicket.observaciones?newTicket.observaciones:null
    }).then(function (response) {     
      if(response.status === 200){
        context.showMessage("Ticket actualizado correctamente!", "success");
        clearForm();
      }else{
        context.showMessage("No se ha actualizado el Ticket. Contacte con el administrador.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      context.showMessage("No se ha actualizado el Ticket. Contacte con el administrador.", "error");
      console.error(error);
    })
  };
  
  useEffect(() => {
    if(edit){
      axios.get("/api/ticket",{
        params:{
          id: id
        },
      }).then(function (response) {     
        if(response.status === 200){
          const obtainedTicket = response.data;
          context.showMessage("Ticket cargado correctamente!", "success");
          setNewTicket({
            nombre: obtainedTicket.nombre,
            apellido: obtainedTicket.apellido,
            dni: obtainedTicket.dni,
            email: obtainedTicket.email,
            tipo: obtainedTicket.tipo,
            observaciones: obtainedTicket.observaciones?obtainedTicket.observaciones:""
          });
        }else{
          context.showMessage("No se ha cargado el Ticket. Contacte con el administrador.", "error");
          console.error(response);  
        }
      })
      .catch(function (error) {
        context.showMessage("No se ha cargado el Ticket. Contacte con el administrador.", "error");
        console.error(error);
      })
    }
  }, [])
  

  const onSubmit = () => {
    if(edit){
      updateTicket();
    }else{
      createTicket();
    }
  };

  const Header = ()=>{
    if(edit){
      return (<><FontAwesomeIcon icon={faTicket}/> Editar E-Ticket #{id}</>);
    }else{
      if(reserve)
        return (<><FontAwesomeIcon icon={faExclamationCircle}/> Reservar E-Ticket</>);
      else
        return (<><FontAwesomeIcon icon={faTicket}/> Nuevo E-Ticket</>);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
          <Card sx={{ mt: 1, border: "1px solid lightgray", width: "100%" }}>
            <CardHeader title={<Header/>} sx={{ borderBottom: "1px solid lightgray" }} />
            <CardContent>
              <Stack spacing={2}>
                <TextField
                    id="input-nombre"
                    label="Nombre"
                    {...register("nombre", { required: true })}
                    error={errors.nombre}
                    value={newTicket.nombre}
                    onChange={(e)=>{setData("nombre", e.target.value)}}
                />
                <TextField
                    id="input-apellido"
                    label="Apellido"
                    {...register("apellido", { required: true })}
                    error={errors.apellido}
                    value={newTicket.apellido}
                    onChange={(e)=>{setData("apellido", e.target.value)}}
                />
                <TextField
                    id="input-dni"
                    label="DNI"
                    {...register("dni", { required: true })}
                    error={errors.dni}
                    type="number"
                    value={newTicket.dni}
                    onChange={(e)=>{setData("dni", e.target.value)}}
                />
                <TextField
                    id="input-email"
                    label="Email"
                    {...register("email", {
                      required: true,
                      pattern: {
                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: 'Please enter a valid email',
                      }
                    })}
                    error={errors.email}
                    type="text"
                    value={newTicket.email}
                    onChange={(e)=>{setData("email", e.target.value)}}
                />
                <ToggleButtonGroup
                  color="secondary"
                  value={newTicket.tipo}
                  onChange={(e, newTipo) => {
                    setData("tipo", newTipo);
                  }}
                  exclusive
                >
                  <ToggleButton value="PARTICIPANTE" sx={newTicket.tipo==="PARTICIPANTE"?{fontWeight: 'bold'}:{}}>PARTICIPANTE</ToggleButton>
                  <ToggleButton value="INVITADO" sx={newTicket.tipo==="INVITADO"?{fontWeight: 'bold'}:{}}>INVITADO</ToggleButton>
                </ToggleButtonGroup>
                <TextField
                    id="input-observaciones"
                    label="Observaciones"
                    type="text"
                    value={newTicket.observaciones}
                    onChange={(e)=>{setData("observaciones", e.target.value)}}
                />
                <Button type="submit" variant="contained">GUARDAR</Button>
              </Stack>
            </CardContent>
          </Card>
      </Container>
    </form>
  )
}
