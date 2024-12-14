import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './ProductCard.css';
import PedidoServices from '../../services/PedidoServices';
import { savePedidoToLocalStorage } from '../../constants/pedidoConstant';
import { useUser } from '../../Hooks/useUser';
import UserServices from '../../services/UserServices';
import ClientAutocomplete from '../Invoice/ClientAutocomplete';

const FRONTEND_URL = "http://localhost:5173";
const BASE_URL = "http://localhost:81/LaBurgeria";
const NOT_FOUND_IMAGE = 'http://localhost:5173/NotFound.png';

// Helper function for image URL
const getImageUrl = (image) => {
  if (!image || image.trim() === '') return NOT_FOUND_IMAGE;
  return image.startsWith('/public/') 
    ? `${FRONTEND_URL}${image}` 
    : `${BASE_URL}/${image}`;
};

const ProductCard = ({ product, isAdmin }) => {
  const [imageURL, setImageURL] = useState(NOT_FOUND_IMAGE);
  const [pedidoMessage, setPedidoMessage] = useState("");
  const [error, setError] = useState("");
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const { user, decodeToken } = useUser();
  const [userData, setUserData] = useState(null);
  const [loadingClientes, setLoadingClientes] = useState(false);  // Loading state for clients
  const [openDialog, setOpenDialog] = useState(false); // Dialog state

  // Decoding token and fetching user data
  useEffect(() => {
    if (user) {
      try {
        const decoded = decodeToken();
        setUserData(decoded || null);
      } catch (error) {
        setError("Error al decodificar el token.");
      }
    }
  }, [user, decodeToken]);

  // Fetch clients list if user is 'Encargado'
  useEffect(() => {
    const fetchClientes = async () => {
      if (userData?.rol === "Encargado") {
        setLoadingClientes(true);
        try {
          const response = await UserServices.getClientes();
          setClientes(response || []);
        } catch {
          setError("Error al obtener la lista de clientes.");
        } finally {
          setLoadingClientes(false);
        }
      }
    };

    fetchClientes();
  }, [userData]);

  // Update image URL when the product image changes
  useEffect(() => {
    setImageURL(getImageUrl(product.Imagen));
  }, [product.Imagen]);

  // Validating if product is correctly set
  const isValidProduct = Boolean(
    product?.ProductoID &&
    product?.Nombre &&
    product?.Precio !== undefined
  );

  if (!isValidProduct) {
    return <div className="error-message">Error: Producto no encontrado o datos incompletos</div>;
  }

  // Creating an order
  const createPedido = async () => {
    if (!selectedCliente && userData?.rol === "Encargado") {
      handleDialogOpen();
      return;
    }
      console.log(selectedCliente);
    const clienteID = userData?.rol === "Encargado" ? selectedCliente.PersonalID : userData.id;
    const json = JSON.stringify({ PersonalID: clienteID, encargado_asociado: userData?.rol === "Encargado"? userData.email : "No Especifica" });

    try {
      const response = await PedidoServices.createPedido(json);
      savePedidoToLocalStorage(response.pedido);
      setPedidoMessage("Pedido creado exitosamente.");
      setError(""); // Clear previous errors
    } catch {
      setPedidoMessage(""); // Clear success message
      setError("Error al crear el pedido. Intenta nuevamente.");
    }
  };

  // Handle dialog open/close
  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  return (
    <div className="product-card-container">
      <Card className="product-card" sx={{ maxWidth: 345, margin: "auto" }} elevation={3}>
        <CardMedia
          component="img"
          image={imageURL}
          alt={product.Nombre || "Imagen no disponible"}
          sx={{ height: 140 }}
        />
        <CardContent>
          <Typography variant="h5" component="div">{product.Nombre}</Typography>
          <Typography variant="body2" color="text.secondary">{product.Descripción}</Typography>
          <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold" }}>
            {product.Precio} €
          </Typography>

          <div className="button-container" style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
            <Link to={`/details/${product.ProductoID}`} style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary">Ver Detalles</Button>
            </Link>

            {isAdmin && (
              <>
                <Link to={`/update-product/${product.ProductoID}`} style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="secondary">Actualizar Producto</Button>
                </Link>

                {userData?.rol === "Encargado" && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleDialogOpen}
                    style={{ marginTop: 10 }}
                  >
                    Seleccionar Cliente
                  </Button>
                )}
              </>
            )}

            <Button variant="contained" color="primary" onClick={createPedido}>
              Realizar Pedido
            </Button>
          </div>

          {pedidoMessage && (
            <Typography variant="body2" color="success.main" style={{ marginTop: '10px' }}>
              {pedidoMessage}
            </Typography>
          )}
          {error && (
            <Typography variant="body2" color="error" style={{ marginTop: '10px' }}>
              {error}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Dialog for selecting a client */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Seleccionar Cliente</DialogTitle>
        <DialogContent>
          {loadingClientes ? (
            <CircularProgress />
          ) : (
            <ClientAutocomplete
              onClientSelect={setSelectedCliente}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Cancelar</Button>
          <Button onClick={createPedido} color="primary">Crear Pedido</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    ProductoID: PropTypes.string.isRequired,
    Nombre: PropTypes.string.isRequired,
    Descripción: PropTypes.string.isRequired,
    Precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    Imagen: PropTypes.string,
  }).isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default ProductCard;
