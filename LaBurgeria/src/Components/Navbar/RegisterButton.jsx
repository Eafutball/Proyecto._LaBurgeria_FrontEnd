import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { MenuItem, Typography, Button, CircularProgress, Menu, Fab, Avatar, Tooltip } from "@mui/material"; 
import { useUser } from "../../Hooks/useUser"; // Importa el hook useUser
import { LockOpen, ShowChart, PersonAdd, PowerSettingsNew, AccountCircle } from '@mui/icons-material'; // Nuevos iconos

const RegisterButton = () => {
  const { user, decodeToken,authorize } = useUser(); // Usamos el hook useUser
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [anchorEl, setAnchorEl] = useState(null); // Para manejar la apertura del menú
  const [open, setOpen] = useState(false); // Para controlar la visibilidad del menú

  useEffect(() => {
    if (user) {
      const decoded = decodeToken();
      setUserData(decoded);
    }
    setLoading(false);
  }, [user, decodeToken]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); 
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Crear las opciones del menú según el rol
  const generateMenuItems = useCallback((role) => {
    const baseItems = [
      { name: "Logout", icon: <PowerSettingsNew />, link: "/logout", login: true, },
    ];

    const adminItems = [
      { name: "Dashboard", link: "/dashboard", icon: <ShowChart />, login: true, requieredRoles: ["Administrador"] },
      { name: "Registrar Usuario", link: "/register-user", icon: <PersonAdd />, login: true, requieredRoles: ["Administrador"] },
    ];

    const kitchenItems = [
      { name: "Dashboard", link: "/kitchen/dashboard", icon: <ShowChart />, login: true, requieredRoles: ["Cocina"] },
    ];

    // Determinamos qué opciones mostrar según el rol
    switch (role) {
      case 'Administrador':
        return [...baseItems, ...adminItems];
      case 'Cocina':
        return [...baseItems, ...kitchenItems];
      default:
        return baseItems;
    }
  }, []);

  const itemsToDisplay = useMemo(() => {
    if (loading) return [];
    if (userData) {
      const allItems = generateMenuItems(userData.rol);
      // Filtra las opciones del menú según el rol del usuario usando el método authorize
      return allItems.filter(item => !item.requieredRoles || authorize({ requiredRoles: item.requieredRoles }));
    } else {
      return [
        { name: "Login", link: "/login", icon: <LockOpen />, login: false },
      ];
    }
  }, [loading, userData, generateMenuItems, authorize]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: 2 }}>Cargando...</Typography>
      </div>
    );
  }

  return (
    <div>
      {/* Botón flotante con Tooltip */}
      <Tooltip title="Menú de opciones" arrow>
        <Fab color="primary" onClick={handleClick} sx={{ position: 'fixed', bottom: 20, right: 20 }}>
          <AccountCircle />
        </Fab>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ borderRadius: 2 }}
      >
        {/* Si el usuario está autenticado, mostramos su avatar y nombre */}
        {userData && (
          <MenuItem disabled>
            <Avatar sx={{ marginRight: 1 }} />
            <Typography variant="body1">{userData.rol || 'Usuario'}</Typography>
          </MenuItem>
        )}

        {itemsToDisplay.map((item, index) => (
          <MenuItem 
            key={index} 
            onClick={item.link ? handleClose : undefined} 
            sx={{ 
              '&:hover': {
                backgroundColor: '#f5f5f5', 
                cursor: 'pointer', 
              }, 
              fontSize: 16 
            }}
          >
            <Button 
              variant="text"
              component={item.link ? Link : 'button'}
              to={item.link || '#'}
              startIcon={item.icon}
              sx={{
                textAlign: 'left', 
                padding: 1, 
                width: '100%', 
                justifyContent: 'flex-start', 
              }}
            >
              <Typography variant="body2">{item.name}</Typography>
            </Button>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default RegisterButton;
