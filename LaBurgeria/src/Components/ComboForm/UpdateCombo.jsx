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
import 'react-toastify/dist/ReactToastify.css';
import ComboService from '../../services/ComboServices';
import ProductServices from '../../services/ProductServices';
import { useParams } from 'react-router-dom';
import './UpdateCombo.css';
import BannerBackground from '../../assets/home-banner-background.png';


const UpdateCombo = () => {
  const { comboID } = useParams();
  const [comboData, setComboData] = useState({
    ComboID: comboID,
    Nombre: '',
    Precio: '',
    Descripcion: '',
    productos: [], // IDs de productos
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductServices.getFullProductList();
        if (response.success) {
          setProducts(response.data); // Guarda lista completa de productos
        } else {
          toast.error('No se pudieron cargar los productos.');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        toast.error('Error al cargar los productos.');
      }
    };

    const fetchComboDetails = async () => {
        try {
          const response = await ComboService.getComboInfo(+comboID);
          
          // Verifica si los datos necesarios están presentes en la respuesta
          if (response && response.ComboID) {
            setComboData((prevData) => ({
              ...prevData,
              Nombre: response.nombre,
              Precio: response.precio,
              Descripcion: response.descripcion || 'Descripción no disponible',
              productos: response.productos.map(product => product.ProductoID), // Solo IDs de productos
            }));
          } else {
            toast.error('Combo no encontrado.');
          }
        } catch (err) {
          console.error('Error fetching combo details:', err);
          toast.error('Error al cargar los detalles del combo.');
        }
      };
      

    fetchProducts();
    fetchComboDetails();
  }, [comboID]);

  const handleChange = ({ target: { name, value } }) => {
    setComboData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleProductChange = (e) => {
    const { value } = e.target; // `value` ya es un arreglo
    setComboData((prevState) => ({
      ...prevState,
      productos: value, // Actualiza con el nuevo valor
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedComboData = {
        ComboID: comboData.ComboID,
        Nombre: comboData.Nombre,
        Descripción: comboData.Descripcion,
        Precio: comboData.Precio,
        productos: comboData.productos, // IDs de productos seleccionados
    };

    console.log('Combo Data before update:', JSON.stringify(updatedComboData, null, 2)); // Verifica el contenido de comboData

    try {
        const result = await ComboService.updateCombo(updatedComboData);
        console.log(result);
        toast.success(`Combo ${result.Nombre} actualizado exitosamente!`);
    } catch (error) {
        console.error('Update error:', error);
        toast.error(error.message || 'Error al actualizar el combo.');
    } finally {
        setLoading(false);
    }
};



  // Crear un mapa para una búsqueda más eficiente de productos
  const productMap = new Map(products.map(product => [product.ProductoID, product.Nombre]));

  return (
    <>
          <img src={BannerBackground} alt="Banner" className="banner-image" />

      <Typography variant="h5" gutterBottom>
        Actualizar Combo
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre del Combo"
          variant="outlined"
          fullWidth
          margin="normal"
          name="Nombre"
          value={comboData.Nombre}
          onChange={handleChange}
          required
        />
        <TextField
          label="Precio"
          variant="outlined"
          type="number"
          fullWidth
          margin="normal"
          name="Precio"
          value={comboData.Precio}
          onChange={handleChange}
          required
        />
        <TextField
          label="Descripción"
          variant="outlined"
          fullWidth
          margin="normal"
          name="Descripcion"
          value={comboData.Descripcion}
          onChange={handleChange}
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="select-products-label">Selecciona los productos</InputLabel>
          <Select
            labelId="select-products-label"
            multiple
            value={comboData.productos} // IDs de productos seleccionados
            onChange={handleProductChange}
            renderValue={(selected) => (
              <div>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={productMap.get(value) || value}
                  />
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

        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar Combo'}
        </Button>
      </form>

      <ToastContainer />
    </>
  );
};

export default UpdateCombo;
