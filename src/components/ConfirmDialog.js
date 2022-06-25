import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export function ConfirmDialog(props) {
    const { title, message, confirmButtonLabel="SI", cancelButtonLabel="NO", open = false, setOpen, actionConfirm } = props;

    const handleAction = () => {
        actionConfirm();
        setOpen(false);
    };
    
    return (
        <Dialog onClose={()=>{setOpen(false)}} open={open?true:false}>
            <DialogTitle>{title?title:"Confirmación"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {message?message:"Está seguro que desea continuar?"}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{display: "flex", justifyContent: "space-between"}}>
                <Button color="error" variant='outlined' onClick={()=>{setOpen(false)}}>{cancelButtonLabel}</Button>
                <Button color="success" variant='outlined' onClick={handleAction} autoFocus>{confirmButtonLabel}</Button>
            </DialogActions>
        </Dialog>
    );
}