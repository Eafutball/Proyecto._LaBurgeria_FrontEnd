import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../Hooks/useUser';
import PropTypes from 'prop-types';
import Unauthorized from '../Unauthorized/Unauthorized';

export function Auth({ requiredRoles }) {
  const location = useLocation();
  const { user, authorize } = useUser();

  // Verifica si el usuario está autenticado
  if (!user) {
    return <Navigate to="/" state={{ from: location }} />;
  }


  // Si `requiredRoles` está vacío o contiene un asterisco (*), todos los roles son válidos
  if (requiredRoles.length === 0 || requiredRoles.includes('all')) {
    return <Outlet />;
  }

  // Verifica si el usuario tiene el rol requerido
  if (!authorize(requiredRoles)) {
    // Si no tiene los roles adecuados, redirige a Unauthorized
    return <Unauthorized />;
  }

  // Si está autenticado y tiene los roles necesarios, renderiza el Outlet
  return <Outlet />;
}

// Validación de los props
Auth.propTypes = {
  requiredRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
