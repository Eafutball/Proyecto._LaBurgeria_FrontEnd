import { useContext, useMemo } from "react";
import { CartContext } from "../Context/CartContext";

// Custom hook to access the cart context
export const useCart = () => {
  const context = useContext(CartContext);

  // Verifica si el contexto está definido
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  // Devuelve el contexto desestructurado para mayor claridad
  return useMemo(() => context, [context]);
};
