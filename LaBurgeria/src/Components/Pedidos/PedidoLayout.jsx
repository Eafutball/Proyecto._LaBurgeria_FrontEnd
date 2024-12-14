import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import PedidoList from './PedidoList'; // Asegúrate de que este componente esté importado correctamente
import BannerBackground from '../../assets/home-banner-background.png';

const PedidoLayout = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
 <img src={BannerBackground} alt="Banner" className="banner-image" />
      {/* Sidebar */}
      <Box sx={{
        width: '250px',
        backgroundColor: '#2E3B55',
        color: 'white',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h6" color="inherit" gutterBottom>
          La Burgería
        </Typography>
        <Typography variant="body2" color="inherit" sx={{ marginBottom: '20px' }}>
          Panel de Administración
        </Typography>
        {/* Aquí puedes agregar más elementos como navegación del sidebar */}
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, padding: '20px' }}>
        <Paper sx={{ padding: '20px', borderRadius: '8px' }}>
          <Typography variant="h4" gutterBottom>
            Gestión de Pedidos
          </Typography>

          <PedidoList />
        </Paper>
      </Box>
    </Box>
  );
};

export default PedidoLayout;
