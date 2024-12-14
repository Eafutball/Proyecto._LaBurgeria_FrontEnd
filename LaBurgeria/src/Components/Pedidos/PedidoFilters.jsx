import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
  Box,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";

const PedidoFilters = ({
  statusFilter = "", // Default value to avoid undefined
  setStatusFilter,
  dateFilter = "", // Default value to avoid undefined
  setDateFilter,
  handleResetFilters,
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
      <Grid container spacing={2}>
        {/* Estado Filtro */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Filtrar por estado</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Filtrar por estado"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Pendiente">Pendiente de pago</MenuItem>
              <MenuItem value="Aceptada">Aceptada</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Fecha Filtro */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Filtrar por fecha"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
      </Grid>

      {/* Botón de reiniciar filtros */}
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Button
          onClick={handleResetFilters}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Reiniciar Filtros
        </Button>
      </Box>
    </Box>
  );
};

// Define prop types to validate the props
PedidoFilters.propTypes = {
  statusFilter: PropTypes.string, // Default value is "" in the component
  setStatusFilter: PropTypes.func.isRequired, // Function to update status filter
  dateFilter: PropTypes.string, // Default value is "" in the component
  setDateFilter: PropTypes.func.isRequired, // Function to update date filter
  handleResetFilters: PropTypes.func.isRequired, // Function to reset filters
};

export default PedidoFilters;
