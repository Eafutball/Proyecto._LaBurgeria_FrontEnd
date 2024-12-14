import axios from 'axios';

const API_BASE_URL = "http://localhost:81/LaBurgeria";

const DashboardServices = {
    // Obtener todas las categorías
    fetchTopProducts: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/DashBoard/getTopProducts`);
            console.log('API Response:', response); // Ver la respuesta completa
            return {top_products: response.data.top_products, top_combos: response.data.top_combos }; // Retorna el array de categorías directamente
        } catch (error) {
            // Manejo de errores
            if (error.response) {
                // La solicitud fue realizada y el servidor respondió con un código de estado fuera del rango de 2xx
                console.error(`Error al cargar las categorías - Error ${error.response.status}: ${error.response.statusText}`);
                throw new Error(`Error al cargar las categorías - Error ${error.response.status}: ${error.response.statusText}`);
            } else if (error.request) {
                // La solicitud fue realizada pero no se recibió respuesta
                console.error('Error al cargar las categorías - No response received.');
                throw new Error('Error al cargar las categorías - No response received.');
            } else {
                // Algo ocurrió al configurar la solicitud
                console.error(`Error al cargar las categorías - ${error.message}`);
                throw new Error(`Error al cargar las categorías - ${error.message}`);
            }
        }
    },

    // Obtener los productos asociados a una categoría por su ID
    fetchOrderCountByState: async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/DashBoard/getOrderCountByState`,data);
            console.log('API Response:', response); // Ver la respuesta completa
            return response.data; // Retorna el array de productos directamente
        } catch (error) {
            // Manejo de errores
            if (error.response) {
                console.error(`Error al cargar los productos de la categoría - Error ${error.response.status}: ${error.response.statusText}`);
                throw new Error(`Error al cargar los productos de la categoría - Error ${error.response.status}: ${error.response.statusText}`);
            } else if (error.request) {
                console.error('Error al cargar los productos de la categoría - No response received.');
                throw new Error('Error al cargar los productos de la categoría - No response received.');
            } else {
                console.error(`Error al cargar los productos de la categoría - ${error.message}`);
                throw new Error(`Error al cargar los productos de la categoría - ${error.message}`);
            }
        }
    },
    };

export default DashboardServices;
