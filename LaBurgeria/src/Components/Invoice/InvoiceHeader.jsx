import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, CircularProgress, Grid, Divider, Alert } from '@mui/material';
import { AccountCircle, Payment, LocalShipping, Event, Info } from '@mui/icons-material';
import UserServices from '../../services/UserServices';
import { useUser } from "../../Hooks/useUser";

const InvoiceHeader = ({ pedido }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEncargado, setIsEncargado] = useState(false);
  const { decodeToken } = useUser();

  const fetchUsuario = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tokenData = decodeToken();
      if (!tokenData) throw new Error('Token no válido o expirado');

      const id = tokenData.rol === "Encargado" ? pedido.PersonalID : tokenData.id;
      setIsEncargado(tokenData.rol === "Encargado");

      const response = await UserServices.getFullUserInfo(+id);
      if (response) {
        setUsuario(response);
      } else {
        throw new Error('No se pudo obtener información del usuario');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [decodeToken, pedido.PersonalID]);

  useEffect(() => {
    fetchUsuario();
  }, [fetchUsuario]);

  const renderUserInfo = () => {
    if (loading) {
      return <CircularProgress size={24} sx={{ marginTop: 2 }} />;
    }

    if (error) {
      return <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>;
    }

    if (!usuario) {
      return (
        <Typography variant="body1" color="error" align="center">
          No se encontró información del usuario.
        </Typography>
      );
    }

    const { Nombre, Apellido, Rol } = usuario;
    const userInfoText = `${Nombre || ''} ${Apellido || ''} ${Rol?.Nombre ? `(${Rol.Nombre})` : ''}`;

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginTop: 1 }}>
        <AccountCircle fontSize="small" />
        <Typography variant="body1">{userInfoText}</Typography>
      </Box>
    );
  };

  const renderEncargadoAsociado = () => {
    if (isEncargado && pedido?.encargado_asociado) {
      return (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body1">
            <strong>Encargado Asociado:</strong> {pedido?.encargado_asociado || 'No disponible'}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const { FechaHora, metodo_de_entrega, metodo_de_pago, Estado } = pedido;

  return (
    <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, marginBottom: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        Detalles del Pedido
      </Typography>

      <Divider sx={{ marginBottom: 2 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Event fontSize="small" />
            <Typography variant="body1">
              <strong>Fecha:</strong> {FechaHora || 'No disponible'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShipping fontSize="small" />
            <Typography variant="body1">
              <strong>Entrega:</strong> {metodo_de_entrega || 'No disponible'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Payment fontSize="small" />
            <Typography variant="body1">
              <strong>Pago:</strong> {metodo_de_pago || 'No disponible'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Info fontSize="small" />
            <Typography variant="body1">
              <strong>Estado:</strong> {Estado || 'No disponible'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body1">
            <strong>Información del Usuario:</strong>
          </Typography>
          {renderUserInfo()}
          {renderEncargadoAsociado()}
        </Grid>
      </Grid>
    </Paper>
  );
};

InvoiceHeader.propTypes = {
  pedido: PropTypes.shape({
    FechaHora: PropTypes.string,
    PersonalID: PropTypes.number.isRequired,
    metodo_de_entrega: PropTypes.string,
    metodo_de_pago: PropTypes.string,
    Estado: PropTypes.string,
    encargado_asociado: PropTypes.string,
  }).isRequired,
};

export default InvoiceHeader;
