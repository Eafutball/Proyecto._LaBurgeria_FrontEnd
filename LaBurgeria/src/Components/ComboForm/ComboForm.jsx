import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles from react-toastify
import ComboService from '../../services/ComboServices';
import ProductServices from '../../services/ProductServices';
import BannerBackground from '../../assets/home-banner-background.png';
import './ComboForm.css'; // Import the CSS file

const ComboForm = () => {
  const [comboID, setComboID] = useState(Math.floor(Math.random() * 10000)); // Generate random ComboID
  const [comboName, setComboName] = useState('');
  const [comboPrice, setComboPrice] = useState('');
  const [comboDescription, setComboDescription] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductServices.getFullProductList();
        if (response.success) {
          setProducts(response.data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        toast.error('Error fetching products.'); // Show error message with toast
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if(comboPrice < 0 ){
      toast.error("El precio debe ser mayor a 0")
      setLoading(false);
      return;
    }

    const comboData = {
      ComboID: comboID, // Use random ComboID
      Nombre: comboName,
      Precio: parseFloat(comboPrice),
      Descripción: comboDescription,
      productos: selectedProducts,
    };

    try {
      const result = await ComboService.createCombo(comboData);
      toast.success(`Combo ${result.Nombre} creado exitosamente!`); // Show success message with toast
      
      // Reset the form
      setComboName('');
      setComboPrice('');
      setComboDescription('');
      setSelectedProducts([]);

      // Generate a new random ComboID for the next combo
      setComboID(Math.floor(Math.random() * 10000));
    } catch (err) {
      toast.error(err.message); // Show error message with toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <img src={BannerBackground} alt="Banner" className="banner-image" />

      <div>
        <Typography variant="h5" gutterBottom>
          Registrar Combo
        </Typography>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="Nombre del Combo"
            variant="outlined"
            fullWidth
            margin="normal"
            value={comboName}
            onChange={(e) => setComboName(e.target.value)}
            required
          />
        </div>
        <div>
          <TextField
            label="Precio"
            variant="outlined"
            type="number"
            fullWidth
            margin="normal"
            value={comboPrice}
            onChange={(e) => setComboPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <TextField
            label="Descripción"
            variant="outlined"
            fullWidth
            margin="normal"
            value={comboDescription}
            onChange={(e) => setComboDescription(e.target.value)}
            required
          />
        </div>

        {/* Product Selection Section */}
        <div>
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-products-label">Selecciona los productos</InputLabel>
            <Select
              labelId="select-products-label"
              multiple
              value={selectedProducts}
              onChange={(e) => setSelectedProducts(e.target.value)}
              renderValue={(selected) => (
                <div>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </div>
              )}
            >
              {products.map((product) => (
                <MenuItem key={product.ProductoID} value={product.ProductoID}>
                  {product.Nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Submit Button */}
        <div>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar Combo'}
          </Button>
        </div>
      </form>

      <ToastContainer /> {/* Container for toasts */}
    </div>
  );
};

export default ComboForm;
