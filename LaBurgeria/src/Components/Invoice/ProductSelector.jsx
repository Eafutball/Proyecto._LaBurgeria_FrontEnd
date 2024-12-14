import React, { useState, useEffect } from 'react';
import { Typography, Grid, Paper, CardActions, Button, CardContent, Card } from '@mui/material';
import ComboServices from '../../services/ComboServices';
import ProductServices from '../../services/ProductServices';
import { useCart } from '../../Hooks/useCart';

const ProductSelector = () => {
  const [productos, setProductos] = useState([]);
  const [combos, setCombos] = useState([]);
  const [error, setError] = useState(null); // Estado para manejar errores
  const { cart, addToCart, removeFromCart } = useCart();

  // Cargar productos y combos
  useEffect(() => {
    const fetchProductsAndCombos = async () => {
      try {
        const productResponse = await ProductServices.getFullProductList();
        setProductos(productResponse.data);

        const comboResponse = await ComboServices.getAllCombos();
        setCombos(comboResponse.combos);
      } catch (error) {
        console.error('Error fetching products or combos:', error);
        setError('Hubo un problema al cargar los productos o combos. Por favor, inténtalo más tarde.');
      }
    };

    fetchProductsAndCombos();
  }, []);

  // Verifica si un producto/combo ya está en el carrito
  const isInCart = (item) => {
    return cart.some(
      (cartItem) =>
        (cartItem.ProductoID && cartItem.ProductoID === item.ProductoID) ||
        (cartItem.ComboID && cartItem.ComboID === item.ComboID)
    );
  };

  // Renderizar las tarjetas de productos o combos
  const renderItems = (items, label, isCombo = false) => (
    <div style={{ marginBottom: '16px' }}>
      <Typography variant="h6" gutterBottom>{label}</Typography>
      <Grid container spacing={2}>
        {items.map((item) => {
          const inCart = isInCart(item);
          return (
            <Grid item xs={12} sm={6} md={4} key={item.ProductoID || item.ComboID}>
              <Card variant="outlined" sx={{ position: 'relative' }}>
                <CardContent>
                  <Typography variant="h6">{item.Nombre}</Typography>
                  <Typography variant="body2">Precio: ${item.Precio}</Typography>
                  {inCart && <Typography variant="caption" color="green">En el carrito</Typography>}
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color={inCart ? 'secondary' : 'primary'}
                    onClick={() =>
                      inCart ? removeFromCart(item) : addToCart(item, isCombo)
                    }
                  >
                    {inCart ? 'Eliminar' : 'Agregar'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );

  // Renderizar contenido del carrito
  const renderCart = () => (
    <Paper elevation={2} sx={{ padding: 2, marginTop: 3 }}>
      <Typography variant="h6" gutterBottom>
        Contenido del Carrito
      </Typography>
      {cart.length === 0 ? (
        <Typography variant="body2">El carrito está vacío.</Typography>
      ) : (
        <Grid container spacing={2}>
          {cart.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Paper elevation={1} sx={{ padding: 2 }}>
                <Typography variant="body1">
                  {item.Nombre} - ${item.Precio} x {item.cantidad}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );

  // Render principal
  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Seleccionar Productos y Combos
      </Typography>
      {error ? (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      ) : (
        <>
          {renderItems(productos, 'Productos')}
          {renderItems(combos, 'Combos', true)}
          {renderCart()}
        </>
      )}
    </Paper>
  );
};

export default ProductSelector;
