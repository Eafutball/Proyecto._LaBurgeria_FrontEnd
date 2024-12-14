// ProductSection.js
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./ProductSection.css"; // Asegúrate de que la ruta sea correcta
import MenuServices from "../../services/MenuServices"; // Asegúrate de que la ruta sea correcta

const ProductSection = ({ menuID }) => {
  const FRONTEND_URL = "http://localhost:5173";
  const BASE_URL = "http://localhost:81/LaBurgeria";
  const NOT_FOUND_IMAGE = 'http://localhost:5173/NotFound.png';

  const [productos, setProductos] = useState([]); // Estado para almacenar los productos
  const [filteredProducts, setFilteredProducts] = useState([]); // Estado para almacenar los productos filtrados
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const [selectedCategory, setSelectedCategory] = useState(""); // Estado para la categoría seleccionada

  // Función para cargar productos
  const loadProducts = async () => {
    if (menuID) {
      try {
        const productsData = await MenuServices.fetchProductsByMenu(menuID);
        // Asegúrate de que productsData es un array
        if (Array.isArray(productsData)) {
          setProductos(productsData); // Almacenar todos los productos en el estado
          setFilteredProducts(productsData); // Inicialmente mostrar todos los productos
        } else {
          throw new Error("La respuesta no es un array.");
        }
      } catch (error) {
        setError(error.message); // Manejar el error
      } finally {
        setLoading(false); // Cambiar el estado de carga
      }
    }
  };

  useEffect(() => {
    loadProducts(); // Cargar productos al cambiar el menuID
  }, [menuID]); // Dependencia en menuID

  // Función para manejar el cambio de la categoría seleccionada
  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);

    // Filtrar productos según la categoría seleccionada
    const filtered = selected
      ? productos.filter((producto) => producto.CategoriaNombre === selected)
      : productos; // Si no hay categoría seleccionada, mostrar todos los productos

    setFilteredProducts(filtered);
  };

  // Obtener las categorías únicas de los productos
  const categorias = [
    ...new Set(productos.map((producto) => producto.CategoriaNombre)),
  ];

  // Agrupar productos por categoría
  const groupedProducts = filteredProducts.reduce((acc, producto) => {
    const categoryID = producto.CategoríaID; // Usar la ID de categoría para agrupar

    if (!acc[categoryID]) {
      acc[categoryID] = {
        categoriaID: categoryID,
        categoriaNombre: producto.CategoriaNombre, // Nombre de la categoría
        productos: [],
      };
    }
    acc[categoryID].productos.push(producto);
    return acc;
  }, {});

  // Función para renderizar un producto
  const renderProduct = (producto) => {
    // Construir la URL de la imagen
    const imageURL = (() => {
      if (producto.Imagen && producto.Imagen.trim() !== '') {
        return producto.Imagen.startsWith('/public/')
          ? `${FRONTEND_URL}${producto.Imagen}`
          : `${BASE_URL}/${producto.Imagen}`;
      }
      return NOT_FOUND_IMAGE; // Usar imagen por defecto si no hay imagen
    })();


    

    return (
      <div key={producto.ProductoID} className="product-item">
        <div className="product-image-container">
          <img
            src={imageURL} // Usar la URL de la imagen construida aquí
            alt={producto.Nombre}
            className="product-image"
          />
        </div>
        <div className="product-details">
          <div className="product-name">{producto.Nombre}</div>
          <div className="product-category">{producto.CategoriaNombre}</div>
          <div className="product-price">Precio: ${producto.Precio}</div>
        </div>
      </div>
    );
  };

  return (
    <section className="product-section" aria-labelledby="product-list">
      <div className="product-section-content">
        {loading ? (
          <div className="loading-container">
            <p>Cargando productos...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>Error: {error}</p>
          </div>
        ) : Object.keys(groupedProducts).length > 0 ? (
          <>
            <h2 className="product-section-title">Lista de Productos</h2>

            {/* Selector de categorías */}
            <div className="filter-wrapper">
              <div className="filter-header">
                <h2>Filtrar Menús</h2>
              </div>
              <div className="filter-body">
                <div className="filter-container">
                  <div className="label-container">
                    <label htmlFor="category-select">
                      Filtrar por categoría:{" "}
                    </label>
                  </div>
                  <div className="select-container">
                    <select
                      id="category-select"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      className="category-select"
                    >
                      <option value="">Todas las categorías</option>
                      {categorias.map((categoria) => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="product-list">
              {Object.values(groupedProducts).flatMap(({ productos }) =>
                productos.map(renderProduct)
              )}
            </div>
          </>
        ) : (
          <div className="no-products">No hay productos disponibles.</div>
        )}
      </div>
    </section>
  );
};

// Validación de propiedades
ProductSection.propTypes = {
  menuID: PropTypes.string.isRequired,
};

export default ProductSection;
