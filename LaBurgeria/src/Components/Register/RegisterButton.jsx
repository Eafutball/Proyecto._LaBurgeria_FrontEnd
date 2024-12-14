// src/components/RegisterButton.js
import React from 'react';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';

const RegisterButton = ({ onSubmit }) => {
  const handleSubmit = (event) => {
    event.preventDefault();  // Prevenir el comportamiento por defecto del formulario (recarga de página)
    onSubmit();  // Llamar la función onSubmit que se pasa como propiedad
  };

  return (
    <Button
      type="button"  // Establecer tipo a "button" para evitar el comportamiento de submit por defecto
      fullWidth
      variant="contained"
      color="primary"
      sx={{ mt: 3, mb: 2 }}
      onClick={handleSubmit}  // Usar onClick para disparar el onSubmit cuando se haga clic en el botón
    >
      Registrar
    </Button>
  );
};

RegisterButton.propTypes = {
  onSubmit: PropTypes.func.isRequired,  // Cambiado a func porque onSubmit es una función
};

export default RegisterButton;
