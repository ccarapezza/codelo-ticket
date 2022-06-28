import { faCannabis } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

export default function Loading({loadingMessage = "CARGANDO..."}) {
    return (
        <Box sx={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
            <FontAwesomeIcon icon={faCannabis} className="fa-4x fa-spin"/>
            <Typography variant="h6" component="div">{loadingMessage}</Typography>
        </Box>
    )
}
