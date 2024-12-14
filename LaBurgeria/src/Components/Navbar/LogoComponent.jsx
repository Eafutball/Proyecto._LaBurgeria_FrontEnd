import React from "react";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import Logo from "../../assets/la-burguera-favicon-color.png";

const LogoComponent = () => (
  <Box
    component={Link}
    to="/"
    sx={{
      display: "flex",
      alignItems: "center",
      textDecoration: "none", // Para evitar subrayado en el enlace
    }}
  >
    <Box
      component="img"
      src={Logo}
      alt="Logo"
      sx={{
        height: 50,
        width: 50,
        objectFit: "contain", // Ajusta la imagen sin distorsión
      }}
    />
  </Box>
);

export default LogoComponent;
