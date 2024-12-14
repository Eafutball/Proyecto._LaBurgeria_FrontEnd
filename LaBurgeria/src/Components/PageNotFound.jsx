import React from "react";
import { Link } from "react-router-dom";
import "./PageNotFound.css"; // Puedes agregar estilos personalizados en este archivo

const PageNotFound = () => {
  return (
    <div className="page-not-found-container">
      <div className="page-not-found-header"> {/* Encabezado de la página */}
        <h1>404 - Página no encontrada</h1>
      </div>
      <div className="page-not-found-message"> {/* Mensaje de error */}
        <p>Lo sentimos, la página que buscas no existe.</p>
      </div>
      <div className="page-not-found-link"> {/* Enlace para volver al inicio */}
        <Link to="/" className="home-link">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
