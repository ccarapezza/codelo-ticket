import { Alert, Button, Card, CardContent, CardHeader, IconButton, Stack, TextareaAutosize, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import axios from "axios";
import Context from '../context/Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Save, Undo } from '@mui/icons-material';
import { ConfirmDialog } from '../components/ConfirmDialog';

export default function EditEmailInfo(props) {
  const context = useContext(Context);

  const [dataList, setDataList] = useState(null);
  const [dataValue, setDataValue] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);

  const updateParam = (name, value) => {
    axios.put("/api/param/update",{
      name:name,
      value:value,
    }).then(function (response) {     
      if(response.status === 200){
        context.showMessage("Información actualizada correctamente!", "success");
        loadParams();
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

  const getLabel = (name)=>{
    switch (name) {
      case "EMAIL_SUBJECT":
        return "Asunto";
      case "EMAIL_MESSAGE":
        return "Mensaje";
      case "EMAIL_EVENT_DATE":
        return "Fecha del evento";
      case "EMAIL_EVENT_HOUR":
        return "Hora del evento";
      case "EMAIL_EVENT_LOCATION":
        return "Lugar del evento";
      default:
        return name;
    }
  }
  
  const resendAllEmail = () => {
    axios.post("/api/ticket/resend-all-email")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function (error) {
      context.showMessage("No se ha cargado la información. Contacte con el administrador.", "error");
      console.error(error);
    })
  };
  
  const loadParams = ()=>{
    axios.get("/api/param/list").then(function (response) {     
      setDataList(null);
      setDataValue(null);
      if(response.status === 200){
        setDataList(response.data);
        setDataValue(response.data?.map((data)=>data.value));
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
  }

  useEffect(() => {
    loadParams();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <Container sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
      <ConfirmDialog open={openDialog}
        setOpen={setOpenDialog}
        actionConfirm={resendAllEmail}
        message={"Se procederá a enviar todos los Tickets a los emails correspondientes."}
        confirmButtonLabel="Confirmar"
        cancelButtonLabel="Cancel" />
      <Card sx={{ mt: 1, border: "1px solid lightgray", width: "100%" }}>
        <CardHeader title={<><FontAwesomeIcon icon={faEnvelope}/> Editar E-mail Info</>} sx={{ borderBottom: "1px solid lightgray" }} />
        <CardContent>
          <Stack spacing={2}>
              <Alert severity="info">Utilice <strong>%NOMBRE%</strong> para que el sistema reemplaze por el nombre correspondiente al momento de enviar el email.<br/> Solo se permiten caracteres alfanuméricos y simbolos {",.:()%$'"} </Alert>
              {dataList && dataValue && dataList?.map((data, index)=>{
                const inputRef = React.createRef();
                return(<React.Fragment key={"key-"+data.name}>
                <Typography sx={{p: 0, m: 0}}>{getLabel(data.name)}</Typography>
                <Box sx={{display: "flex", alignItems: "center", marginTop: "0!important"}}>
                  <TextareaAutosize
                    style={{width:"100%", m: 0}}
                    ref={inputRef}
                    label={data.name}
                    value={dataValue[index]}
                    maxLength={250}
                    onChange={(e)=>{
                      if(/^[0-9A-Za-zÁÉÍÓÚáéíóúñÑ,.:()%$' ]+$/g.test(e.target.value) || e.target.value===""){
                        setDataValue(dataValue.map((data, currentIndex)=>{
                          if(index===currentIndex){
                            return e.target.value;
                          }else{
                            return data;
                          }
                        }));
                      }
                    }}
                  />
                  <IconButton disabled={data.value===dataValue[index]||dataValue[index]===""} onClick={()=>{updateParam(data.name, dataValue[index])}}>
                    <Save />
                  </IconButton>
                  <IconButton disabled={data.value===dataValue[index]} onClick={(e)=>{setDataValue(dataValue.map((dataVal, currentIndex)=>{
                          if(index===currentIndex){
                            return data.value;
                          }else{
                            return dataVal;
                          }
                        }));}}>
                    <Undo />
                  </IconButton>
                </Box>
                <hr/>
                </React.Fragment>);
              })}
          </Stack>

          <Alert severity="info" sx={{ display: "flex", alignContent: "center", justifyContent: "center", m:1, p:1 }}>
            <Typography>Si desea enviar todos los emails nuevamente a sus destinatarios utilice esta función.</Typography>
            <Button sx={{ m:1 }} color="success" variant='contained' onClick={()=>setOpenDialog(true)} autoFocus>Enviar todos los emails</Button>
          </Alert>
        </CardContent>
      </Card>
    </Container>
  )
}
