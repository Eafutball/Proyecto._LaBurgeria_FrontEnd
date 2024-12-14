import React from "react";
import { Outlet } from "react-router-dom";
import NavbarLayout from "./Components/Navbar/NavbarLayout"; // Asegúrate de que el Navbar está bien importado
import { CartProvider } from "./Context/CartContext";

function App() {
  return (
    <div>
      <CartProvider>  
      <NavbarLayout/> {/* Componente de navegación que aparece en todas las páginas */}
      <Outlet /> {/* Renderiza el contenido según la ruta */}
      </CartProvider>

    </div>
  );
}

export default App;
