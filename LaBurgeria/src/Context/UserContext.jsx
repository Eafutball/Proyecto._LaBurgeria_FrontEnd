import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';

export const UserContext = createContext(null);

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Recuperar el usuario almacenado en localStorage al cargar el componente
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);  // Si el usuario existe, está autenticado
    }
  }, []);

  // Guardar usuario en estado y localStorage
  const saveUser = useCallback((user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
  }, []);

  // Limpiar el usuario del estado y localStorage
  const clearUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  }, []);

  // Decodificar el token JWT
  const decodeToken = useCallback(() => {
    if (user?.token) {
      try {
        return jwtDecode(user.token);  // Asumimos que el token está en el campo "token" del usuario
      } catch (error) {
        console.error('Error decoding token:', error);
        return {};  // Retornar un objeto vacío si ocurre un error en la decodificación
      }
    }
    return {}; // Retornar un objeto vacío si no hay usuario o token
  }, [user]);

  // Verificar si el usuario tiene los roles requeridos
  const authorize = useCallback(({ requiredRoles }) => {
    const decodedToken = decodeToken();
    if (decodedToken && requiredRoles) {
      // Verifica si el rol del usuario está en los roles requeridos
      return requiredRoles.includes(decodedToken?.rol);
    }
    return false;  // Si no hay token o roles requeridos, no está autorizado
  }, [decodeToken]);

  // Método que retorna el objeto usuario con el token decodificado

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        saveUser,
        clearUser,
        authorize,
        decodeToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
