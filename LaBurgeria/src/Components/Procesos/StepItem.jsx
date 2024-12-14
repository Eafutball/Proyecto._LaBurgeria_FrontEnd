import React from 'react';
import PropTypes from 'prop-types';
import './StepItem.css'; // Importar los estilos

const StepItem = ({ estacion }) => {
  return (
    <li className="step-item">
      <div className="step-info">
        <div className="step-name">
          <p><strong>Estación:</strong> {estacion.nombre}</p>
        </div>
        <div className="step-order">
          <p><strong>Orden:</strong> {estacion.orden}</p>
        </div>
      </div>
    </li>
  );
};

// Validación de props
StepItem.propTypes = {
  estacion: PropTypes.shape({
    EstacionID: PropTypes.string.isRequired,
    orden: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
  }).isRequired,
};

export default StepItem;
