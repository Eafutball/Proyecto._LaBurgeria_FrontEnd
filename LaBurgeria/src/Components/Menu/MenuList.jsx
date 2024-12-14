import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Asegúrate de tener instalado prop-types
import MenuItem from './MenuItem';
import MenuServices from '../../services/MenuServices'; // Asegúrate de que el servicio de menús esté correctamente implementado
import './MenuList.css'; // Asegúrate de que la ruta sea correcta
import { useNavigate } from 'react-router-dom'; // Para redirigir a la página de actualización del menú

const MenuList = ({ isAdmin }) => { // Recibe isAdmin como prop
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null); // Estado de error
    const navigate = useNavigate(); // Hook para la navegación

    useEffect(() => {
        const fetchMenus = async () => {
            setLoading(true); // Iniciar el estado de carga
    
            try {
                // Llama al servicio para obtener los menús
                const data = await MenuServices.fetchMenusOrdered(); 
                console.log('Fetched Data:', data); // Muestra los datos en la consola
    
                // Validar que la respuesta sea un array
                if (!Array.isArray(data)) {
                    throw new Error('La respuesta no es un array');
                }
    
                setMenus(data); // Establecer los menús en el estado
    
            } catch (error) {
                setError(`Error fetching menus: ${error.message}`); // Establecer el error en el estado
                console.error('Error fetching menus:', error);
            } finally {
                setLoading(false); // Termina el estado de carga
            }
        };
    
        fetchMenus();
    }, []);
    
    // Función para renderizar el estado de carga
    const renderLoading = () => <div>Loading...</div>;

    // Función para renderizar el mensaje de error
    const renderError = () => <div>Error: {error}</div>;

    // Función para renderizar la lista de menús
    const renderMenus = () => {
        if (menus.length === 0) {
            return <p>No hay menús disponibles.</p>; // Mensaje si no hay menús
        }

        return menus.map((menu) => (
            <div key={menu.MenúID}>
                <MenuItem menu={menu} isAdmin = {isAdmin} />
                {/* Mostrar el botón de actualización solo si es admin */}
                {isAdmin && (
                    <button
                        onClick={() => navigate(`/update-menu/${menu.MenúID}`)} // Redirige a la página de actualización
                        className="update-menu-button"
                    >
                        Actualizar Menú
                    </button>
                )}
            </div>
        ));
    };

    // Renderizar basado en el estado
    return (
        <div>
            {loading ? renderLoading() : error ? renderError() : renderMenus()}
        </div>
    );
};

// PropTypes para la validación de las propiedades
MenuList.propTypes = {
    isAdmin: PropTypes.bool.isRequired, // Prop para verificar si el usuario es admin
    menus: PropTypes.arrayOf(
        PropTypes.shape({
            MenúID: PropTypes.string.isRequired,
            Nombre: PropTypes.string.isRequired,
            Descripción: PropTypes.string.isRequired,
            Dia: PropTypes.string.isRequired,
            FechaInicio: PropTypes.string.isRequired,
            FechaFin: PropTypes.string.isRequired,
            HoraInicio: PropTypes.string.isRequired,
            HoraFin: PropTypes.string.isRequired,
            FormatoMenu: PropTypes.string.isRequired,
        })
    )
};

export default MenuList;
