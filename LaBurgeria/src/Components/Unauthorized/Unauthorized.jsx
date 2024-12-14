import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Paper, Stack } from '@mui/material';

const Unauthorized = () => {
  const navigate = useNavigate();

  // Función para manejar la navegación al inicio
  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh" 
      padding={3}
    >
      <Paper elevation={3} style={{ padding: '2rem', maxWidth: 500 }}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h4" color="error" gutterBottom>
            Acceso Denegado
          </Typography>
          <Typography variant="body1" align="center">
            No tienes permiso para acceder a esta página.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleGoBack}
          >
            Volver al Inicio
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Unauthorized;
