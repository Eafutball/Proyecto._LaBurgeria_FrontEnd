import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import EstacionesServices from '../../services/EstacionesServices';
import './StationSelect.css'; // Estilos del formulario
import { FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';

const StationSelect = ({ selectedStations, setSelectedStations }) => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStations = async () => {
      try {
        const response = await EstacionesServices.getAllStations();
        if (response?.Estaciones) {
          setStations(response.Estaciones);
          console.log('Estaciones cargadas:', response.Estaciones); // Registro de estaciones cargadas
        } else {
          throw new Error('No se encontraron estaciones');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  // Manejar cambios en el selector
  const handleChange = (event) => {
    const { value } = event.target; // Obtener el valor de las estaciones seleccionadas
    const selected = value.map(stationID => ({
      EstacionID: Number(stationID) // Usar solo el ID aquí
    })); // Crear objetos con la estructura esperada
    setSelectedStations(selected); // Actualizar las estaciones seleccionadas
    console.log('Estaciones seleccionadas:', selected); // Registro de estaciones seleccionadas
  };

  if (loading) return <p>Cargando estaciones...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <FormControl fullWidth>
      <InputLabel id="station-select-label">Selecciona tus Estaciones</InputLabel>
      <Select
        labelId="station-select-label"
        multiple
        value={selectedStations.map(station => station.EstacionID)} // Usar los IDs seleccionados
        onChange={handleChange}
      >
        {stations.map((station) => (
          <MenuItem key={station.EstacionID} value={station.EstacionID}>
            {station.Nombre} {/* Mostrar el nombre de la estación */}
          </MenuItem>
        ))}
      </Select>
      <div style={{ marginTop: '10px' }}>
        {selectedStations.map((station) => (
          <Chip 
            key={station.EstacionID} 
            label={station.Nombre} // Mostrar el nombre aquí
          />
        ))}
      </div>
    </FormControl>
  );
}  

StationSelect.propTypes = {
  selectedStations: PropTypes.arrayOf(PropTypes.shape({
    EstacionID: PropTypes.number.isRequired,
  })).isRequired,
  setSelectedStations: PropTypes.func.isRequired,
};

export default StationSelect;
