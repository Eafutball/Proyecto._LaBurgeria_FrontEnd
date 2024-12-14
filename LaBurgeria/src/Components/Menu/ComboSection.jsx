// ComboSection.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./ComboSection.css"; // Asegúrate de que la ruta sea correcta
import MenuServices from "../../services/MenuServices";

const ComboSection = ({ menuID }) => {
  const FRONTEND_URL = "http://localhost:5173"; // URL del frontend
  const BASE_URL = "http://localhost:81/LaBurgeria"; // URL del backend
  const NOT_FOUND_IMAGE = 'http://localhost:5173/NotFound.png'; // Imagen por defecto

  const [combos, setCombos] = useState([]); // Inicializa combos como un array vacío
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  // Función para cargar combos
  const loadCombos = async () => {
    console.log('Cargando combos para el menuID:', menuID); // Log del menuID
    if (menuID) {
      try {
        const combosData = await MenuServices.fetchCombosByMenu(menuID);
        console.log('Datos recibidos de la API:', combosData); // Log de los datos recibidos
        // Asegúrate de que combosData es un array
        if (Array.isArray(combosData)) {
          setCombos(combosData); // Almacenar combos en el estado
          console.log('Combos almacenados en el estado:', combosData); // Log de los combos almacenados
        } else {
          throw new Error("La respuesta no es un array.");
        }
      } catch (error) {
        setError(error.message); // Manejar el error
        console.error('Error al cargar combos:', error); // Log de error
      } finally {
        setLoading(false); // Cambiar el estado de carga
      }
    }
  };

  useEffect(() => {
    loadCombos(); // Cargar combos al cambiar el menuID
  }, [menuID]); // Dependencia en menuID

  // Función para construir la URL de la imagen
  const buildImageURL = (imagen) => {
    if (imagen && imagen.trim() !== '') {
      return imagen.startsWith('/public/')
        ? `${FRONTEND_URL}${imagen}`
        : `${BASE_URL}/${imagen}`;
    }
    return NOT_FOUND_IMAGE; // Usar imagen por defecto si no hay imagen
  };

  // Función para renderizar un combo
  const renderCombo = (combo) => (
    <div key={combo.ComboID} className="combo-item">
      <div className="combo-image-container">
        <img
          src={buildImageURL(combo.imagen)} // Usar la función para obtener la URL de la imagen
          alt={combo.Nombre}
          className="combo-image"
        />
      </div>
      <div className="combo-details">
        <div className="combo-name">{combo.Nombre}</div>
        <div className="combo-price">Precio: ${combo.Precio}</div>
        <div className="combo-description">{combo.Descripción}</div>
      </div>
    </div>
  );

  return (
    <section className="combo-section" aria-labelledby="combo-list">
      <div className="combo-section-content">
        {loading ? (
          <div className="loading-container">
            <p>Cargando combos...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>Error: {error}</p>
          </div>
        ) : combos.length > 0 ? (
          <>
            <h2 className="combo-section-title">Lista de Combos</h2>
            <div className="combo-list">
              {combos.map(renderCombo)} {/* Asegúrate de que combos sea un array */}
            </div>
          </>
        ) : (
          <div className="no-combos">No hay combos disponibles.</div>
        )}
      </div>
    </section>
  );
};

// Validación de propiedades
ComboSection.propTypes = {
  menuID: PropTypes.string.isRequired,
};

export default ComboSection;
