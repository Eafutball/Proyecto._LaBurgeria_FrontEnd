import React from 'react';
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PropTypes from 'prop-types';

const QuantityControl = ({ item, onIncrement, onDecrement }) => {
  // Función de manejo del decremento
  const handleDecrement = () => {
    console.log('Decrementando producto:', item.ProductoID || item.ComboID); // Log para ver qué producto se va a decrementar
    onDecrement(item.ProductoID || item.ComboID); // Pasa el ID del item para modificar solo ese
  };

  // Función de manejo del incremento
  const handleIncrement = () => {
    console.log('Incrementando producto:', item.ProductoID || item.ComboID); // Log para ver qué producto se va a incrementar
    onIncrement(item.ProductoID || item.ComboID); // Pasa el ID del item para modificar solo ese
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {/* Botón de Decremento */}
      <Button
        onClick={handleDecrement} // Usar la función handleDecrement para loguear
        color="primary"
        variant="outlined"
        sx={{
          minWidth: 40,
          height: 40,
          padding: 0,
        }}
        disabled={item.cantidad <= 1} // Deshabilitar si la cantidad es 1 o menos
      >
        <RemoveIcon />
      </Button>

      {/* Muestra la cantidad */}
      <span style={{ fontSize: '1rem', padding: '0 10px' }}>{item.cantidad}</span>

      {/* Botón de Incremento */}
      <Button
        onClick={handleIncrement} // Usar la función handleIncrement para loguear
        color="primary"
        variant="outlined"
        sx={{
          minWidth: 40,
          height: 40,
          padding: 0,
        }}
      >
        <AddIcon />
      </Button>
    </Box>
  );
};

QuantityControl.propTypes = {
  item: PropTypes.shape({
    ProductoID: PropTypes.string,  // Validación para ProductoID
    ComboID: PropTypes.string,     // Validación para ComboID
    cantidad: PropTypes.number.isRequired,  // Validación para la cantidad
  }).isRequired,
  onIncrement: PropTypes.func.isRequired,  // Función para incrementar
  onDecrement: PropTypes.func.isRequired,  // Función para decrementar
};

export default QuantityControl;
