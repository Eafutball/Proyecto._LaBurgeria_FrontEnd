import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import "./ProductItem.css"; // Asegúrate de importar el archivo CSS

const ProductItem = ({ product, isAdminOrCocina }) => {
    const navigate = useNavigate(); // Inicializar el hook

    // Si el producto no existe, mostrar un mensaje de error
    if (!product) {
        return <div className="error-message">Error: Producto no disponible</div>;
    }

    const FRONTEND_URL = "http://localhost:5173";
    const BASE_URL = "http://localhost:81/LaBurgeria";
    const NOT_FOUND_IMAGE = 'http://localhost:5173/NotFound.png';
    
    // Helper function for image URL
    const getImageUrl = (image) => {
      if (!image || image.trim() === '') {
        return NOT_FOUND_IMAGE;
      }
      return image.startsWith('/public/')
        ? `${FRONTEND_URL}${image}`
        : `${BASE_URL}/${image}`;
    };
    
    // Desestructuración para mayor claridad y validación de propiedades
    const { img, nombre, pasos, precio, est } = product;

    // Función para formatear el precio (se puede mejorar para mostrar el precio con dos decimales o formato local)
    const formatPrice = (price) => price.toFixed(2);

    // Función para manejar la navegación al proceso de actualización
    const handleNavigate = () => {
        navigate(`/update-process/${product.id}`); // Ajusta la ruta según tu aplicación
    };

    return (
        <div className="product-item-container">
            <div className="flip-card">
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <div className="image-container">
                            <img
                                src={getImageUrl(img)} // Utiliza la función getImageUrl para obtener la URL correcta
                                alt={nombre}
                                className="product-image"
                            />
                        </div>
                        <div className="info-container">
                            <h3 className="product-name">{nombre}</h3>
                            <p className="product-price">Precio: ${formatPrice(precio)}</p>
                        </div>
                    </div>
                    <div className="flip-card-back">
                        <div className="back-info-container">
                            <h4>Total de Pasos: {pasos}</h4>
                            {est && est.length > 0 && (
                                <div className="stations-container">
                                    <h4>Estaciones:</h4>
                                    <ul className="stations-list">
                                        {est.map((estacion) => (
                                            <li key={estacion.EstacionID} className="station-item">
                                                {estacion.nombre}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Mostrar el botón de actualización solo si es un administrador */}
            {isAdminOrCocina && (
                <div className="admin-buttons-container">
                    <button
                        className="update-button"
                        onClick={handleNavigate}
                        aria-label={`Actualizar proceso para ${nombre}`} // Mejora de accesibilidad
                    >
                        Actualizar Proceso
                    </button>
                </div>
            )}
        </div>
    );
};

ProductItem.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.string.isRequired,
        nombre: PropTypes.string.isRequired,
        precio: PropTypes.number.isRequired,
        img: PropTypes.string,
        pasos: PropTypes.number.isRequired,
        est: PropTypes.arrayOf(
            PropTypes.shape({
                EstacionID: PropTypes.string.isRequired,
                nombre: PropTypes.string.isRequired,
            })
        ).isRequired,
    }).isRequired,
    isAdminOrCocina: PropTypes.bool.isRequired, // Validar si el prop isAdmin es un booleano
};

export default ProductItem;
