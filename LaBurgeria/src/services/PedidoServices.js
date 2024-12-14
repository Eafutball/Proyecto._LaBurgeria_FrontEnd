import axios from 'axios';

const API_BASE_URL = "http://localhost:81/LaBurgeria";

const PedidoServices = {
  /**
   * Crear un pedido.
   * @param {Object} pedidoData - Los datos del pedido.
   * @returns {Promise<Object>} - Detalles del pedido creado.
   */
  createPedido: async (pedidoData) => {
    console.log('Iniciando la creación del pedido con los siguientes datos:', pedidoData);

    try {
        // Enviar la solicitud para crear un nuevo pedido
        const response = await axios.post(`${API_BASE_URL}/Pedidos/create`, pedidoData);

        console.log('Respuesta recibida del servidor:', response);

        // Comprobar si la respuesta es exitosa
        if (response.data.success) {
            console.log('Pedido creado exitosamente:', response.data.pedido);
        } else {
            console.log('Error al crear el pedido:', response.data.mensaje);
        }

            
 
        return {
            success: response.data.success,
            pedido: response.data.data.pedido || null, // Retorna el objeto del pedido o null si no hay
            mensaje: response.data.mensaje || 'No se proporcionó un mensaje' // Mensaje de éxito o predeterminado
        };

    } catch (error) {
        // Manejo de errores con detalles más completos
        let errorDetails = '';

        if (error.response) {
            const { status, statusText, data } = error.response;
            errorDetails = ` - Error ${status}: ${statusText}. Detalles: ${data.message || "No disponible"}`;
        } else {
            errorDetails = error.message;
        }

        // Imprime el error detallado en la consola
        console.error(`Error al crear el pedido${errorDetails}`);
        // Retornar un objeto de error para manejarlo más fácilmente en el llamador
        return {
            success: false,
            mensaje: `Error al crear el pedido${errorDetails}`
        };
    }
},










updatePedido: async (pedidoData) => {
  console.log('Iniciando la creación del pedido con los siguientes datos:', pedidoData);

  try {
      // Enviar la solicitud para crear un nuevo pedido
      const response = await axios.post(`${API_BASE_URL}/Pedidos/updatePedido`, pedidoData);

      console.log('Respuesta recibida del servidor:', response);

      // Comprobar si la respuesta es exitosa
      if (response.data.success) {
          console.log('Pedido creado exitosamente:', response.data.pedido);
      } else {
          console.log('Error al crear el pedido:', response.data.mensaje);
      }

     return {
          success: response.data.success,
          pedido: response.data.data.pedido || null, // Retorna el objeto del pedido o null si no hay
          mensaje: response.data.mensaje || 'No se proporcionó un mensaje' // Mensaje de éxito o predeterminado
      };

  } catch (error) {
      // Manejo de errores con detalles más completos
      let errorDetails = '';

      if (error.response) {
          const { status, statusText, data } = error.response;
          errorDetails = ` - Error ${status}: ${statusText}. Detalles: ${data.message || "No disponible"}`;
      } else {
          errorDetails = error.message;
      }

      // Imprime el error detallado en la consola
      console.error(`Error al crear el pedido${errorDetails}`);
      // Retornar un objeto de error para manejarlo más fácilmente en el llamador
      return {
          success: false,
          mensaje: `Error al crear el pedido${errorDetails}`
      };
  }
},







 getAllPedidos : async () => {
  try {
      // Realizar la solicitud para obtener los pedidos
      const response = await axios.get(`${API_BASE_URL}/Pedidos`);

      console.log('Respuesta del servidor:', response.data);

      return response.data;

  } catch (error) {
      // Manejo detallado de errores
      let errorDetails = '';

      if (error.response) {
          // Si la respuesta del error está disponible
          const { status, statusText, data } = error.response;
          errorDetails = ` - Error ${status}: ${statusText}. Detalles: ${data.message || "No disponible"}`;
      } else if (error.request) {
          // Si la solicitud fue realizada pero no hubo respuesta
          errorDetails = ` - Error de red: No se recibió respuesta del servidor.`;
      } else {
          // Otros errores generales
          errorDetails = ` - Error: ${error.message}`;
      }

      // Imprimir el error completo en consola para depuración
      console.error(`Error al obtener los pedidos${errorDetails}`);

      // Retornar un objeto con el error para facilitar el manejo en el llamador
      return {
          success: false,
          mensaje: `Error al obtener los pedidos${errorDetails}`
      };
  }
},





getAllPedidosByCliente : async (id) => {
  try {
      // Realizar la solicitud para obtener los pedidos
      const response = await axios.get(`${API_BASE_URL}/Pedidos/getPedidosByClient/${id}`);

      console.log('Respuesta del servidor:', response.data);

      return response.data;

  } catch (error) {
      // Manejo detallado de errores
      let errorDetails = '';

      if (error.response) {
          // Si la respuesta del error está disponible
          const { status, statusText, data } = error.response;
          errorDetails = ` - Error ${status}: ${statusText}. Detalles: ${data.message || "No disponible"}`;
      } else if (error.request) {
          // Si la solicitud fue realizada pero no hubo respuesta
          errorDetails = ` - Error de red: No se recibió respuesta del servidor.`;
      } else {
          // Otros errores generales
          errorDetails = ` - Error: ${error.message}`;
      }

      // Imprimir el error completo en consola para depuración
      console.error(`Error al obtener los pedidos${errorDetails}`);

      // Retornar un objeto con el error para facilitar el manejo en el llamador
      return {
          success: false,
          mensaje: `Error al obtener los pedidos${errorDetails}`
      };
  }
},








insertProducts: async (pedidoData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Pedidos/insertProducts`, pedidoData);

     return response.data  
  } catch (error) {
    let errorDetails = '';

    if (error.response) {
      // El servidor respondió con un estado distinto de 2xx
      const status = error.response.status;
      const statusText = error.response.statusText;
      const data = error.response.data;
      errorDetails = `Error ${status}: ${statusText}. Detalles: ${data.message || "No disponible"}`;
    } else if (error.request) {
      // Se hizo la solicitud pero no se recibió respuesta
      errorDetails = `No se recibió respuesta: ${error.request}`;
    } else {
      // Error al configurar la solicitud
      errorDetails = `Error en la configuración de la solicitud: ${error.message}`;
    }
    
    console.error(`Error al crear el pedido: ${errorDetails}`);
    throw new Error(`Error al crear el pedido: ${errorDetails}`);
  }
},



insertCombos: async (pedidoData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Pedidos/insertCombos`, pedidoData);
    
    return response.data
  } catch (error) {
    let errorDetails = '';
    if (error.response) {
      // Server responded with a status other than 2xx
      const { status, statusText, data } = error.response;
      errorDetails = `Error ${status}: ${statusText}. Detalles: ${data.message || "No disponible"}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorDetails = `No response received: ${error.request}`;
    } else {
      // Error setting up the request
      errorDetails = `Request setup error: ${error.message}`;
    }
    
    console.error(`Error al crear el pedido: ${errorDetails}`);
    throw new Error(`Error al crear el pedido: ${errorDetails}`);
  }
},

getProductsByPedido: async (id) => {
  try {
    console.log(`Iniciando solicitud GET para obtener productos y combos del pedido con ID: ${id}`);

    // Realizar la solicitud GET a la API
    const response = await axios.get(`${API_BASE_URL}/Pedidos/getProductsByPedido/${id}`);

    console.log('Respuesta obtenida del servidor:', response.data);

    // El resultado ya es un solo arreglo que contiene tanto productos como combos
    const productosYCombos = response.data;

    // Mostrar el arreglo combinado de productos y combos
    console.log('Arreglo combinado de productos y combos:', productosYCombos);

    // Retornar el arreglo combinado
    return productosYCombos;

  } catch (error) {
    // Manejo de errores
    let errorDetails = '';

    if (error.response) {
      // El servidor respondió con un estado diferente a 2xx
      const { status, statusText, data } = error.response;
      errorDetails = `Error ${status}: ${statusText}. Detalles: ${data.message || "No disponible"}`;
    } else if (error.request) {
      // La solicitud se realizó pero no se recibió respuesta
      errorDetails = `No response received: ${error.request}`;
    } else {
      // Error al configurar la solicitud
      errorDetails = `Request setup error: ${error.message}`;
    }

    console.error(`Error al obtener productos y combos: ${errorDetails}`);
    throw new Error(`Error al obtener productos y combos: ${errorDetails}`);
  }
},







 getPedido : async (id) => {
  try {
    // Realizar la solicitud POST a la API para obtener solo los detalles del pedido
    const response = await axios.get(`${API_BASE_URL}/Pedidos/get/${id}`);
    
    // Desestructurar los datos del pedido desde la respuesta
    const { PedidoID, FechaHora, Estado, PersonalID, subtotal, Total, Impuesto, metodo_de_entrega, CostoEnvio, metodo_de_pago, encargado_asociado} = response.data;

    // Devolver solo los datos del pedido sin los productos y combos
    return { 
      PedidoID, 
      FechaHora, 
      Estado, 
      PersonalID, 
      subtotal, 
      Total, 
      Impuesto, 
      metodo_de_entrega, 
      CostoEnvio, 
      metodo_de_pago,
      encargado_asociado
    };
    
  } catch (error) {
    // Manejo de errores
    let errorDetails = '';

    if (error.response) {
      // El servidor respondió con un estado diferente a 2xx
      const { status, statusText, data } = error.response;
      errorDetails = `Error ${status}: ${statusText}. Detalles: ${data.message || "No disponible"}`;
    } else if (error.request) {
      // La solicitud se realizó pero no se recibió respuesta
      errorDetails = `No response received: ${error.request}`;
    } else {
      // Error al configurar la solicitud
      errorDetails = `Request setup error: ${error.message}`;
    }
    
    console.error(`Error al obtener los detalles del pedido: ${errorDetails}`);
    throw new Error(`Error al obtener los detalles del pedido: ${errorDetails}`);
  }
},

 createPedidoForClientes : async (pedidoData) => {
  try {
    // Realizamos la solicitud POST al backend
    const response = await axios.post(`${API_BASE_URL}/Pedidos/insertPedidoForCliente`, pedidoData);
    
    // Verificamos si la respuesta es exitosa
    if (response.data?.success) {
      return { success: true, message: "Pedido creado exitosamente", data: response.data };
    } else {
      // Si la respuesta no es exitosa, podemos enviar un error genérico
      return { success: false, mesage: "Error al crear el pedido" };
    }
  } catch (error) {
    // Capturamos cualquier error que ocurra en el proceso
    console.error("Error al crear el pedido:", error);
    return { success: false, message: error.message || "Error al conectarse con el servidor" };
  }
},


};

export default PedidoServices;
