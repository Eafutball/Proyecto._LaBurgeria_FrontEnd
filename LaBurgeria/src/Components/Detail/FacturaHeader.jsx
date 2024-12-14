import React, { useState, useEffect } from "react";
import { Typography, Divider, CircularProgress, Box, Paper } from "@mui/material";
import { format } from "date-fns";
import PropTypes from "prop-types";
import UserServices from "../../services/UserServices";
import { useUser } from "../../Hooks/useUser";

const FacturaHeader = ({ pedido }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // Estado para manejar errores
  const { decodeToken } = useUser();
  console.log(pedido);
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const tokenData = decodeToken();
        if (!tokenData) {
          throw new Error("Token no válido o expirado");
        }

        const response = await UserServices.getFullUserInfo(tokenData.id);
        setUsuario(response);
      } catch (error) {
        console.error("Error al cargar la información del usuario:", error);
        setError("Hubo un error al cargar la información del usuario.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [decodeToken]);

  const renderUserInfo = () => {
    if (loading) {
      return <CircularProgress size={24} sx={{ marginTop: 2 }} />;
    }

    if (error) {
      return (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      );
    }

    if (!usuario) {
      return (
        <Typography variant="body1" color="error" align="center">
          No se encontró información del usuario.
        </Typography>
      );
    }

    const { Nombre, Apellido, Rol } = usuario;

    // Si el rol es "Encargado", mostrar el cliente asociado
    if (pedido.encargado_asociado) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 1 }}>
          <Typography variant="body1" color="textSecondary">
            <strong>Cliente:</strong> {Nombre} {Apellido}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Encargado Asociado:</strong> {pedido.encargado_asociado}
          </Typography>
        </Box>
      );
    }

    // Si es un cliente, solo mostrar su nombre
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 1 }}>
        <Typography variant="body1" color="textSecondary">
          <strong>{Rol?.Nombre === "Cliente" ? "Cliente" : "Encargado"}:</strong> {Nombre} {Rol?.Nombre === "Cliente" && Apellido}
        </Typography>
      </Box>
    );
  };

  return (
    <Paper sx={{ padding: 3, backgroundColor: "#f7f7f7", borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h4" align="center" gutterBottom color="primary" sx={{ fontWeight: "bold" }}>
        Factura de Pedido #{pedido.PedidoID}
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        <Typography variant="subtitle1" color="textSecondary">
          <strong>Fecha:</strong> {format(new Date(pedido.FechaHora), "dd/MM/yyyy HH:mm")}
        </Typography>
      </Box>

      {renderUserInfo()}

      <Divider sx={{ marginTop: 2 }} />
      <Box sx={{ textAlign: "center", marginTop: 2 }}>
        <Typography variant="body2" color="textSecondary">
          ¡Gracias por tu compra!
        </Typography>
      </Box>
    </Paper>
  );
};

// Mejorar la validación de prop-types
FacturaHeader.propTypes = {
  pedido: PropTypes.shape({
    PedidoID: PropTypes.number.isRequired,
    FechaHora: PropTypes.string.isRequired,
    encargado_asociado: PropTypes.string, // Puede ser nulo si no existe
  }).isRequired,
};

export default FacturaHeader;
