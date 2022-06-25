import { faJoint, faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Stack, Typography } from "@mui/material";
import React from "react";

export default function NotFoundPage() {
  return (
    <Stack sx={{ display: "flex", alignItems: "center" }}>
      <div className="fa-layers fa-fw fa-10x">
        <FontAwesomeIcon icon={faSquare} />
        <FontAwesomeIcon icon={faSquare} inverse transform="shrink-1" />
        <FontAwesomeIcon icon={faJoint}  transform="shrink-10"/>
      </div>
      <Typography variant="h4" sx={{textAlign: "center"}}>404 - Página no encontrada</Typography>
    </Stack>
  );
}