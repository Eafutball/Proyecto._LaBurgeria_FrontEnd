import React from 'react';
import PropTypes from 'prop-types';
import ProductItem from './ProductItem';
import './ProductList.css'; // Importar los estilos

const ProductList = ({ products, isAdminOrCocina }) => {
  if (!products || products.length === 0) {
    return (
      <div className="no-products-container">
        <p>No hay productos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h2>Lista de Productos</h2>
      </div>
      <div className="product-list">
        {products.map((product) => {
          // Verificar que el producto tenga la propiedad 'producto'
          if (!product) {
            console.error("Producto no válido:", product);
            return <div key={Math.random()} className="error-message">Error: Producto no válido</div>;
          }
          return (
            <div className="product-item-wrapper" key={product.ProductoID}>
              <ProductItem product={product} isAdminOrCocina={isAdminOrCocina} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// PropTypes para validar las propiedades
ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      producto: PropTypes.shape({
        ProductoID: PropTypes.string.isRequired,
        Nombre: PropTypes.string.isRequired,
        Descripción: PropTypes.string.isRequired,
        Precio: PropTypes.number.isRequired,
        Categoria: PropTypes.string.isRequired,
        Imagen: PropTypes.string.isRequired,
      }).isRequired,
      total_pasos: PropTypes.number.isRequired,
      estaciones: PropTypes.arrayOf(
        PropTypes.shape({
          EstacionID: PropTypes.string.isRequired,
          nombre: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  isAdminOrCocina: PropTypes.bool.isRequired, // Validar el tipo de 'isAdmin'
};

export default ProductList;
