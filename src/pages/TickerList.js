import React, { useContext, useState } from 'react'
import { ArrowDownward, ArrowUpward, ContentCut, DeleteForeverOutlined, DoorBackOutlined, Edit, Email, FilterAlt, MonetizationOn, MoreVert, QrCode, Search } from '@mui/icons-material';
import { Box, Card, CardContent, CardHeader, Chip, Collapse, FormControl, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText, Menu, MenuItem, OutlinedInput, Paper, Select, Stack, Switch, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from '@mui/material'
import { Container } from '@mui/system'
import axios from 'axios';
import Loading from "../components/Loading";
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCannabis, faJoint, faList, faStoreAlt, faTable, faTicket, faUser } from '@fortawesome/free-solid-svg-icons';
import { EnhancedTableHead } from '../components/EnhanceTable/EnhancedTableHead';
import { ConfirmDialog } from '../components/ConfirmDialog';
import Context from '../context/Context';
import { grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

export default function TicketList() {
  let navigate = useNavigate();

  const [ticketList, setTicketList] = useState([]);
  const [finalTicketList, setFinalTicketList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listMode, setListMode] = useState(true);

  const [filterShow, setFilterShow] = useState(false);

  const [filterTipo, setFilterTipo] = useState("");
  const [filterPago, setFilterPago] = useState("");
  const [filterIngreso, setFilterIngreso] = useState("");

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [filter, setFilter] = useState("");

  const context = useContext(Context);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = ticketList.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - ticketList.length) : 0;

  const entradasVendidas = ticketList.reduce((count, ticket) => {
    if(ticket.pago){
      count++
    }
    return count;
  }, 0);

  const entradasReservadas = ticketList.reduce((count, ticket) => {
    if(!ticket.pago){
      count++
    }
    return count;
  }, 0);

  const headCells = [
    {
      id: 'id',
      numeric: false,
      disablePadding: false,
      label: 'N°',
      sortable: true,
    },
    {
      id: 'nombre',
      numeric: false,
      disablePadding: false,
      label: 'Nombre',
      sortable: true,
    },
    {
      id: 'apellido',
      numeric: false,
      disablePadding: false,
      label: 'Apellido',
      sortable: true,
    },
    {
      id: 'dni',
      numeric: false,
      disablePadding: false,
      label: 'DNI',
      sortable: true,
    },
    {
      id: 'email',
      numeric: false,
      disablePadding: false,
      label: 'Email',
      sortable: true,
    },
    {
      id: 'tipo',
      numeric: false,
      disablePadding: false,
      label: 'Tipo',
      sortable: true,
      style: {textAlign: "center"}
    },
    {
      id: 'pago',
      numeric: false,
      disablePadding: false,
      label: 'Pago',
      sortable: true,
      style: {textAlign: "center"}
    },
    {
      id: 'ingresado',
      numeric: false,
      disablePadding: false,
      label: 'Ingresó?',
      sortable: true,
      style: {textAlign: "center"}
    },
    {
      id: 'observaciones',
      numeric: false,
      disablePadding: false,
      label: 'Observaciones',
    },
    {
      id: 'acciones',
      numeric: false,
      disablePadding: false,
      label: 'Acciones',
    },
  ];

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

  const confirmarDeleteTicket = () => {
    axios.delete("/api/ticket/delete",{
      data:{
        id: selectedTicket?.id
      }
    }).then(function (response) {     
      if(response.status === 200){
        context.showMessage("Se ha confirmado la eliminación del Ticket.", "success");
        listAllTickets();
      }else{
        context.showMessage("No se ha confirmado la eliminación del Ticket. Contacte con el administrador.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      context.showMessage("No se ha confirmado la eliminación del Ticket. Contacte con el administrador.", "error");
      console.error(error);
    })
  };
  
  const resendEmail = (ticketId) => {
    setLoading(true);
    axios.post("/api/ticket/resend-email",{
        id: ticketId
    })
    .then(function (response) {
      // handle success
      if(response.status === 200){
        context.showMessage("Se ha enviado el Ticket.", "success");
      }else{
        context.showMessage("No se ha enviado el Ticket.", "error");
      }
    })
    .catch(function (error) {
      // handle error
      context.showMessage("No se ha enviado el Ticket.", "error");
      console.log(error);
    })
    .then(function () {
      setLoading(false);
    })
  };

  const confirmarPagoTicket = () => {
    axios.put("/api/ticket/update-pago",{
      id: selectedTicket?.id
    }).then(function (response) {     
      if(response.status === 200){
        context.showMessage("Se ha confirmado el pago del Ticket.", "success");
        listAllTickets();
      }else{
        context.showMessage("No se ha confirmado el pago del Ticket. Contacte con el administrador.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      context.showMessage("No se ha confirmado el pago del Ticket. Contacte con el administrador.", "error");
      console.error(error);
    })
  };

  const confirmarCorteTicket = () => {
    axios.put("/api/ticket/cut-ticket-by-hash",{
      hash: selectedTicket?.hash
    }).then(function (response) {     
      if(response.status === 200){
        context.showMessage("Se ha confirmado el pago del Ticket.", "success");
        listAllTickets();
      }else{
        context.showMessage("No se ha confirmado el pago del Ticket. Contacte con el administrador.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      context.showMessage("No se ha confirmado el pago del Ticket. Contacte con el administrador.", "error");
      console.error(error);
    })
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  useEffect(() => {
    listAllTickets();
  }, [])

  useEffect(() => {
    if(filter||filterTipo||filterPago||filterIngreso){
      setFinalTicketList(
        ticketList.filter(ticket => {
          if(filter){
            return ticket?.id?.toString().toLowerCase().includes(filter?.toLowerCase()) ||
              ticket?.nombre?.toString().toLowerCase().includes(filter?.toLowerCase()) ||
              ticket?.apellido?.toString().toLowerCase().includes(filter?.toLowerCase()) ||
              ticket?.dni?.toString().toLowerCase().includes(filter?.toLowerCase()) ||
              ticket?.email?.toString().toLowerCase().includes(filter?.toLowerCase()) ||
              ticket?.observaciones?.toString().toLowerCase().includes(filter?.toLowerCase());
          }else{
            return true;
          }
        }).filter(ticket => {
          return (filterTipo!==""?(filterTipo===ticket?.tipo):true);
        }).filter(ticket => {
          return (filterPago!==""?((filterPago === 'true')===ticket?.pago):true);
        }).filter(ticket => {
          return (filterIngreso!==""?((filterIngreso === 'true')===ticket?.ingresado):true);
        })
      );
    }else{
      setFinalTicketList(ticketList);
    }
  }, [filter, filterTipo, filterPago, filterIngreso, ticketList])

  const [anchorEl, setAnchorEl] = useState(false);
  const open = Boolean(anchorEl);

  const [confirmCutTicketOpen, setConfirmCutTicketOpen] = useState(null);
  const [confirmPagoTicketOpen, setConfirmPagoTicketOpen] = useState(null);
  const [confirmDeleteTicketOpen, setConfirmDeleteTicketOpen] = useState(null);
  const [resendEmailTicketOpen, setResendEmailTicketOpen] = useState(null);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const handleClickAnchor = (event, selectedRow) => {
    setAnchorEl(event.currentTarget);
    setSelectedTicket(selectedRow);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
      {loading?
        <Loading/>
      :
        <Card sx={{ mt: 1, border: "1px solid lightgray", width: "100%" }}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography sx={{p:0}}>Tickets</Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start" }}>
                  <FontAwesomeIcon color={listMode?grey[400]:'black'} icon={faTable} transform="shrink-6"/>
                  <Switch
                    size='small'
                    checked={listMode}
                    onChange={()=>setListMode(!listMode)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                  <FontAwesomeIcon color={!listMode?grey[400]:'black'} icon={faList} transform="shrink-6"/>
                </Box>
              </Box>
            }
            sx={{ borderBottom: "1px solid lightgray", py:1 }} />
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <OutlinedInput
                id="filter-tickets"
                type="text"
                size="small"
                value={filter}
                onChange={(e)=>{setFilter(e.target.value)}}
                placeholder="Buscar..."
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <Search/>{/*ICON*/}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <IconButton edge="end" onClick={()=>{setFilterShow(!filterShow)}}>
                <FilterAlt/>{/*ICON*/}
              </IconButton>
            </Box>
            <Collapse in={filterShow}>
              <hr/>
              <FormControl fullWidth size="small" sx={{mt:1}}>
                <InputLabel id="filter-tipo-label">Tipo</InputLabel>
                <Select
                  labelId="filter-tipo-label"
                  id="filter-tipo"
                  value={filterTipo}
                  label="Tipo"
                  onChange={(e)=>{setFilterTipo(e.target.value)}}
                >
                  <MenuItem value={""}>Todos</MenuItem>
                  <MenuItem value={"PARTICIPANTE"}>PARTICIPANTE</MenuItem>
                  <MenuItem value={"INVITADO"}>INVITADO</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" sx={{mt:1}}>
                <InputLabel id="filter-pago-label">Pago</InputLabel>
                <Select
                  labelId="filter-pago-label"
                  id="filter-pago"
                  value={filterPago}
                  label="Pago"
                  onChange={(e)=>{setFilterPago(e.target.value)}}
                >
                  <MenuItem value={""}>Todos</MenuItem>
                  <MenuItem value={"true"}>Pago</MenuItem>
                  <MenuItem value={"false"}>No Pago</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" sx={{mt:1}}>
                <InputLabel id="filter-ingresado-label">Ingresó</InputLabel>
                <Select
                  labelId="filter-ingresado-label"
                  id="filter-ingresado"
                  value={filterIngreso}
                  label="Ingresó"
                  onChange={(e)=>{setFilterIngreso(e.target.value)}}
                >
                  <MenuItem value={""}>Todos</MenuItem>
                  <MenuItem value={"true"}>Ingresó</MenuItem>
                  <MenuItem value={"false"}>No Ingresó</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{display: "flex", flexDirection: "row"}}>
                <FormControl fullWidth size="small" sx={{mt:1}}>
                  <InputLabel id="filter-sort-label">Ordenar</InputLabel>
                  <Select
                    labelId="filter-sort-label"
                    id="filter-sort"
                    value={orderBy}
                    label="Ordenar"
                    onChange={(e)=>{setOrderBy(e.target.value)}}
                  >
                    <MenuItem value={""}>-</MenuItem>
                    <MenuItem value={"id"}>Id</MenuItem>
                    <MenuItem value={"nombre"}>Nombre</MenuItem>
                    <MenuItem value={"apellido"}>Apellido</MenuItem>
                    <MenuItem value={"dni"}>Dni</MenuItem>
                    <MenuItem value={"tipo"}>Tipo</MenuItem>
                    <MenuItem value={"pago"}>Pago</MenuItem>
                    <MenuItem value={"ingresado"}>Ingresado</MenuItem>
                    <MenuItem value={"observaciones"}>Observaciones</MenuItem>
                  </Select>
                </FormControl>
                <IconButton edge="end" onClick={()=>{setOrder(order==="asc"?"desc":"asc")}} sx={{mx: 1}}>
                  {order==="asc"?
                    <><ArrowUpward/>{/*ICON*/}</>
                  :
                    <><ArrowDownward/>{/*ICON*/}</>
                  }
                </IconButton>
              </Box>
              <hr/>
            </Collapse>
            

            <Menu
              id={"basic-menu"}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {!selectedTicket?.pago&&
                <MenuItem onClick={()=>{handleClose(); setConfirmPagoTicketOpen(true);}}><ListItemIcon><MonetizationOn/></ListItemIcon>Pagar Ticket</MenuItem>
              }
              {selectedTicket?.pago&&!selectedTicket?.ingresado&&
                <MenuItem onClick={()=>{handleClose(); setConfirmCutTicketOpen(true);}}><ListItemIcon><ContentCut/></ListItemIcon>Cortar Ticket</MenuItem>
              }
              {selectedTicket?.pago&&
              <>
                <MenuItem onClick={()=>{handleClose(); setResendEmailTicketOpen(true);}}><ListItemIcon><Email/></ListItemIcon>Reenviar Email</MenuItem>
                <MenuItem onClick={()=>{handleClose(); navigate("/ticket-viewer/"+selectedTicket?.hash);}}><ListItemIcon><QrCode/></ListItemIcon>Ver QR</MenuItem>
              </>
              }
              <MenuItem onClick={()=>{handleClose(); navigate("/edit-ticket/"+selectedTicket?.id);}}><ListItemIcon><Edit/></ListItemIcon>Editar</MenuItem>
              <MenuItem color="error" onClick={()=>{handleClose(); setConfirmDeleteTicketOpen(true);}}><ListItemIcon><DeleteForeverOutlined/></ListItemIcon>Eliminar</MenuItem>
            </Menu>

            <ConfirmDialog open={confirmCutTicketOpen}
              setOpen={setConfirmCutTicketOpen}
              actionConfirm={confirmarCorteTicket}
              message={"Se procederá a cortar el Ticket N° "+selectedTicket?.id+"."}
              confirmButtonLabel="Confirmar"
              cancelButtonLabel="Cancel" />

            <ConfirmDialog open={confirmPagoTicketOpen}
              setOpen={setConfirmPagoTicketOpen}
              actionConfirm={confirmarPagoTicket}
              message={"Se procederá a confirmar el pago del Ticket N° "+selectedTicket?.id+"."}
              confirmButtonLabel="Confirmar"
              cancelButtonLabel="Cancel" />

            <ConfirmDialog open={confirmDeleteTicketOpen}
              setOpen={setConfirmDeleteTicketOpen}
              actionConfirm={confirmarDeleteTicket}
              message={"Se procederá a eliminar el Ticket N° "+selectedTicket?.id+"."}/>

            <ConfirmDialog open={resendEmailTicketOpen}
              setOpen={setResendEmailTicketOpen}
              actionConfirm={()=>{resendEmail(selectedTicket?.id)}}
              message={"Se procederá a enviar el email del Ticket N° "+selectedTicket?.id+"."}
              confirmButtonLabel="Confirmar"
              cancelButtonLabel="Cancel" />

              {listMode?
                <List sx={{ width: '100%' }}>
                  {finalTicketList.slice().sort(getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <ListItem key={"item-participante-"+row.id} sx={{pl: 0}}>
                          <ListItemAvatar sx={{display:"flex", flexDirection: "column", justifyItems: "center", pr:1}}>
                            {row.tipo==="PARTICIPANTE"&&
                              <span className="fa-layers fa-fw fa-3x" title="Participante">
                                <FontAwesomeIcon style={{color: "#0288d1"}} icon={faUser} transform="shrink-4 left-2"/>
                                <FontAwesomeIcon icon={faCannabis} transform="shrink-8 down-4 right-4"/>
                              </span>
                            }
                            {row.tipo==="INVITADO"&&
                              <span className="fa-layers fa-fw fa-3x" title="Invitado">
                                <FontAwesomeIcon style={{color: "#ff5722"}} icon={faUser} transform="shrink-4 left-2"/>
                                <FontAwesomeIcon icon={faJoint} transform="shrink-10 down-2 right-4"/>
                              </span>
                            }
                            {row.tipo==="SPONSOR"&&
                              <span className="fa-layers fa-fw fa-3x" title="Sponsor">
                                <FontAwesomeIcon style={{color: "#11ac39"}} icon={faUser} transform="shrink-4 left-2"/>
                                <FontAwesomeIcon icon={faCannabis} transform="shrink-10 up-1 right-4"/>
                                <FontAwesomeIcon icon={faStoreAlt} transform="shrink-10 down-5 right-4"/>
                              </span>
                            }
                            <Box sx={{textAlign:"center"}}><FontAwesomeIcon icon={faTicket} transform="shrink-2 down-1"/><small> #{row.id}</small></Box>
                          </ListItemAvatar>
                          <ListItemText
                            primary={<strong>{row.nombre+" "+row.apellido}</strong>}
                            secondaryTypographyProps={{variant: "div"}}
                            secondary={
                              <Stack>
                                <small><strong>{row.tipo}</strong></small>
                                <small><strong>DNI:</strong> {row.dni}</small>
                                <small><strong>Email:</strong> {row.email}</small>
                                <Box>
                                  <small style={{marginRight: "5px"}}>{row.pago?<Chip icon={<MonetizationOn/>} size='small' color="success" label="PAGO" />:<Chip icon={<MonetizationOn/>} size='small' color="error" label="NO PAGO" />}</small>
                                  <small>{row.ingresado?<Chip icon={<DoorBackOutlined sx={{pl:"4px"}}/>} size='small' color="success" label="INGRESÓ" />:<Chip icon={<DoorBackOutlined sx={{pl:"4px"}}/>} size='small' variant='outlined' label="NO INGRESÓ" />}</small>
                                </Box>
                              </Stack>
                            }
                            />
                          <ListItemSecondaryAction>
                            <IconButton
                              aria-controls={open ? 'basic-menu' : undefined}
                              aria-haspopup="true"
                              aria-expanded={open ? 'true' : undefined}
                              onClick={(e)=>{handleClickAnchor(e, row)}}
                              sx={{pr: 0}}>
                              <MoreVert/>
                            </IconButton>
                          </ListItemSecondaryAction>
                          
                        </ListItem>
                      )
                    })
                  }
                </List>

              :
                <TableContainer component={Paper}>

                  {finalTicketList?.length>0?
                    <Table sx={{ minWidth: 750 }} size={dense ? 'small' : 'medium'} aria-label="a dense table">
                      <EnhancedTableHead
                        headCells={headCells}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={finalTicketList.length}
                      />

                      <TableBody>
                        {finalTicketList.slice().sort(getComparator(order, orderBy))
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) => {
                            const isItemSelected = isSelected(row.id);

                            return (
                              <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: row.isBroke?'pink':'' }}
                                hover
                                onClick={(event) => handleClick(event, row.name)}
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                selected={isItemSelected}
                              >
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.nombre}</TableCell>
                                <TableCell>{row.apellido}</TableCell>
                                <TableCell>{row.dni}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell style={{textAlign: "center"}}>
                                  {row.tipo==="PARTICIPANTE"&&
                                    <Box sx={{ display: "flex", alignContent: "center", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
                                      <span className="fa-layers fa-fw fa-3x" title="Participante" style={{alignSelf: "center"}}>
                                        <FontAwesomeIcon style={{color: "#0288d1"}} icon={faUser} transform="shrink-4 left-2"/>
                                        <FontAwesomeIcon icon={faCannabis} transform="shrink-8 down-4 right-4"/>
                                      </span>
                                      <small>PARTICIPANTE</small>
                                    </Box>
                                  }
                                  {row.tipo==="INVITADO"&&
                                    <Box sx={{ display: "flex", alignContent: "center", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
                                      <span className="fa-layers fa-fw fa-3x" title="Invitado" style={{alignSelf: "center"}}>
                                        <FontAwesomeIcon style={{color: "#ff5722"}} icon={faUser} transform="shrink-4 left-2"/>
                                        <FontAwesomeIcon icon={faJoint} transform="shrink-10 down-2 right-4"/>
                                      </span>
                                      <small>INVITADO</small>
                                    </Box>
                                  }
                                  {row.tipo==="SPONSOR"&&
                                    <Box sx={{ display: "flex", alignContent: "center", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
                                      <span className="fa-layers fa-fw fa-3x" title="Sponsor"  style={{alignSelf: "center"}}>
                                        <FontAwesomeIcon style={{color: "#11ac39"}} icon={faUser} transform="shrink-4 left-2"/>
                                        <FontAwesomeIcon icon={faCannabis} transform="shrink-10 up-1 right-4"/>
                                        <FontAwesomeIcon icon={faStoreAlt} transform="shrink-10 down-5 right-4"/>
                                      </span>
                                      <small>SPONSOR</small>
                                    </Box>
                                  }
                                </TableCell>
                                <TableCell style={{textAlign: "center"}}>{row.pago?<Chip icon={<MonetizationOn/>} size='small' color="success" label="PAGO" />:<Chip icon={<MonetizationOn/>} size='small' color="error" label="NO PAGO" />}</TableCell>
                                <TableCell style={{textAlign: "center"}}>{row.ingresado?<Chip icon={<DoorBackOutlined sx={{pl:"4px"}}/>} size='small' color="success" label="INGRESÓ" />:<Chip icon={<DoorBackOutlined sx={{pl:"4px"}}/>} size='small' variant='outlined' label="NO INGRESÓ" />}</TableCell>
                                <TableCell>{row.observaciones}</TableCell>
                                <TableCell>
                                  <IconButton
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={(e)=>{handleClickAnchor(e, row)}}>
                                    <MoreVert/>
                                  </IconButton>
                                </TableCell>
                                
                              </TableRow>
                            )
                          })
                        }
                        {emptyRows > 0 && (
                          <TableRow
                            style={{
                              height: (dense ? 33 : 53) * emptyRows,
                            }}
                          >
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  :
                    <Typography variant="h6" sx={{textAlign: "center"}}><FontAwesomeIcon icon={faJoint} style={{marginRight:"15px", marginBottom:"3px"}}/>No hay tickets...</Typography>
                  }
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={ticketList.length}
                    rowsPerPage={rowsPerPage}
                    labelRowsPerPage="Filas"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableContainer>
              }

            <hr/>
            <Stack direction={"column"}>
              <Chip size="small" variant='outlined' color="success" sx={{ m: 1 }} label={<b>Entradas vendidas: {entradasVendidas}</b>}/>
              <Chip size="small" variant='outlined' color="error" sx={{ m: 1 }} label={<b>Entradas reservadas: {entradasReservadas}</b>}/>
              <Chip size="small" variant='outlined' sx={{ m: 1 }} label={<b>Entradas totales: {ticketList.length}</b>}/>
            </Stack>
          </CardContent>
        </Card>
      }
    </Container>
  )
}
