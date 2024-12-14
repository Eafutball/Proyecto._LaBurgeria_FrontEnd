import React, { useEffect, useState } from 'react';
import ComboSection from './ComboSection';
import ProductSection from './ProductSection'; // Importa ProductSection
import AvailabilityRange from './AvalabilityRange'; // Asegúrate de que la ruta sea correcta
import MenuServices from '../../services/MenuServices'; // Asegúrate de que la ruta sea correcta
import './AvaliableMenu.css'; // Asegúrate de tener estilos para este componente

const AvailableMenu = () => {
    const [recentMenuID, setRecentMenuID] = useState(null); // Estado para almacenar el ID del menú reciente
    const [menuName, setMenuName] = useState(''); // Estado para almacenar el nombre del menú
    const [availability, setAvailability] = useState(null); // Estado para almacenar la disponibilidad
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null); // Estado de error

    // Función para obtener el menú más reciente y establecer la disponibilidad
    const loadRecentMenu = async () => {
        try {
            const recentMenu = await MenuServices.fetchRecentMenu();
            console.log(recentMenu); // Agrega esto para depuración

            // Verifica si recentMenu es un array
            if (!Array.isArray(recentMenu)) {
                throw new Error('La respuesta no es un array');
            }

            // Obtener disponibilidad, nombre del menú, y MenúID del primer menú (o el más reciente)
            if (recentMenu.length > 0) {
                const { MenúID, Nombre, FechaInicio, FechaFin, HoraInicio, HoraFin } = recentMenu[0];
                setRecentMenuID(MenúID); // Almacenar el ID del menú reciente
                setMenuName(Nombre); // Almacenar el nombre del menú reciente
                setAvailability({
                    startDate: new Date(FechaInicio),
                    endDate: new Date(FechaFin),
                    startTime: HoraInicio,
                    endTime: HoraFin,
                });
            }
        } catch (error) {
            setError(error.message); // Manejar el error
        } finally {
            setLoading(false); // Cambiar el estado de carga
        }
    };

    useEffect(() => {
        loadRecentMenu(); // Cargar el menú más reciente al montar el componente
    }, []); // La dependencia vacía asegura que se ejecute solo una vez

    return (
        <div className="available-menu">
            <h1 className="available-menu-title">Menú Disponible</h1>
            <div className="menu-content">
                {loading ? (
                    <div className="loading-message-container">
                        <p className="loading-message">Cargando menús...</p> {/* Mensaje de carga */}
                    </div>
                ) : error ? (
                    <div className="error-message-container">
                        <p className="error-message">Error: {error}</p> {/* Mensaje de error */}
                    </div>
                ) : (
                    <>
                        <div className="menu-info">
                            {/* Mostrar el nombre del menú si está disponible */}
                            {menuName && (
                                <div className="menu-name-container">
                                    <h2 className="menu-name">{menuName}</h2>
                                </div>
                            )}

                            {availability && (
                                <div className="availability-container">
                                    <AvailabilityRange 
                                        startDate={availability.startDate}
                                        endDate={availability.endDate}
                                        startTime={availability.startTime}
                                        endTime={availability.endTime}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="menu-sections">
                            <div className="combo-section-container">
                                <h3 className="combo-section-title">Combos</h3> {/* Título para Combos */}
                                <div className="combo-section-content">
                                    <ComboSection menuID={recentMenuID} />
                                </div>
                            </div>
                            <div className="product-section-container">
                                <h3 className="product-section-title">Productos</h3> {/* Título para Productos */}
                                <div className="product-section-content">
                                    <ProductSection menuID={recentMenuID} /> 
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AvailableMenu;
