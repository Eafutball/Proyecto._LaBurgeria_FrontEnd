import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, TextField, Button, Typography, Box, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import UserServices from "../../services/UserServices";
import { useUser } from "../../Hooks/useUser";
import BannerBackground from "../../assets/home-banner-background.png";

const Login = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const { saveUser } = useUser();
  const navigate = useNavigate(); // Instancia el hook useNavigate

  const formik = useFormik({
    initialValues: {
      correo: "",
      Contrasena: "",
    },
    validationSchema: Yup.object({
      correo: Yup.string()
        .email("El correo electrónico no es válido")
        .required("El correo electrónico es obligatorio"),
      Contrasena: Yup.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .required("La contraseña es obligatoria"),
    }),
    onSubmit: async (values) => {
      console.log("Formulario enviado con los siguientes valores:", values);
      try {
        const response = await UserServices.login(values);
        console.log("Respuesta del servicio de login:", response);

        if (response.token) {
          console.log("Inicio de sesión exitoso");
          setSnackbarMessage("Inicio de sesión exitoso");
          setSnackbarSeverity("success");
          saveUser(response);

          navigate("/"); 
        } else {
          console.log("Credenciales incorrectas");
          setSnackbarMessage("Credenciales incorrectas. Intenta nuevamente.");
          setSnackbarSeverity("error");
        }
      } catch (error) {
        console.error("Hubo un error al intentar iniciar sesión:", error);
        setSnackbarMessage("Hubo un error al intentar iniciar sesión. Intenta nuevamente.");
        setSnackbarSeverity("error");
      } finally {
        setOpenSnackbar(true);
      }
    },
  });

  const handleCloseSnackbar = () => {
    console.log("Snackbar cerrado");
    setOpenSnackbar(false);
  };

  return (
    <Container
      maxWidth="xs"
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
            <img src={BannerBackground} alt="Banner" className="banner-image" />

      <Box
        sx={{
          width: "100%",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
      >
        <Box sx={{ marginBottom: "1.5rem" }}>
          <Typography variant="h4" align="center" gutterBottom>
            Bienvenido
          </Typography>
          <Typography variant="subtitle1" align="center" gutterBottom>
            Inicia sesión para continuar
          </Typography>
        </Box>

        <Box>
          <form onSubmit={formik.handleSubmit} style={{ marginTop: "1rem" }}>
            <TextField
              label="Correo Electrónico"
              name="correo"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formik.values.correo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.correo && Boolean(formik.errors.correo)}
              helperText={formik.touched.correo && formik.errors.correo}
            />
            <TextField
              label="Contraseña"
              name="Contrasena"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formik.values.Contrasena}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.Contrasena && Boolean(formik.errors.Contrasena)}
              helperText={formik.touched.Contrasena && formik.errors.Contrasena}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: "1.5rem" }}
            >
              Iniciar Sesión
            </Button>
          </form>
        </Box>

        <Box sx={{ marginTop: "1.5rem" }}>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={snackbarMessage}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{
              backgroundColor: snackbarSeverity === "success" ? "green" : "red",
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
