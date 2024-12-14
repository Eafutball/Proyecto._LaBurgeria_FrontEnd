import React, { useState } from "react";
import { IconButton, AppBar, Toolbar, Box, useMediaQuery, Fade} from "@mui/material";
import { HiOutlineBars3 } from "react-icons/hi2";

// Componentes Importados
import LogoComponent from "./LogoComponent";
import NavLinks from "./NavLinks";
import CartIconWrapper from "./CartIconWrapper";
import RegisterButton from "./RegisterButton";
import MenuDrawer from "./MenuDrawer";

const NavbarLayout = () => {
  // Estado para controlar la apertura/cierre del menú
  const [openMenu, setOpenMenu] = useState(false);

  // Verificar si la pantalla es pequeña
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Función para alternar el estado del menú
  const toggleDrawer = () => setOpenMenu((prevState) => !prevState);

  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: "none",
        backgroundColor: "transparent",
        zIndex: (theme) => theme.zIndex.drawer + 1, // Asegura que la barra de navegación esté por encima de otros elementos
      }}
    >
      {/* Fila superior con el botón de registro en el centro */}
      <Toolbar sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "8px 0" }}>
        {/* Agregar el botón de registro aquí */}
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <RegisterButton />
        </Box>
      </Toolbar>

      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo */}
        <LogoComponent />

        {/* Enlaces de navegación (solo en pantallas grandes) */}
        {!isMobile && <NavLinks />}

        {/* Carrito y Menú */}
        <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
          <CartIconWrapper sx={{ marginRight: 2 }} />

          {/* Icono de Menú (solo en pantallas pequeñas) */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={toggleDrawer}
              aria-label="Abrir menú"
              sx={{
                transition: "transform 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HiOutlineBars3 size={24} />
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* Transición del Drawer (Aparece y desaparece suavemente) */}
      <Fade in={openMenu} timeout={300}>
        <div>
          <MenuDrawer open={openMenu} toggleDrawer={toggleDrawer} />
        </div>
      </Fade>
    </AppBar>
  );
};

export default NavbarLayout;
