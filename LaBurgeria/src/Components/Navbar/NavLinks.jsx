import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Link } from "@mui/material";

const menuOptions = [
  { text: "Inicio", link: "/" },
  { text: "Productos", link: "/productos" },
  { text: "Menú", link: "/menu" },
  { text: "Combos", link: "/combos" },
  { text: "Historial de Pedidos", link: "/pedido-history" },
  { text: "Procesos", link: "/processes" },
  { text: "Crear Pedido", link: "/create-pedido" },
];

const NavLinks = () => (
  <Box sx={{ display: "flex", justifyContent: "center", flexGrow: 1 }}>
    {menuOptions.map((option) => (
      <Box key={option.text} sx={{ mx: 2 }}>
        <Link
          component={RouterLink} // Usamos RouterLink para navegación
          to={option.link}
          sx={{ 
            textDecoration: "none", 
            color: "#333", // Aquí puedes cambiar el color (Ejemplo: azul Material UI)
            "&:hover": {
              color: "#1565c0", // Cambiar el color al pasar el mouse (hover)
            }
          }} 
        >
          <Typography variant="body1">{option.text}</Typography>
        </Link>
      </Box>
    ))}
  </Box>
);

export default NavLinks;
