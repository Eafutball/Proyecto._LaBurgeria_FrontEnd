import React, { useState, useEffect } from 'react';
import { Button, Typography, CircularProgress, Grid, Box, Card, CardContent, CardActions } from '@mui/material';
import { toast } from 'react-toastify';
import ProductServices from '../../services/ProductServices';
import MenuServices from '../../services/MenuServices';
import PropTypes from 'prop-types';

const InsertProduct = ({ menuID }) => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [productsList, setProductsList] = useState([]);

    const fetchProducts = async () => {
        console.log("Starting product fetch..."); // Log for starting fetch
        setLoading(true);
        setError(null);
        try {
            const response = await ProductServices.getFullProductList();
            console.log("Fetched products:", response.data); // Log the fetched products
            setProductsList(response.data);
        } catch (err) {
            console.error('Error fetching products:', err);
            const errorMessage = 'Error fetching products.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
            console.log("Product fetch completed."); // Log for completion
        }
    };

    useEffect(() => {
        console.log("Component mounted, fetching products...");
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted, inserting products:", selectedProducts); // Log the selected products
        setLoading(true); // Indica que la carga ha comenzado
    
        try {
            // Verifica que haya productos seleccionados antes de proceder
            if (selectedProducts.length === 0) {
                const message = "No products selected for insertion.";
                toast.error(message);
                console.warn(message);
                return; // Salir si no hay productos
            }
    
            // Mapea los IDs de los productos asegurando que sean números
            const productIDs = selectedProducts.map(product => {
                const id = Number(product.ProductoID);
                return isNaN(id) ? 0 : id; // Cambia a 0 si no es un número válido
            });


            console.log("Prepared product IDs for insertion:", productIDs); // Log para los IDs preparados

    
            // Realiza la inserción de productos
            const response = await MenuServices.insertProducts({
                MenúID: menuID,
                Productos: productIDs,
            });
            
            console.log("Insert response:", response.data); // Log the response from insert
            toast.success("Products inserted successfully!");
            resetForm(); // Resetea el formulario después de una inserción exitosa
        } catch (error) {
            console.error('Error inserting products:', error); // Log error details
            const { response } = error; // Destructura para obtener la respuesta del error
            const errorMessage = response?.data?.error || "Error inserting products.";
            setError(errorMessage); // Establece el mensaje de error
            toast.error(errorMessage); // Muestra el mensaje de error al usuario
        } finally {
            setLoading(false); // Indica que la carga ha finalizado
            console.log("Insert products process completed."); // Log for completion
        }
    };
    

    const resetForm = () => {
        console.log("Resetting form..."); // Log for reset action
        setSelectedProducts([]);
    };

    const toggleProductSelection = (product) => {
        console.log(`Toggling selection for product: ${product.Nombre}`); // Log the product being toggled
        setSelectedProducts(prevSelected =>
            prevSelected.includes(product)
                ? prevSelected.filter(item => item !== product)
                : [...prevSelected, product]
        );
    };

    return (
        <div>
            {loading && <CircularProgress />}
            <form onSubmit={handleSubmit}>
                <div>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box mb={2}>
                                <Typography variant="h6">Select Products</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </div>
                <div>
                    <Grid container spacing={2}>
                        {productsList.map(product => (
                            <Grid item xs={12} sm={6} md={4} key={product.ProductID}>
                                <Card
                                    variant="outlined"
                                    onClick={() => toggleProductSelection(product)}
                                    sx={{
                                        cursor: 'pointer',
                                        border: selectedProducts.includes(product) ? '2px solid #3f51b5' : 'none',
                                        transition: 'border 0.3s',
                                        '&:hover': {
                                            border: '2px solid #3f51b5',
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6">{product.Nombre}</Typography>
                                        <Typography color="textSecondary">{product.Descripcion}</Typography>
                                        <Typography variant="body1">${product.Precio}</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small">{selectedProducts.includes(product) ? 'Selected' : 'Select'}</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>
                <div>
                    <Grid item xs={12}>
                        <Box mt={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading || selectedProducts.length === 0}
                            >
                                Insert Products
                            </Button>
                        </Box>
                    </Grid>
                </div>
                {error && (
                    <div>
                        <Box mt={2}>
                            <Typography color="error">{error}</Typography>
                        </Box>
                    </div>
                )}
            </form>
        </div>
    );
};

InsertProduct.propTypes = {
    menuID: PropTypes.number.isRequired,
};

export default InsertProduct;
