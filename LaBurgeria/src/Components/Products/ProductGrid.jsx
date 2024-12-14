import React from 'react';
import Grid from '@mui/material/Grid';
import ProductCard from './ProductCard'; 
import PropTypes from 'prop-types';
import './ProductGrid.css'; 
import { CartProvider } from '../../Context/CartContext';

const ProductGrid = ({ products, isAdmin }) => {
  return (
    <CartProvider>
      <Grid container spacing={3} style={{ padding: '20px' }}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.ProductoID}>
            <ProductCard product={product} isAdmin={isAdmin} /> {/* Pasar isAdmin a ProductCard */}
          </Grid>
        ))}
      </Grid>
    </CartProvider>
  );
};

// Definición de PropTypes para validar las props
ProductGrid.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      ProductoID: PropTypes.string.isRequired,
      Nombre: PropTypes.string.isRequired,
      Descripción: PropTypes.string.isRequired,
      Precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Aceptar número también
      Imagen: PropTypes.string.isRequired,
      categoria: PropTypes.string.isRequired,
    })
  ).isRequired,
  isAdmin: PropTypes.bool.isRequired,  // Definir isAdmin como prop booleana
};

export default ProductGrid;
