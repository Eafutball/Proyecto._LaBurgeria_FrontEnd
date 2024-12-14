import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import PropTypes from "prop-types";  // Importar PropTypes

const FacturaInfo = ({ pedido }) => {
  return (
    <Box sx={{ padding: 2, backgroundColor: '#fafafa', borderRadius: 2, boxShadow: 1 }}>
      <Grid container spacing={2}>
        {/* Estado */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Estado:</Typography>
          <Typography sx={{ color: pedido.Estado === "Completado" ? 'green' : 'orange', fontWeight: '500' }}>
            {pedido.Estado || "Pendiente"}
          </Typography>
        </Grid>

        {/* Método de pago */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Método de pago:</Typography>
          <Typography sx={{ color: pedido.metodo_de_pago ? 'black' : 'grey', fontWeight: '500' }}>
            {pedido.metodo_de_pago || "No especificado"}
          </Typography>
        </Grid>

        {/* Método de entrega */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Método de entrega:</Typography>
          <Typography sx={{ color: pedido.metodo_de_entrega ? 'black' : 'grey', fontWeight: '500' }}>
            {pedido.metodo_de_entrega || "No especificado"}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

// Añadir validación de prop-types
FacturaInfo.propTypes = {
  pedido: PropTypes.shape({
    Estado: PropTypes.string,
    metodo_de_pago: PropTypes.string,
    metodo_de_entrega: PropTypes.string, // Validación para el nuevo campo
  }).isRequired,
};

export default FacturaInfo;
