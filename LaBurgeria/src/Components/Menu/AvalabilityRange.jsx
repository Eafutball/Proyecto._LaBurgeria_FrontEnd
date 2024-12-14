import React from 'react';
import PropTypes from 'prop-types';
import './AvalabilityRange.css'; // Asegúrate de que la ruta sea correcta

const AvailabilityRange = ({ startDate, endDate, startTime, endTime }) => {
    return (
        <div className="availability-range-container"> {/* Contenedor principal */}
            <div className="availability-range">
                <p className="availability-text">
                    Disponibilidad: {startDate.toLocaleDateString()} {startTime} - {endDate.toLocaleDateString()} {endTime}
                </p>
            </div>
        </div>
    );
};

// Validación de propiedades
AvailabilityRange.propTypes = {
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
};

export default AvailabilityRange;
