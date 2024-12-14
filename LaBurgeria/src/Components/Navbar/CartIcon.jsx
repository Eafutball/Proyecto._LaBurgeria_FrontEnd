import React from "react";
import { Badge, Tooltip, IconButton } from "@mui/material"; // Usamos IconButton para mayor accesibilidad
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "../../Hooks/useCart"; // Hook personalizado para obtener el carrito

const CartIcon = () => {
  const { cart } = useCart(); // Obtener el carrito desde el contexto

  // Contar el total de productos en el carrito
  const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);

  return (
    <Tooltip title={`Total de artículos: ${totalItems}`} arrow>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          position: "relative", // Necesario para Badge
        }}
      >
        {/* IconButton mejora la accesibilidad */}
        <IconButton
          color="primary"
          aria-label="Ver carrito"
          style={{
            transition: "transform 0.3s ease",
            padding: "8px", // Añadimos algo de padding para que el área de clic sea más grande
          }}
          onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"} // Efecto al pasar el ratón
          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
        >
          <Badge
            badgeContent={totalItems} // Muestra el número total de productos
            color="secondary" // Color del badge
            overlap="circular" // Hace que el badge sea circular
            showZero={true} // Asegura que el badge sea visible incluso cuando el carrito está vacío
            style={{ fontSize: "14px" }} // Tamaño del número en el badge
          >
            <ShoppingCartIcon fontSize="large" /> {/* Ícono del carrito */}
          </Badge>
        </IconButton>
      </div>
    </Tooltip>
  );
};

export default CartIcon;
