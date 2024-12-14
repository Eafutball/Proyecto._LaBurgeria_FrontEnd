import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ComboService from "../../services/ComboServices";
import ComboGrid from "./ComboGrid"; // Asegúrate de que ComboGrid esté correctamente implementado
import "./LayoutCombos.css";
import Footer from "../Footer";
import BannerBackground from "../../assets/home-banner-background.png";
import { useUser } from "../../Hooks/useUser";

// Custom hook para manejar la carga de combos
const useCombos = () => {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const { combos } = await ComboService.getAllCombos();
        setCombos(combos); // Asegúrate de que la estructura del JSON tenga un campo `combos`
      } catch (err) {
        console.error("Error fetching combos:", err);
        setError("No se pudieron cargar los combos. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchCombos();
  }, []);

  return { combos, loading, error };
};

const LayoutCombos = () => {
  const { combos, loading, error } = useCombos(); // Uso del custom hook
  const { user, decodeToken } = useUser(); // Usamos el hook para obtener los datos del usuario
  const [isAdmin, setIsAdmin] = useState(false); // Variable booleana para verificar si el usuario es admin
  const [role, setRole] = useState(null); // Almacenamos el rol decodificado

  // **Efecto para decodificar el token y establecer isAdmin**
  useEffect(() => {
    if (user) {
      try {
        const decoded = decodeToken(); // Decodifica el token
        console.log('Token decodificado:', decoded);
        if (decoded && decoded.rol === "Administrador") {
          setIsAdmin(true); // Si el rol es admin, establecemos isAdmin como true
          setRole(decoded.rol); // Guardamos el rol
        } else {
          setIsAdmin(false); // Si no es admin, establecemos isAdmin como false
          setRole(decoded.rol); // Guardamos el rol (puede ser otro rol o null)
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        setIsAdmin(false); // Si ocurre un error al decodificar el token, no es admin
        setRole(null); // Si hay error al decodificar, no se muestra rol
      }
    } else {
      setIsAdmin(false); // Si no hay usuario, no es admin
      setRole(null); // No hay rol
    }
  }, [user, decodeToken]);

  // Función para renderizar el contenido basado en el estado
  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-spinner">
          <p>Cargando combos...</p>
          {/* Puedes agregar un spinner aquí */}
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-message">
          <p>{error}</p>
        </div>
      );
    }

    if (combos.length === 0) {
      return <p>No hay combos disponibles en este momento.</p>;
    }

    return <ComboGrid combos={combos} isAdmin={isAdmin} />;
  };

  return (
    <div className="layout-combos">
      <img src={BannerBackground} alt="Banner" className="banner-image" />
      <header className="layout-header">
        <h1>Nuestra Selección de Combos</h1>
        <p>Descubre nuestros combos especiales.</p>

        {/* Mostrar nombre de usuario si está logueado */}
        {user ? (
          <p>Hola, {role}!</p> // Muestra el rol del usuario si está logueado
        ) : (
          <p>Bienvenido, visitante. Por favor, inicie sesión.</p>
        )}

        {/* Botón de crear combo solo si el usuario es administrador */}
        {isAdmin && (
          <Link to="/create-combo" className="create-combo-button">
            Crear Combo
          </Link>
        )}
      </header>

      <main className="layout-main">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default LayoutCombos;
