import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField, CircularProgress, Alert, Typography, Box, Divider } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import UserServices from '../../services/UserServices';

const ClientAutocomplete = ({ onClientSelect }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCliente, setSelectedCliente] = useState(null);

  // Cargar clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await UserServices.getClientes();
        setClientes(response);
      } catch (err) {
        setError('No se pudieron cargar los clientes. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  // Manejar selección de cliente
  const handleClientChange = (event, value) => {
    setSelectedCliente(value);
    if (value) onClientSelect(value); // Llamar a la función con el ID del cliente seleccionado
  };

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        marginTop: 3,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Seleccionar Cliente
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />

      {/* Mostrar mensaje de error si ocurre */}
      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}

      <Autocomplete
        id="client-autocomplete"
        options={clientes}
        getOptionLabel={(option) => `${option.Nombre} (${option.Cedula})`} // Mostrar nombre y cédula
        loading={loading}
        value={selectedCliente}
        onChange={handleClientChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
              readOnly: true, // Evitar entrada de texto
            }}
          />
        )}
        noOptionsText="No hay clientes disponibles"
        isOptionEqualToValue={(option, value) => option.PersonalID === value?.PersonalID}
        autoHighlight // Resaltar automáticamente la primera opción
        openOnFocus // Abrir lista al hacer foco
      />
    </Box>
  );
};

ClientAutocomplete.propTypes = {
  onClientSelect: PropTypes.func.isRequired, // Función para manejar la selección de cliente
};

export default ClientAutocomplete;
