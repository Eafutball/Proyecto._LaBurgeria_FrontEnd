import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AvailabilityRange from './AvalabilityRange'; // Asegúrate de que el nombre del archivo sea correcto
import './MenuItem.css'; // Asegúrate de tener un archivo CSS para los estilos
import MenuServices from '../../services/MenuServices';
import { Link } from 'react-router-dom';

const MenuItem = ({ menu, isAdmin }) => {
    const [loading, setLoading] = useState(false);
    const startDate = new Date(menu.FechaInicio);
    const endDate = new Date(menu.FechaFin);

    // Mensajes constantes
    const successMessage = 'Menú activado con éxito.';
    const errorMessage = 'No se pudo activar el menú.';

    const handleActivate = async () => {
        console.log('Activando menú:', menu.MenúID);
        setLoading(true);
        
        try {
            const response = await MenuServices.activateMenu({ MenúID: menu.MenúID });
            console.log('Respuesta del servidor:', response);
            
            // Mostrar mensaje de éxito
            toast.success(`${successMessage} ID: ${response.MenúID}`);
            
            // Recargar la página después de la activación
            window.location.reload();
        } catch (error) {
            console.error('Error al activar el menú:', error);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="menu-item">
            <div className="menu-header">
                <h2 className="menu-title">{menu.Nombre}</h2>
                <div className="menu-category">
                    <span className="category-label">{menu.FormatoMenu}</span>
                </div>
            </div>

            <div className="menu-description-container">
                <p className="menu-description">{menu.Descripción}</p>
            </div>

            <div className="menu-day-container">
                <p><strong>Día:</strong> {menu.Dia}</p>
            </div>

            <div className="availability-container">
                <AvailabilityRange 
                    startDate={startDate} 
                    endDate={endDate} 
                    startTime={menu.HoraInicio} 
                    endTime={menu.HoraFin} 
                />
            </div>

            {/* Botón para activar el menú */}
            <div className="activate-button-container">
                <button 
                    onClick={handleActivate} 
                    className="activate-button" 
                    disabled={loading}
                >
                    {loading ? 'Activando...' : 'Activar Menú'}
                </button>
            </div>

            {/* Botón de actualización visible solo para administradores */}
            {isAdmin && (
                <div className="update-button-container">
                    <Link to={`/update/${menu.MenúID}`} className="update-button">
                        Actualizar Menú
                    </Link>
                </div>
            )}
        </div>
    );
};

// Validación de PropTypes
MenuItem.propTypes = {
    menu: PropTypes.shape({
        MenúID: PropTypes.number.isRequired,
        Nombre: PropTypes.string.isRequired,
        Descripción: PropTypes.string.isRequired,
        Dia: PropTypes.string.isRequired,
        FechaInicio: PropTypes.string.isRequired,
        FechaFin: PropTypes.string.isRequired,
        HoraInicio: PropTypes.string.isRequired,
        HoraFin: PropTypes.string.isRequired,
        FormatoMenu: PropTypes.string.isRequired,
    }).isRequired,
    isAdmin: PropTypes.bool.isRequired, // Se asegura de que isAdmin sea un booleano
};

export default MenuItem;
