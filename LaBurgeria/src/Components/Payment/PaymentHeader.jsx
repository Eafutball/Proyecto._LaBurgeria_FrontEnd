import React from "react";
import PropTypes from "prop-types"; // Importar PropTypes
import { Box, Typography } from "@mui/material"; // Importamos componentes de Material UI

const PaymentHeader = ({ total }) => (
    <Box sx={{ padding: 2, backgroundColor: "#f4f4f4", borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="h5" sx={{ marginBottom: 1 }}>
            Resumen del Pago
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Total a pagar: ${total}
        </Typography>
    </Box>
);

// Definir la validación de los props
PaymentHeader.propTypes = {
    total: PropTypes.number.isRequired, // Validar que total sea un número requerido
};

export default PaymentHeader;
