import React from 'react';
import { Badge, Tooltip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../Hooks/useCart';

const CartIcon = () => {
  const { cart } = useCart(); // Obtener el carrito desde el contexto

  // Contar el total de productos en el carrito
  const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);

  return (
    <Tooltip title={`Total de artículos: ${totalItems}`} arrow>
      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <Badge badgeContent={totalItems} color="secondary" overlap="circular">
          <ShoppingCartIcon fontSize="small" />
        </Badge>
      </div>
    </Tooltip>
  );
};

export default CartIcon;