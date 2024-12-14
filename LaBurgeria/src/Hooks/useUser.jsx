import { useContext, useMemo } from "react";
import { UserContext } from "../Context/UserContext";

// Custom hook to access the user context
export const useUser = () => {
  const context = useContext(UserContext);

  // Verifica si el contexto está definido
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  // Devuelve el contexto desestructurado para mayor claridad
  return useMemo(() => context, [context]);
};
