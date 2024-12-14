import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Radio, RadioGroup, FormControlLabel, Paper, FormControl } from '@mui/material';

const DeliveryMethodSelector = ({ deliveryMethod, onChange }) => {
  const handleChange = (event) => {
    const selectedMethod = event.target.value;
    onChange(selectedMethod); // Llama a la función para notificar el cambio
  };

  return (
    <Paper sx={{ marginTop: '24px', padding: '24px', borderRadius: '12px', boxShadow: 6 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '1.2rem', color: 'primary.main' }}>
        Método de Entrega
      </Typography>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup value={deliveryMethod} onChange={handleChange}>
          <FormControlLabel
            value="Domicilio"
            control={
              <Radio 
                sx={{ 
                  color: 'primary.main', 
                  '&.Mui-checked': { color: 'primary.dark' }, 
                  padding: '6px',
                }} 
              />
            }
            label="Entrega a domicilio"
            sx={{
              marginBottom: 2,
              typography: 'body1',
              fontWeight: 500,
              color: 'text.primary',
              '& .MuiFormControlLabel-label': {
                fontSize: '1rem',
                fontWeight: 500,
              },
            }}
          />
          <FormControlLabel
            value="Tienda"
            control={
              <Radio 
                sx={{ 
                  color: 'primary.main', 
                  '&.Mui-checked': { color: 'primary.dark' },
                  padding: '6px',
                }} 
              />
            }
            label="Recogida en tienda"
            sx={{
              marginBottom: 2,
              typography: 'body1',
              fontWeight: 500,
              color: 'text.primary',
              '& .MuiFormControlLabel-label': {
                fontSize: '1rem',
                fontWeight: 500,
              },
            }}
          />
        </RadioGroup>
      </FormControl>
    </Paper>
  );
};

// Agregar validación de PropTypes
DeliveryMethodSelector.propTypes = {
  deliveryMethod: PropTypes.string.isRequired, // Validar que deliveryMethod es una cadena requerida
  onChange: PropTypes.func.isRequired, // Validar que onChange es una función requerida
};

export default DeliveryMethodSelector;
