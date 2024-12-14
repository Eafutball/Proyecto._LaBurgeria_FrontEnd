import React from "react";
import { Box, Typography, Button } from "@mui/material";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const PaymentConfirmation = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 400, mx: "auto", textAlign: "center" }}>
      <Typography variant="h5" color="success.main">¡Pago Exitoso!</Typography>
      <Typography variant="body1" sx={{ my: 2 }}>
        Gracias por tu compra. Tu pedido ha sido registrado.
      </Typography>
      <Link to={'/'}> 
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
      >
        Volver al Menú
      </Button>
      </Link>
    </Box>
  );
};

PaymentConfirmation.propTypes = {
    orderId: PropTypes.number.isRequired, // Método de pago (tarjeta o efectivo)
    total: PropTypes.number.isRequired, // Método de pago (tarjeta o efectivo)
  };
  

export default PaymentConfirmation;
