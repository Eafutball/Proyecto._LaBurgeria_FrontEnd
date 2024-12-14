import React from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Formik, Field, Form } from "formik";
import PropTypes from "prop-types";

const PaymentForm = ({
  paymentMethod,
  total,
  cashAmount,
  change,
  onCashChange,
  onPayment,
}) => {
  const onSubmit = (values) => {
    // Lógica para pago en efectivo
    if (paymentMethod === "Efectivo" && values.cashAmount >= total) {
      onCashChange(Number(values.cashAmount));
    }
    onPayment();
  };

  const renderCardForm = () => (
    <Box>
      <Typography variant="h6">Pago con {paymentMethod}</Typography>
      <Formik
        initialValues={{
          cardNumber: "",
          expirationDate: "",
          cvv: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.cardNumber) {
            errors.cardNumber = "El número de tarjeta es obligatorio";
          } else if (!/^[0-9]{16}$/.test(values.cardNumber)) {
            errors.cardNumber = "El número de tarjeta debe ser de 16 dígitos";
          }
          if (!values.cvv) {
            errors.cvv = "El CVV es obligatorio";
          } else if (!/^[0-9]{3}$/.test(values.cvv)) {
            errors.cvv = "El CVV debe tener 3 dígitos";
          }
          if (paymentMethod === "Tarjeta" && !values.expirationDate) {
            errors.expirationDate = "La fecha de expiración es obligatoria";
          } else if (
            paymentMethod === "Tarjeta" &&
            !/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(values.expirationDate)
          ) {
            errors.expirationDate = "La fecha de expiración debe ser MM/AA";
          }
          return errors;
        }}
        onSubmit={onSubmit}
      >
        {({ values, handleChange, handleBlur, errors, touched }) => (
          <Form>
            <Field
              name="cardNumber"
              as={TextField}
              label="Número de Tarjeta"
              fullWidth
              sx={{ my: 1 }}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.cardNumber}
              error={touched.cardNumber && !!errors.cardNumber}
              helperText={touched.cardNumber && errors.cardNumber}
            />
            {paymentMethod === "Tarjeta" && (
              <Field
                name="expirationDate"
                as={TextField}
                label="Fecha de Expiración (MM/AA)"
                fullWidth
                sx={{ my: 1 }}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.expirationDate}
                error={touched.expirationDate && !!errors.expirationDate}
                helperText={touched.expirationDate && errors.expirationDate}
              />
            )}
            <Field
              name="cvv"
              as={TextField}
              label="CVV"
              fullWidth
              sx={{ my: 1 }}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.cvv}
              error={touched.cvv && !!errors.cvv}
              helperText={touched.cvv && errors.cvv}
            />
            <Typography>Total a pagar: ${total}</Typography>
            <Button
              variant="contained"
              color="success"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
            >
              Finalizar Pago
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );

  const renderCashForm = () => (
    <Box>
      <Typography variant="h6">Pago en Efectivo</Typography>
      <Formik
        initialValues={{
          cashAmount: cashAmount || "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.cashAmount) {
            errors.cashAmount = "El monto entregado es obligatorio";
          } else if (values.cashAmount < total) {
            errors.cashAmount = `El monto debe ser al menos ${total}`;
          }
          return errors;
        }}
        onSubmit={onSubmit}
      >
        {({ values, handleChange, handleBlur, errors, touched }) => (
          <Form>
            <Field
              name="cashAmount"
              as={TextField}
              type="number"
              label="Monto entregado"
              fullWidth
              sx={{ my: 2 }}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.cashAmount}
              error={touched.cashAmount && !!errors.cashAmount}
              helperText={touched.cashAmount && errors.cashAmount}
            />
            <Typography>Vuelto: ${change}</Typography>
            <Typography>Total a pagar: ${total}</Typography>
            <Button
              variant="contained"
              color="success"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
            >
              Finalizar Pago
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
      {paymentMethod === "Efectivo" && renderCashForm()}
      {["Tarjeta", "Débito"].includes(paymentMethod) && renderCardForm()}
    </Box>
  );
};

PaymentForm.propTypes = {
  paymentMethod: PropTypes.string.isRequired, // Método de pago (tarjeta o efectivo)
  total: PropTypes.number.isRequired, // Total a pagar
  cashAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Monto entregado en efectivo
  change: PropTypes.number.isRequired, // Monto de vuelto
  onCashChange: PropTypes.func.isRequired, // Función que maneja el cambio de monto en efectivo
  onPayment: PropTypes.func.isRequired, // Función que maneja la acción de pago
};

export default PaymentForm;
