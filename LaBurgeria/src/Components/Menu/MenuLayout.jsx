import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate de react-router-dom
import MenuList from './MenuList'; // Asegúrate de que la ruta sea correcta
import './MenuLayout.css'; // Agrega estilos para el diseño si es necesario
import BannerBackground from '../../assets/home-banner-background.png'; // Asegúrate de que la ruta sea correcta
import AvailableMenu from './AvaliableMenu'; // Corrige la importación
import { useUser } from '../../Hooks/useUser'; // Asegúrate de importar el hook useUser correctamente

const MenuLayout = () => {
    const { user, decodeToken } = useUser(); // Obtén los datos del usuario y la función de decodificación del token
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    // **Efectos**
    useEffect(() => {
        if (user) {
            try {
                const decoded = decodeToken(); // Decodifica el token
                console.log('Token decodificado:', decoded);
                if (decoded) {
                    setUserData(decoded); // Guarda los datos decodificados en el estado
                } else {
                    setError('Token no válido o no se pudo decodificar.');
                }
            } catch (error) {
                console.error('Error al decodificar el token:', error);
                setError('Error al decodificar el token.');
            }
        } else {
            setUserData(null); // Limpia los datos si no hay usuario
            setError(null); // Limpia cualquier error
        }
    }, [user, decodeToken]);

    const navigate = useNavigate(); // Inicializa el hook useNavigate

    // Verifica si el usuario tiene el rol de administrador
    const isAdmin = userData?.rol === 'Administrator';

    const handleCreateMenu = () => {
        navigate('/create-menu'); // Reemplaza '/crear-menu' con la ruta donde se crea el menú
    };

    return (
        <div className="menu-layout"> {/* Contenedor principal */}
            <div className="menu-content"> {/* Contenedor para el contenido del menú */}
                <img src={BannerBackground} alt="Banner" className="banner-image" />
                <AvailableMenu />
                <h2>Lista de Menús</h2>
                <MenuList  isAdmin = {isAdmin} />
                
                {/* Botón para crear un nuevo menú, solo visible si el usuario es admin */}
                {isAdmin && (
                    <button onClick={handleCreateMenu} className="create-menu-button">
                        Crear Menú
                    </button>
                )}
            </div>
        </div>
    );
};

export default MenuLayout;
