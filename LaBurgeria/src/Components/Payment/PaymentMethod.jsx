import React, { useState } from "react";
import { Box, Card, CardContent, Grid, Typography, CardActionArea, Tooltip, CardActions, IconButton, Snackbar } from "@mui/material";
import PropTypes from "prop-types"; // Importar PropTypes
import { AttachMoney as CashIcon, CreditCard as CreditCardIcon, CreditCardOutlined as CreditCardOutlinedIcon, Info as InfoIcon } from "@mui/icons-material"; // Cambiar a CreditCardOutlined

// Definir los métodos de pago
const paymentMethods = [
  {
    label: "Efectivo",
    value: "Efectivo",
    icon: <CashIcon sx={{ fontSize: 40 }} />,
    color: "#ff9800",
    hoverColor: "#fb8c00",
    description: "Pago en efectivo directamente en el local",
  },
  {
    label: "Tarjeta de Crédito",
    value: "Tarjeta",
    icon: <CreditCardIcon sx={{ fontSize: 40 }} />,
    color: "#1976d2",
    hoverColor: "#1565c0",
    description: "Pago con tarjeta de crédito",
  },
  {
    label: "Débito",
    value: "Débito",
    icon: <CreditCardOutlinedIcon sx={{ fontSize: 40 }} />,
    color: "#43a047", // Color verde para débito
    hoverColor: "#388e3c",
    description: "Pago con tarjeta de débito",
  },
];

const PaymentMethod = ({ setPaymentMethod }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleMethodClick = (methodValue) => {
    setPaymentMethod(methodValue);
    setOpenSnackbar(true); // Muestra un Snackbar después de seleccionar el método de pago
  };

  return (
    <Box sx={{ p: 3, textAlign: "center", backgroundColor: "#f7f7f7", borderRadius: "8px", boxShadow: 3, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: "#333" }}>
        Selecciona el Método de Pago
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {paymentMethods.map((method) => (
          <Grid item xs={12} sm={4} key={method.value}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.05)", // Efecto de enfoque
                  boxShadow: 3, // Sombra al hacer hover
                },
              }}
              onClick={() => handleMethodClick(method.value)}
            >
              <CardActionArea>
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 3, backgroundColor: method.color }}>
                  {method.icon}
                  <Typography variant="h6" sx={{ mt: 2, color: "#fff", fontWeight: 600 }}>
                    {method.label}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions sx={{ justifyContent: "center" }}>
                <Tooltip title={method.description} arrow>
                  <IconButton sx={{ color: "#fff" }}>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar para mostrar mensaje al seleccionar un método de pago */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Método de pago seleccionado"
        sx={{ bottom: 50 }}
      />
    </Box>
  );
};

// Definir la validación de los props
PaymentMethod.propTypes = {
  setPaymentMethod: PropTypes.func.isRequired, // Validar que setPaymentMethod sea una función requerida
};

export default PaymentMethod;
