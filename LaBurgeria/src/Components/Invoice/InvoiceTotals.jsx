import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Alert, Divider, Grid } from '@mui/material';
import { useCart } from '../../Hooks/useCart';
import DeliveryMethodSelector from './DeliveryMethodSelector';
import PedidoServices from '../../services/PedidoServices';
import { Link } from 'react-router-dom';
import { savePedidoToLocalStorage } from '../../constants/pedidoConstant';
import UserServices from '../../services/UserServices';

const InvoiceTotals = ({ pedido}) => {
  const { calculateTotalSubtotal, cart, clearCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState('Domicilio');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [clienteInfo, setClienteInfo] = useState(null);

  // Cálculos
  const subtotal = calculateTotalSubtotal();
  const impuesto = useMemo(() => subtotal * (pedido?.Impuesto || 0.13), [subtotal, pedido?.Impuesto]);
  const costoEnvio = useMemo(() => (deliveryMethod === 'Domicilio' ? pedido?.CostoEnvio || 0 : 0), [deliveryMethod, pedido?.CostoEnvio]);

  const totalConImpuesto = useMemo(() => subtotal + impuesto + costoEnvio, [subtotal, impuesto, costoEnvio]);

  useEffect(() => {
    const fetchClienteInfo = async () => {
      try {
        console.log("Fetching cliente info for PersonalID:", pedido.PersonalID); // Log para verificar el ID del cliente
        const clienteData = await UserServices.getFullUserInfo(pedido.PersonalID);
        setClienteInfo(clienteData);
      } catch (error) {
        console.log("Error fetching cliente info:", error); // Log para verificar el error
        setMessageType('error');
        setMessage('Error al cargar la información del cliente.');
      }
    };
  
    if (pedido?.PersonalID) { 
      fetchClienteInfo();
    }
  }, [pedido]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const validatePedido = () => {
    if (!pedido?.PedidoID) return 'El pedido no tiene un ID válido.';
    if (!subtotal) return 'El carrito está vacío.';
    return null;
  };

  const handleRegisterOrder = async () => {
    if (!clienteInfo) {
      setMessageType('error');
      setMessage('Información del cliente no disponible.');
      return;
    }

    const error = validatePedido();
    if (error) {
      setMessageType('error');
      setMessage(error);
      return;
    }

    const updatedPedido = {
      PedidoID: pedido.PedidoID,
      subtotal,
      Total: totalConImpuesto,
      CostoEnvio: costoEnvio,
      PersonalID: pedido.PersonalID,
      Estado: 'Pendiente',
      MetodoDeEntrega: deliveryMethod,
      MetodoDePago: 'Tarjeta',
      encargado_asociado: pedido.encargado_asociado,
    };

    try {
      console.log("Updating pedido with data:", updatedPedido); // Log para verificar los datos del pedido
      const response = await PedidoServices.updatePedido(updatedPedido);
      if (response?.success) {
        console.log("Pedido registered successfully:", response); // Log de éxito
        await handleCartItems(response.pedido.PedidoID);
        setMessageType('success');
        setMessage('Pedido registrado exitosamente.');
        savePedidoToLocalStorage(response.pedido);
        clearCart();
      } else {
        throw new Error(response?.Mensaje || 'Error desconocido al registrar el pedido.');
      }
    } catch (error) {
      console.log("Error during registerPedido:", error); // Log para verificar el error
      setMessageType('error');
      setMessage(`Error al registrar el pedido: ${error.message}`);
    }
  };

  const handleCartItems = async (pedidoID) => {
    try {
      console.log("Processing cart items for PedidoID:", pedidoID); // Log para verificar los ítems del carrito
      await Promise.all(
        cart.map((item) => {
          const data = item.ProductoID
            ? {
                PedidoID: pedidoID,
                ProductoID: item.ProductoID,
                cantidad: item.cantidad,
                observaciones: item.observaciones || 'Sin Observaciones',
              }
            : {
                combos_ComboID: item.ComboID,
                pedidos_PedidoID: pedidoID,
                cantidad: item.cantidad,
                observaciones: item.observaciones || 'Sin Observaciones',
              };

          const serviceMethod = item.ProductoID ? PedidoServices.insertProducts : PedidoServices.insertCombos;

          return serviceMethod(data);
        })
      );
    } catch (error) {
      console.log("Error processing cart items:", error); // Log para verificar los errores al procesar el carrito
    }
  };

  return (
    <Box sx={{ mt: 2, p: 3, border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        Totales del Pedido
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Selector de método de entrega */}
      <DeliveryMethodSelector onChange={setDeliveryMethod} deliveryMethod={deliveryMethod} />

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <Typography><strong>Subtotal:</strong></Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Typography>${subtotal.toFixed(2)}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography><strong>Impuesto:</strong></Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Typography>${impuesto.toFixed(2)}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography><strong>Costo de Envío:</strong></Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Typography>${costoEnvio.toFixed(2)}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ mt: 2, mb: 2 }} />
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h6"><strong>Total:</strong></Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Typography variant="h6">${totalConImpuesto.toFixed(2)}</Typography>
        </Grid>
      </Grid>

      {/* Botones de acción */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleRegisterOrder} fullWidth>
          Registrar Pedido
        </Button>
        <Link to="/payment" style={{ textDecoration: 'none', marginLeft: '8px' }}>
          <Button variant="outlined" color="secondary" fullWidth>
            Ir al Pago
          </Button>
        </Link>
      </Box>

      {/* Mostrar mensajes */}
      {message && <Alert severity={messageType} sx={{ mt: 2 }}>{message}</Alert>}
    </Box>
  );
};

InvoiceTotals.propTypes = {
  pedido: PropTypes.shape({
    PedidoID: PropTypes.number.isRequired,
    PersonalID: PropTypes.number.isRequired,
    Impuesto: PropTypes.number,
    CostoEnvio: PropTypes.number,
    encargado_asociado: PropTypes.string,
  }).isRequired,
};

export default InvoiceTotals;
