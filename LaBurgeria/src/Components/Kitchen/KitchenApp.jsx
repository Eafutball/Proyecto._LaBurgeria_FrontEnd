import React, { useState, useEffect } from 'react';
import { Grid, Typography, Card, CardContent, Paper, Box } from '@mui/material';
import OrderQueue from './OrderQueue';
import StationSelector from './StationSelector';
import KitchenDashboard from './KitchenDashboard';
import CocinaServices from '../../services/CocinaServices';
import Pusher from 'pusher-js';

const KitchenApp = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [stationsStatus, setStationsStatus] = useState({});

  // Configurar Pusher
  useEffect(() => {
    const pusher = new Pusher('033f56d291bc76d4c2c0', {
      cluster: 'eu',
    });

    // Suscribirse al canal y escuchar los eventos
    const channel = pusher.subscribe('LaBurgeria');
    channel.bind('update-order', (data) => {
      console.log('Order updated via Pusher:', data);
      // Actualizar el estado con los nuevos datos del pedido
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
  }, []);

  // Cargar pedidos al montar el componente
  useEffect(() => {
    const fetchOrders = async () => {
      console.log('Fetching orders...');
      try {
        const response = await CocinaServices.getAllOrders();
        console.log('Orders fetched:', response);
        setOrders(response);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  // Manejo de la selección de un pedido
  const handleOrderClick = (order) => {
    console.log('Selected Order:', order);
    setSelectedOrder(order);
  };

  // Manejo de la selección de una estación
  const handleStationSelect = (station) => {
    console.log('Selected Station:', station);
    setSelectedStation(station);
  };

  return (
    <Box sx={{ padding: '2rem', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Panel de Cocina
      </Typography>
      <Grid container spacing={3}>
        {/* Kitchen Dashboard */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: '#ffffff', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                Dashboard
              </Typography>
              <KitchenDashboard
                totalOrders={orders.length}
                completedOrders={orders.filter(o => o.estado === 'Entregado').length}
                stationsStatus={stationsStatus}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Order Queue */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: '#ffffff', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                Cola de Pedidos
              </Typography>
              <OrderQueue orders={orders} onOrderClick={handleOrderClick} />
            </CardContent>
          </Card>
        </Grid>

        {/* Station Selector */}
        {selectedOrder && (
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#ffffff', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                  Selector de Estación
                </Typography>
                <StationSelector
                  onSelectStation={handleStationSelect}
                  setStationsStatus={setStationsStatus}
                  selectedOrder={selectedOrder}
                />
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default KitchenApp;
