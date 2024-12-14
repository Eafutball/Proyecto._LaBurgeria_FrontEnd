import React, { useEffect, useState } from "react";
import BannerBackground from "../Assets/home-banner-background.png";
import BannerImage from "../Assets/HamburguesaBanner.png";
import { FiArrowRight } from "react-icons/fi";
import Footer from "./Footer";
import "./Home.css";
import { useUser } from "../Hooks/useUser";
import AvailableMenu from './Menu/AvaliableMenu';

const Home = () => {
    const { user, decodeToken } = useUser();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    // Actualizamos userData cuando el usuario cambia
    useEffect(() => {
        if (user) {
            try {
                const decoded = decodeToken();
                if (decoded) {
                    setUserData(decoded);
                } else {
                    setError("Token no válido o no se pudo decodificar.");
                }
            } catch (error) {
                setError("Error al decodificar el token.");
            }
        } else {
            setUserData(null);
            setError(null);
        }
    }, [user, decodeToken]);

    // Manejo de errores si el token no pudo ser decodificado
    if (error) {
        return (
            <div className="error-container">
                <h2>Error: {error}</h2>
            </div>
        );
    }

    // Mensaje de bienvenida en función de si hay un usuario
    const welcomeMessage = userData
        ? `¡Bienvenido, ${userData.rol}!`
        : "¡Bienvenido a La Burgueria! Estamos felices de que estés aquí.";

    return (
        <div className="home-container">
            <div className="home-banner-container">
                <div className="home-bannerImage-container">
                    <img
                        src={BannerBackground}
                        alt="Fondo de hamburguesas deliciosas"
                        loading="lazy"
                        className="home-banner-background"
                    />
                </div>

                <div className="home-text-section">
                    <div className="primary-heading-container">
                        <h1 className="primary-heading">
                            ¡Las Mejores Hamburguesas Hechas Solo para Ti!
                        </h1>
                    </div>

                    <div className="primary-text-container">
                        <p className="primary-text">
                            En La Burgueria, preparamos hamburguesas irresistibles con los ingredientes más frescos. 
                            Nuestros chefs elaboran cada hamburguesa a la perfección, asegurando una experiencia 
                            deliciosa en cada bocado. ¡Únete a nosotros para disfrutar de calidad y sabor!
                        </p>
                    </div>

                    {/* Mostrar mensaje de bienvenida dinámico */}
                    <div className="welcome-message-container">
                        <p className="welcome-message">
                            {welcomeMessage}
                        </p>
                    </div>

                    <div className="button-container">
                        <button className="secondary-button">
                            Ordena Ahora <FiArrowRight />
                        </button>
                    </div>
                </div>

                <div className="home-image-section">
                    <img
                        src={BannerImage}
                        alt="Hamburguesa deliciosa"
                        loading="lazy"
                        className="home-banner-image"
                    />
                </div>
            </div>

            {/* Mostramos el menú disponible */}
            <AvailableMenu />

            {/* Pie de página */}
            <Footer />
        </div>
    );
};

export default Home;
