import { Card, CardContent, CardHeader } from '@mui/material'
import { Container } from '@mui/system'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import Context from '../context/Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faTicket } from '@fortawesome/free-solid-svg-icons';
import TicketForm from '../components/TicketForm';

export default function CreateTicket(props) {
  let navigate = useNavigate();
  const { reserve, edit } = props;
  const context = useContext(Context);
  const { id } = useParams();

  const [defaultValues, setDefaultValues] = useState({});
  const [newTicket, setNewTicket] = useState({
    nombre:"",
    apellido:"",
    dni:"",
    email:"",
    tipo:"PARTICIPANTE",
    observaciones:""
  });

  const clearForm = () => {
    setNewTicket({
      nombre:"",
      apellido:"",
      dni:"",
      email:"",
      tipo:"PARTICIPANTE",
      observaciones:""
    });
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
        navigate("/ticket-list");
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
          const ticketDefaultValue = {
            nombre: obtainedTicket.nombre,
            apellido: obtainedTicket.apellido,
            dni: obtainedTicket.dni,
            email: obtainedTicket.email,
            tipo: obtainedTicket.tipo,
            observaciones: obtainedTicket.observaciones?obtainedTicket.observaciones:""
          };

          context.showMessage("Ticket cargado correctamente!", "success");
          setNewTicket(ticketDefaultValue);
          setDefaultValues(ticketDefaultValue);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <Container sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
          <Card sx={{ mt: 1, border: "1px solid lightgray", width: "100%" }}>
            <CardHeader title={<Header/>} sx={{ borderBottom: "1px solid lightgray" }} />
            <CardContent>
              <TicketForm defaultValues={defaultValues} ticket={newTicket} setTicket={setNewTicket} onSubmit={onSubmit}/>
            </CardContent>
          </Card>
      </Container>
  )
}
