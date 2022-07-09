import { Button, Card, CardContent, CardHeader, Stack } from '@mui/material'
import { Container } from '@mui/system'
import React, { useContext, useEffect, useState } from 'react'
import axios from "axios";
import Context from '../context/Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function EditEmailInfo(props) {
  const {} = props;
  const context = useContext(Context);

  const [dataList, setDataList] = useState([]);

  const updateTicket = (name, value) => {
    axios.put("/api/param/update",{
      name:name,
      value:value,
    }).then(function (response) {     
      if(response.status === 200){
        context.showMessage("Información actualizada correctamente!", "success");
      }else{
        context.showMessage("No se ha actualizado la información. Contacte con el administrador.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      context.showMessage("No se ha actualizado la información. Contacte con el administrador.", "error");
      console.error(error);
    })
  };
  
  useEffect(() => {
    axios.get("/api/param/list").then(function (response) {     
      if(response.status === 200){
        setDataList(response.data);
        context.showMessage("Informmación cargada correctamente!", "success");
      }else{
        context.showMessage("No se ha cargado la información. Contacte con el administrador.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      context.showMessage("No se ha cargado la información. Contacte con el administrador.", "error");
      console.error(error);
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const onSubmit = () => {
  };

  return (
    <Container sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
      <Card sx={{ mt: 1, border: "1px solid lightgray", width: "100%" }}>
        <CardHeader title={<><FontAwesomeIcon icon={faEnvelope}/>Editar E-mail Info</>} sx={{ borderBottom: "1px solid lightgray" }} />
        <CardContent>
          <form autoComplete='off' onSubmit={()=>{}}>
            <Stack spacing={2}>
                {JSON.stringify(dataList)}
                {/*
                  <TextField
                      id="input-name"
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
                */}
                <Button type="submit" variant="contained">GUARDAR</Button>
            </Stack>
        </form>
        </CardContent>
      </Card>
    </Container>
  )
}
