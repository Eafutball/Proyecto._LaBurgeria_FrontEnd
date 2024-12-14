import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import './ComboCard.css';
import PedidoServices from '../../services/PedidoServices';
import { savePedidoToLocalStorage } from '../../constants/pedidoConstant';
import ClientAutocomplete from '../Invoice/ClientAutocomplete';
import { useUser } from '../../Hooks/useUser';

const ComboCard = ({ combo, isAdmin }) => {
  const [pedidoMessage, setPedidoMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [cliente, setCliente] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar el loading
  const { user, decodeToken } = useUser();
  const [userData, setUserData] = useState(null);

  // Decoding token and checking user role
  useEffect(() => {
    if (user) {
      try {
        const decoded = decodeToken();
        console.log('Decoded token:', decoded); // Log decoded token
        if (decoded) {
          setUserData(decoded);
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }, [user, decodeToken]);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(combo.Precio);

  const createPedido = async () => {
    if (!cliente && userData?.rol === 'Encargado') {
      toast.error('Por favor, seleccione un cliente.');
      console.log('No cliente selected, aborting pedido creation');
      return;
    }

    setIsLoading(true);
    console.log('Creating pedido with client:', cliente); // Log the client selection

    try {
      const pedidoData = {
        PersonalID: userData?.rol === 'Encargado' ? cliente.PersonalID : userData.id,
        encargado_asociado: userData?.rol === 'Encargado' ? userData.email : 'No especificado',
      };

      console.log('Pedido Data:', pedidoData); // Log the data being sent to the API

      const response = await PedidoServices.createPedido(JSON.stringify(pedidoData));
      console.log('Pedido creation response:', response); // Log API response

      savePedidoToLocalStorage(response.pedido);
      setPedidoMessage('Pedido creado exitosamente.');
      console.log('Pedido created successfully:', response.pedido); // Log success message
      setOpenDialog(false); // Cierra el diálogo después de crear el pedido
    } catch (error) {
      toast.error('Error al crear el pedido.');
      console.error('Error al crear el pedido:', error); // Log the error
      setPedidoMessage('');
    } finally {
      setIsLoading(false); // Desactiva el estado de carga
    }
  };

  return (
    <Card className="product-card">
      {combo.imagen && (
        <CardMedia
          component="img"
          image={combo.imagen}
          alt={`Imagen de ${combo.Nombre}`}
          className="mouse"
        />
      )}
      <CardContent>
        <Typography variant="h5" component="h3" className="product-name">
          {combo.Nombre}
        </Typography>
        <Typography variant="body2" className="product-description">
          {combo.Descripción}
        </Typography>
        <Typography variant="h6" className="price">
          {formattedPrice}
        </Typography>
        <div className="button-container">
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/detailsCombo/${combo.ComboID}`}
            className="product-button"
            aria-label={`Ver detalles del combo ${combo.Nombre}`}
          >
            Ver Detalles
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="product-button"
            onClick={() => setOpenDialog(true)}
            aria-label={`Realizar pedido del combo ${combo.Nombre}`}
          >
            Realizar Pedido
          </Button>

          {isAdmin && (
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to={`/update-combo/${combo.ComboID}`}
              className="product-button"
              aria-label={`Actualizar combo ${combo.Nombre}`}
            >
              Actualizar Combo
            </Button>
          )}
        </div>

        {pedidoMessage && (
          <Typography variant="body2" color="success.main" className="pedido-message">
            {pedidoMessage}
          </Typography>
        )}
      </CardContent>

      {/* Dialog de clientes */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Selecciona un Cliente</DialogTitle>
        <DialogContent>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <ClientAutocomplete onClientSelect={setCliente} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cerrar
          </Button>
          <Button onClick={createPedido} color="primary" disabled={isLoading}>
            {isLoading ? 'Creando Pedido...' : 'Confirmar Pedido'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

ComboCard.propTypes = {
  combo: PropTypes.shape({
    ComboID: PropTypes.string.isRequired,
    Nombre: PropTypes.string.isRequired,
    Precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    Descripción: PropTypes.string.isRequired,
    imagen: PropTypes.string,
  }).isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default ComboCard;
