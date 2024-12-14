import React from 'react';
import Grid from '@mui/material/Grid';
import ComboCard from './ComboCard'; // Asegúrate de importar ComboCard
import PropTypes from 'prop-types';
import './ComboGrid.css'; 

const ComboGrid = ({ combos, isAdmin }) => { // Recibimos isAdmin como prop
  return (
    <div style={{ padding: '20px' }}>
      <div> {/* Añadido div para encapsular todo el contenido */}
        <Grid container spacing={3}>
          {combos.map((combo) => ( // Cambia products por combos
            <Grid item xs={12} sm={6} md={4} key={combo.ComboID}> {/* Cambia ProductoID por ComboID */}
              <ComboCard combo={combo} isAdmin={isAdmin} /> {/* Usa el componente ComboCard */}
            </Grid>
          ))}
        </Grid>

        {/* Mostrar opciones adicionales si el usuario es admin */}
        {isAdmin && (
          <div className="admin-options">
            <button className="create-combo-button">
              Crear Combo
            </button>
            {/* Otras opciones de admin pueden ir aquí */}
          </div>
        )}
      </div>
    </div>
  );
};

// Definición de PropTypes para validar las props
ComboGrid.propTypes = {
  combos: PropTypes.arrayOf( // Cambia products a combos
    PropTypes.shape({
      ComboID: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Acepta tanto string como número
      productos: PropTypes.arrayOf(PropTypes.string).isRequired, // Array de nombres de productos
      Imagen: PropTypes.string, // Imagen puede no estar presente
    })
  ).isRequired,
  isAdmin: PropTypes.bool.isRequired, // Prop para verificar si el usuario es admin
};

export default ComboGrid;
