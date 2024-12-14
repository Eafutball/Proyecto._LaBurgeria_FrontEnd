import React, { useState } from 'react';
import InvoiceHeader from './InvoiceHeader';
import ProductSelector from './ProductSelector';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Drawer,
} from '@mui/material';
import InvoiceDetails from './InvoiceDetails';
import InvoiceTotals from './InvoiceTotals';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'; // Icono de carrito de compras
import BannerBackground from "../../assets/home-banner-background.png";
import { loadPedidoFromLocalStorage } from '../../constants/pedidoConstant';

const Invoice = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleOpen = () => setOpenDrawer(true);
  const handleClose = () => setOpenDrawer(false);
  const pedido = loadPedidoFromLocalStorage();
  console.log(pedido);

  // Validar si el pedido no existe
  if (pedido.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: '20vh' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff0000' }}>
          Pedido no encontrado
        </Typography>
        <Typography variant="body1" sx={{ marginTop: '16px', color: '#555' }}>
          No se encontró un pedido válido. Por favor, asegúrate de haber realizado un pedido.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ padding: '16px' }}>
      <img src={BannerBackground} alt="Banner" className="banner-image" />
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
        Factura de Pedido
      </Typography>

      {/* Encabezado de la factura */}
      <InvoiceHeader pedido={pedido} />

      {/* Detalles de la factura */}
      <Paper sx={{ padding: '16px', borderRadius: 2, boxShadow: 3, marginBottom: '16px' }}>
        <InvoiceDetails />
      </Paper>

      {/* Total de la factura */}
      <InvoiceTotals pedido={pedido} />

      {/* Botón flotante para abrir el selector de productos */}
      <Box sx={{ position: 'fixed', top: 16, left: 16 }}>
  <Button
    variant="contained"
    color="primary"
    onClick={handleOpen}
    sx={{
      borderRadius: '50%',
      minWidth: '56px',
      minHeight: '56px',
      padding: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1, // Asegura que el botón esté encima del contenido
    }}
  >
    <AddShoppingCartIcon sx={{ fontSize: 30 }} />
  </Button>
</Box>


      {/* Drawer para seleccionar productos, ahora anclado en la parte superior */}
      <Drawer anchor="top" open={openDrawer} onClose={handleClose}>
        <Box sx={{ width: '100%', padding: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: '16px', fontWeight: 'bold' }}>
            Seleccionar Productos y Combos
          </Typography>
          <ProductSelector />
          <Box sx={{ marginTop: '16px' }}>
            <Button onClick={handleClose} color="primary" variant="outlined" sx={{ fontWeight: 'bold' }}>
              Cerrar
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Container>
  );
};

export default Invoice;
