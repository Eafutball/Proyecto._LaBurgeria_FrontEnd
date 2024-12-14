import React from "react";
import { Grid, Typography, Divider } from "@mui/material";
import PropTypes from "prop-types";  // Importar PropTypes

const FacturaResumen = ({ pedido }) => {
  // Asegurarse de que subtotal y impuesto sean números válidos
  const subtotal = parseFloat(pedido.subtotal) || 0;
  const total = parseFloat(pedido.Total) || 0;
  

  return (
    <div>
      <Divider sx={{ marginY: 2 }} />
      <Grid container spacing={2}>
        {/* Subtotal */}
        <Grid item xs={6}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Subtotal</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="h6">{subtotal.toFixed(2)} €</Typography>
        </Grid>


        {/* Total */}
        <Grid item xs={6}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Total</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold" }}>
            {total} €
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

// Añadir validación de prop-types
FacturaResumen.propTypes = {
  pedido: PropTypes.shape({
    subtotal: PropTypes.number.isRequired,
    Impuesto: PropTypes.number.isRequired, // IVA expresado como porcentaje
    Total: PropTypes.number.isRequired,
  }).isRequired, // Aquí definimos el tipo esperado para 'pedido'
};

export default FacturaResumen;
