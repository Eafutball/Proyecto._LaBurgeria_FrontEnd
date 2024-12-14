import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Box, Drawer, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import HistoryIcon from "@mui/icons-material/History";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const menuOptions = [
  { text: "Inicio", icon: <HomeIcon />, link: "/" },
  { text: "Productos", icon: <FastfoodIcon />, link: "/productos" },
  { text: "Menú", icon: <RestaurantMenuIcon />, link: "/menu" },
  { text: "Combos", icon: <FastfoodIcon />, link: "/combos" },
  { text: "Historial de Pedidos", icon: <HistoryIcon />, link: "/pedido-history" },
  { text: "Procesos", icon: <HistoryIcon />, link: "/processes" },
  { text: "Crear Pedido", icon: <AddCircleOutlineIcon />, link: "/create-pedido" },
];

const MenuDrawer = ({ open, toggleDrawer }) => (
  <Drawer open={open} onClose={toggleDrawer} anchor="right">
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      {/* Título del Menú */}
      <Box sx={{ padding: 2, backgroundColor: "primary.main", color: "white" }}>
        <Typography variant="h6" component="div">
          Menú
        </Typography>
      </Box>

      <Divider />

      {/* Lista de Opciones */}
      <List>
        {menuOptions.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />
    </Box>
  </Drawer>
);

// Validación de props
MenuDrawer.propTypes = {
  open: PropTypes.bool.isRequired, // Prop 'open' debe ser booleana y obligatoria
  toggleDrawer: PropTypes.func.isRequired, // Prop 'toggleDrawer' debe ser una función y obligatoria
};

export default MenuDrawer;
