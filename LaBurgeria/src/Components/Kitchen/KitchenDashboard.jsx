import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import PropTypes from 'prop-types'; // Import PropTypes
import Pusher from 'pusher-js';

const KitchenDashboard = ({ totalOrders, completedOrders, inProgressOrders, setOrders }) => {

  // Usar useEffect para integrar Pusher
  useEffect(() => {
    const pusher = new Pusher('033f56d291bc76d4c2c0', {
      cluster: 'eu',
    });

    // Suscribirse al canal
    const channel = pusher.subscribe('LaBurgeria');
    
    // Escuchar el evento 'order-updated'
    channel.bind('update-order', (data) => {
      console.log('Order updated via Pusher:', data);
      // Actualizar el estado de las órdenes en el componente principal
      setOrders((prevOrders) => {
        return prevOrders.map((order) =>
          order.PedidoID === data.PedidoID ? { ...order, estado: data.estado } : order
        );
      });
    });

    // Cleanup al desmontar el componente
    return () => {
      pusher.unsubscribe('LaBurgeria');
    };
  }, [setOrders]); // Dependencia para que se ejecute al montar el componente

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Panel de Cocina</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1">Total de Pedidos: {totalOrders}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Pedidos Completados: {completedOrders}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Prop validation with PropTypes
KitchenDashboard.propTypes = {
  totalOrders: PropTypes.number.isRequired,
  completedOrders: PropTypes.number.isRequired,
  inProgressOrders: PropTypes.number.isRequired,
  setOrders: PropTypes.func.isRequired, // Necesitamos una función para actualizar las órdenes
};

export default KitchenDashboard;
