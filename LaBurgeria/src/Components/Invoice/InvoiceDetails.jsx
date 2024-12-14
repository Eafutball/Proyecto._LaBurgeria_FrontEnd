import React from 'react';
import { useCart } from '../../Hooks/useCart';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography,
  TextField, IconButton, Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import QuantityControl from './QuantityControl'; // Este componente debe manejar las cantidades individualmente

const InvoiceDetails = () => {
  const { cart, addToCart, removeFromCart, clearCart, decrementItemQuantity, updateObservation } = useCart();

  // Función para incrementar la cantidad de un producto específico
  const handleIncrement = (item) => {
    console.log('Incrementando producto:', item); // Agregar log para ver qué producto se está incrementando
    if (item.ComboID) {
      addToCart(item, true); // Incrementa la cantidad de ese combo y marca como isCombo true
      return;
    } else {
      addToCart(item);
    }
  };

  // Función para decrementar la cantidad de un producto específico
  const handleDecrement = (item) => {
    console.log('Decrementando producto:', item); // Agregar log para ver qué producto se está decrementando
    if (item.cantidad > 1) {
      console.log('Cantidad antes de decrementar:', item.cantidad); // Ver la cantidad antes de decrementar
      decrementItemQuantity(item); // Decrementa solo el item que se pasó
      console.log('Cantidad después de decrementar:', item.cantidad); // Ver la cantidad después de decrementar
    } else {
      console.log('No se puede decrementar, cantidad es 1 o menor'); // Si no puede decrementar
    }
  };

  // Función para borrar todo el carrito
  const handleClearCart = () => {
    console.log('Borrando todo el carrito');
    clearCart();
  };

  // Función para manejar el cambio de observación
  const handleObservationChange = (item, value) => {
    console.log('Observación cambiada:', item, value); // Log para ver el cambio de observación
    updateObservation(cart.indexOf(item), value);
  };

  // Función para eliminar un producto individualmente
  const handleRemoveProduct = (item) => {
    console.log('Eliminando producto:', item); // Ver qué producto se está eliminando
    removeFromCart(item); // Elimina el producto del carrito
  };

  return (
    <div className="invoice-details">
      <Typography variant="h6" gutterBottom>Detalles del Pedido</Typography>
      {cart.length === 0 ? (
        <Typography variant="body1">No hay productos en el carrito.</Typography>
      ) : (
        <>
          <Button variant="contained" color="error" onClick={handleClearCart} style={{ marginBottom: '1rem' }}>
            Borrar Todo
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto/Combo</TableCell>
                  <TableCell align="right">Precio</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell>Observaciones</TableCell>
                  <TableCell align="center">Eliminar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item.ProductoID || item.ComboID}>
                    <TableCell>{item.Nombre}</TableCell>
                    <TableCell align="right">
                      {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.Precio)}
                    </TableCell>
                    <TableCell align="right">
                      <QuantityControl
                        item={item}
                        onIncrement={() => handleIncrement(item)} // Incrementa cantidad
                        onDecrement={() => handleDecrement(item)} // Decrementa cantidad
                      />
                    </TableCell>
                    <TableCell align="right">
                      {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
                        item.Precio * item.cantidad
                      )}
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={item.observaciones || ''}
                        onChange={(e) => handleObservationChange(item, e.target.value)}
                        fullWidth
                        variant="outlined"
                        inputProps={{ maxLength: 200 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleRemoveProduct(item)} // Elimina el producto individualmente
                        color="secondary"
                        aria-label="Eliminar producto"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default InvoiceDetails;
