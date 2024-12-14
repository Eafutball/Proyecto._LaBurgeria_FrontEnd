import React from "react";
import { Tooltip } from "@mui/material";  // Importamos Tooltip para accesibilidad
import CartIcon from "./CartIcon";
import "./Navbar.css";

const CartIconWrapper = () => (
  <div className="cart-icon-wrapper">
    <Tooltip title="Ver Carrito" arrow>
      <div className="cart-icon-container">
        <CartIcon />
      </div>
    </Tooltip>
  </div>
);

export default CartIconWrapper;
