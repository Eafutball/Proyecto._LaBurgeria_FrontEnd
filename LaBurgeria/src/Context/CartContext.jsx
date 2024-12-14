import PropTypes from "prop-types";
import { createContext, useState, useCallback, useEffect } from "react";
import React from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((item, isCombo = false, quantity = 1) => {
    if (!item.ProductoID && !item.ComboID) {
      console.error("El elemento debe tener un ProductoID o ComboID.");
      return;
    }

    const idKey = isCombo ? "ComboID" : "ProductoID";
    const itemInCartIndex = cart.findIndex(cartItem => cartItem[idKey] === item[idKey]);

    if (itemInCartIndex >= 0) {
      const newCart = [...cart];
      newCart[itemInCartIndex].cantidad += quantity;
      setCart(newCart);
    } else {
      setCart(prevState => [
        ...prevState,
        { ...item, cantidad: quantity, observaciones: "" },
      ]);
    }
  }, [cart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const removeFromCart = useCallback((item) => {
    if (!item.ProductoID && !item.ComboID) {
      console.error("El elemento debe tener un ProductoID o ComboID para ser eliminado.");
      return;
    }
    setCart((prevCart) =>
      prevCart.filter((cartItem) =>
        !(
          (cartItem.ProductoID && cartItem.ProductoID === item.ProductoID) || 
          (cartItem.ComboID && cartItem.ComboID === item.ComboID)
        )
      )
    );
  }, []);

  const updateObservation = useCallback((index, newObservation) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      
      // Verificar si el ítem es un producto o un combo
      if (newCart[index].ProductoID) {
        // Es un producto
        newCart[index].observaciones = newObservation;
      } else if (newCart[index].ComboID) {
        // Es un combo
        newCart[index].observaciones = newObservation;
      }
  
      return newCart;
    });
  }, []);

  const decrementItemQuantity = useCallback((item) => {
    const itemId = item.ProductoID || item.ComboID; // Usamos un único identificador: ProductoID o ComboID
  
    setCart(prevCart => prevCart.map(cartItem => {
      const cartItemId = cartItem.ProductoID || cartItem.ComboID; // Similar, nos aseguramos de comparar correctamente
  
      // Verifica si el ID del producto en el carrito coincide con el ID del item
      if (cartItemId === itemId) {
        // Solo decrementa si la cantidad es mayor a 1
        if (cartItem.cantidad > 1) {
          return { ...cartItem, cantidad: cartItem.cantidad - 1 };
        }
      }
  
      return cartItem; // Si no es el item, lo dejamos igual
    }));
  }, []);
  
  
  
  const incrementItemQuantity = useCallback((item) => {
    setCart(prevCart => prevCart.map(cartItem => {
      // Verifica si el item coincide con ProductoID o ComboID
      if (cartItem.ProductoID === item.ProductoID || cartItem.ComboID === item.ComboID) {
        // Incrementa la cantidad del item correspondiente
        return { ...cartItem, cantidad: cartItem.cantidad + 1 };
      }
      return cartItem; // Deja los demás items igual
    }));
  }, []);
  

  // Función para calcular el subtotal de un artículo
  const calculateItemSubtotal = (item) => {
    return item.Precio * item.cantidad; // Asegúrate de que 'price' sea la propiedad correcta
  };

  // Función para calcular el subtotal total del carrito
  const calculateTotalSubtotal = () => {
    return cart.reduce((acc, item) => acc + calculateItemSubtotal(item), 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      clearCart, 
      removeFromCart,
      updateObservation,
      decrementItemQuantity,
      incrementItemQuantity,
      calculateTotalSubtotal // Añadimos la función para obtener el subtotal total
    }}>
      {children}
    </CartContext.Provider>
  );
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};