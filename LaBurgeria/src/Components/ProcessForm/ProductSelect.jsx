import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select'; // Importa React Select
import ProductServices from '../../services/ProductServices';
import './ProductSelect.css'; // Estilos del formulario

const ProductSelect = ({ selectedProduct, setSelectedProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productProperties, setProductProperties] = useState(null); // Estado para las propiedades del producto

  const loadProducts = async () => {
    try {
      const response = await ProductServices.getFullProductList();
      console.log('Productos cargados:', response); // Log the full product list

      // Check if the response indicates success and contains data
      if (response.success && Array.isArray(response.data)) {
        setProducts(
          response.data.map(product => ({
            value: product.ProductoID,
            label: product.Nombre,
          }))
        ); // Mapea a formato adecuado
      } else {
        throw new Error('La respuesta no contiene una lista de productos válida');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar productos:', err); // Log the error details
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // Verifica si ya hay un producto seleccionado
    if (selectedProduct) {
      // Busca el producto en la lista
      const product = products.find(p => p.value === selectedProduct);
      if (product) {
        // Aquí puedes obtener propiedades específicas del producto si es necesario
        // Por ejemplo, podrías hacer una llamada para obtener detalles específicos
        setProductProperties({
          id: product.value,
          name: product.label,
          // Aquí puedes agregar otras propiedades que necesites
        });
        console.log('Producto seleccionado:', product); // Log del producto seleccionado
      } else {
        // Si el producto no se encuentra, puedes manejarlo como desees
        setProductProperties(null);
      }
    }
  }, [selectedProduct, products]); // Dependencias para que se ejecute cuando cambie selectedProduct o products

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Encuentra la opción seleccionada basada en el ID del producto seleccionado
  const selectedOption = products.find(product => product.value === selectedProduct);

  return (
    <div>
      <label htmlFor="product">Producto:</label>
      <Select
        id="product"
        value={selectedOption || null} // Establece la opción seleccionada según el ID del producto
        onChange={(option) => {
          const selectedValue = option ? option.value : null;
          setSelectedProduct(selectedValue); // Maneja el cambio
          console.log('Producto seleccionado:', {
            value: selectedValue,
            label: option ? option.label : 'Ninguno', // Incluye etiqueta o indica ninguno
          }); // Log de la opción seleccionada con más detalles
        }}
        options={products}
        placeholder="Selecciona un producto"
        isClearable // Permite limpiar la selección
      />
      {/* Aquí puedes mostrar las propiedades del producto si están disponibles */}
      {productProperties && (
        <div className="product-properties">
          <h4>Propiedades del Producto:</h4>
          <p>ID: {productProperties.id}</p>
          <p>Nombre: {productProperties.name}</p>
          {/* Aquí puedes agregar más propiedades si las tienes */}
        </div>
      )}
    </div>
  );
};

// Validaciones de props
ProductSelect.propTypes = {
  selectedProduct: PropTypes.string, // El producto seleccionado debe ser una cadena
  setSelectedProduct: PropTypes.func.isRequired, // setSelectedProduct debe ser una función
};

export default ProductSelect;
