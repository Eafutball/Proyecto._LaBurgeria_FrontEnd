import axios from 'axios';

const API_URL = "http://localhost:81/LaBurgeria"; // Asegúrate de que esta URL sea la correcta

const CocinaServices = {
    // Método para obtener todos los pedidos
    getAllOrders: async () => {
        try {
            console.log('Enviando solicitud para obtener todos los pedidos...');
            const response = await axios.get(`${API_URL}/Cocina`); // Ruta para obtener pedidos
            console.log('Respuesta recibida de los pedidos:', response.data);
            return response.data; // Retorna los datos directamente
        } catch (error) {
            console.error('Error al cargar la lista de pedidos:', error);
            throw error; // Lanza el error para que pueda manejarse en otro lugar
        }
    },

    // Método para actualizar un pedido
    update: async (pedidoData) => {
        try {
            console.log('Enviando datos para actualizar el pedido:', pedidoData);
            const response = await axios.post(`${API_URL}/Cocina/update`, pedidoData); // Enviar datos al backend
            console.log('Respuesta de la actualización del pedido:', response.data);
            return response.data; // Retorna la respuesta del backend
        } catch (error) {
            console.error('Error al actualizar el pedido:', error);
            throw error; // Lanza el error para manejo posterior
        }
    },

    // Método para obtener productos con estaciones
    getAllStations: async (id) => {
        try {
            console.log('Enviando solicitud para obtener productos con estaciones para el id:', id);
            const response = await axios.get(`${API_URL}/Cocina/fetchStationsForProducts/${id}`); // Enviar datos al backend
            console.log('Respuesta recibida con productos y estaciones:', response.data);
            return response.data; // Retorna la respuesta del backend
        } catch (error) {
            console.error('Error al obtener productos con estaciones:', error);
            throw error; // Lanza el error para manejo posterior
        }
    }
};

export default CocinaServices;
