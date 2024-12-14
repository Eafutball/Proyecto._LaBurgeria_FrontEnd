// Guardar el carrito en el almacenamiento local
// Guardar el pedido en el almacenamiento local
export const savePedidoToLocalStorage = (pedido) => {
    localStorage.setItem("pedido", JSON.stringify(pedido)); // Convertir el pedido a una cadena JSON antes de guardarlo
  };
  
  // Recuperar el pedido del almacenamiento local
  export const loadPedidoFromLocalStorage = () => {
    const storedPedido = localStorage.getItem("pedido");
    return storedPedido ? JSON.parse(storedPedido) : []; // Devolver un arreglo vacío si no hay datos almacenados
  };

  // Borrar el pedido del almacenamiento local
export const removePedidoFromLocalStorage = () => {
  localStorage.removeItem("pedido"); // Elimina el item "pedido" del almacenamiento local
};

  