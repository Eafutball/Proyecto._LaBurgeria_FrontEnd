import React from "react";
import { Box, Container, Grid, Typography, Snackbar, Button, TextField } from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import RoleSelect from "./RoleSelect";
import UserServices from "../../services/UserServices";

const RegisterLayout = () => {
  const [notification, setNotification] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const validationSchema = Yup.object({
    Cedula: Yup.string().required("La cédula es obligatoria"),
    Nombre: Yup.string().required("El nombre es obligatorio"),
    Apellido: Yup.string().required("El apellido es obligatorio"),
    correo: Yup.string().email("Correo electrónico inválido").required("El correo electrónico es obligatorio"),
    Fecha_Nacimiento: Yup.date().required("La fecha de nacimiento es obligatoria"),
    Contrasena: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("La contraseña es obligatoria"),
    RolID: Yup.number().required("El rol es obligatorio"),
  });

  // Manejar el envío del formulario
  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await UserServices.register(values);
      if (response.success) {
        setNotification({
          open: true,
          message: "Usuario registrado correctamente",
          severity: "success",
        });
      } else {
        setNotification({
          open: true,
          message: "Error al registrar el usuario",
          severity: "error",
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: error.message,
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Cerrar notificación
  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 2 }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Registrarse
        </Typography>

        <Formik
          initialValues={{
            Cedula: "",
            Nombre: "",
            Apellido: "",
            Fecha_Nacimiento: "",
            Fecha_Ingreso: new Date().toISOString().split("T")[0],
            Contrasena: "",
            RolID: 0,
            correo: "",
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Cédula"
                    name="Cedula"
                    error={false}
                    helperText={<ErrorMessage name="Cedula" />}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Nombre Completo"
                    name="Nombre"
                    error={false}
                    helperText={<ErrorMessage name="Nombre" />}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Apellido"
                    name="Apellido"
                    error={false}
                    helperText={<ErrorMessage name="Apellido" />}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Correo Electrónico"
                    name="correo"
                    type="email"
                    error={false}
                    helperText={<ErrorMessage name="correo" />}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Fecha de Nacimiento"
                    name="Fecha_Nacimiento"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={false}
                    helperText={<ErrorMessage name="Fecha_Nacimiento" />}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Fecha de Registro"
                    type="date"
                    value={new Date().toISOString().split("T")[0]}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Contraseña"
                    name="Contrasena"
                    type="password"
                    error={false}
                    helperText={<ErrorMessage name="Contrasena" />}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    name="RolID"
                    render={({ field }) => (
                      <RoleSelect
                        {...field}
                        error={false}
                        helperText={<ErrorMessage name="RolID" />}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled={isSubmitting}
              >
                Registrarse
              </Button>
            </Form>
          )}
        </Formik>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        message={notification.message}
        severity={notification.severity}
      />
    </Container>
  );
};

export default RegisterLayout;
