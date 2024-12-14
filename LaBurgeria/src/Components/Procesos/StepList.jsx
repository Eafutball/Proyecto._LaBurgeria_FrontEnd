import React from 'react';
import PropTypes from 'prop-types';
import StepItem from './StepItem';
import './StepList.css'; // Asegúrate de importar el archivo CSS si tienes uno

const StepList = ({ estaciones }) => {
  return (
    <div className="step-list-container"> {/* Contenedor principal */}
      <div className="step-list-header"> {/* Encabezado de la lista */}
        <h3>Estaciones de Proceso</h3>
      </div>
      <div className="step-list-content"> {/* Contenido de la lista */}
        <ul className="step-list">
          {estaciones.map((estacion, index) => (
            <div className="step-item-wrapper" key={index}> {/* Contenedor para cada paso */}
              <StepItem estacion={estacion} />
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Validación de props
StepList.propTypes = {
  estaciones: PropTypes.arrayOf(
    PropTypes.shape({
      EstacionID: PropTypes.string.isRequired,
      orden: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default StepList;
