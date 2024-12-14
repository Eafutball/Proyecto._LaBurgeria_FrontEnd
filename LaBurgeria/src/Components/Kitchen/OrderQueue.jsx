import PropTypes from 'prop-types';
import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, CircularProgress, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import ProductServices from '../../services/ProductServices';

const OrderQueue = ({ orders, onOrderClick }) => {
  const [productos, setProductos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const obtenerNombreProducto = async (productId) => {
    try {
      const response = await ProductServices.getFullProductInfo(productId);
      console.log(`Producto obtenido: ${response.Nombre} para el id ${productId}`);  // Log producto
      return response.Nombre;
    } catch (err) {
      console.error(`Error al obtener el producto con id ${productId}:`, err);
      return 'Producto no disponible';
    }
  };

  useEffect(() => {
    const fetchProductNames = async () => {
      setLoading(true);
      setError(null);
      console.log('Iniciando carga de nombres de productos...'); // Log antes de comenzar a cargar
      try {
        const productIds = [...new Set(orders.map(order => order.ProductoID))];
        console.log('IDs de productos:', productIds); // Log para verificar los IDs de productos únicos
        const productosData = await Promise.all(
          productIds.map(async (productId) => {
            const nombre = await obtenerNombreProducto(productId);
            return { productId, nombre };
          })
        );

        console.log('Datos de productos obtenidos:', productosData); // Log de los datos obtenidos
        const productosMap = productosData.reduce((acc, { productId, nombre }) => {
          acc[productId] = nombre;
          return acc;
        }, {});

        console.log('Mapa de productos:', productosMap); // Log del mapa de productos
        setProductos(productosMap);
      } catch (err) {
        console.error('Error al cargar los productos:', err);
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
        console.log('Carga de productos terminada');
      }
    };

    fetchProductNames();
  }, [orders]);

  const getOrderStatusColor = (status) => {
    console.log('Estado del pedido:', status); // Log del estado del pedido
    switch (status) {
      case 'En Preparación': return '#F5432';  // Naranja
      case 'Esperando': return '#FFA500';      // Naranja
      case 'Listo': return '#A7F3A7';          // Verde claro
      case 'Entregado': return '#4B4B4B';      // Gris oscuro
      default: return '#A6D0FF';                // Azul claro por defecto
    }
  };

  const handleOrderChange = (event) => {
    const orderId = event.target.value;
    console.log('Pedido seleccionado:', orderId);  // Log cuando un pedido es seleccionado
    onOrderClick(orderId);
  };

  const orderMenuItems = useMemo(() => {
    console.log('Generando items de menú para los pedidos...'); // Log cuando los items se generan
    return orders.map((order) => (
      <MenuItem
        key={order.id}
        value={order}
        sx={{
          backgroundColor: getOrderStatusColor(order.estado),
          marginBottom: '10px',
        }}
      >
        {`Pedido #${order.PedidoID} - ${productos[order.ProductoID] || 'Cargando nombre del producto...'}`}
      </MenuItem>
    ));
  }, [orders, productos]);

  return (
    <Box className="order-queue" p={2}>
      <Typography variant="h6" gutterBottom>Cola de Pedidos</Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <FormControl fullWidth>
          <InputLabel id="order-select-label">Seleccionar Pedido</InputLabel>
          <Select
            labelId="order-select-label"
            id="order-select"
            onChange={handleOrderChange}
            defaultValue=""
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              Selecciona un pedido
            </MenuItem>
            {orderMenuItems}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

OrderQueue.propTypes = {
  orders: PropTypes.array.isRequired,
  onOrderClick: PropTypes.func.isRequired,
};

export default OrderQueue;
