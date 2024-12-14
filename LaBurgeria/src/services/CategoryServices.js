import axios from 'axios';

const API_BASE_URL = "http://localhost:81/LaBurgeria";

const CategoryServices = {
    // Obtener todas las categorías
    fetchAllCategories: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/Categorias`);
            console.log('API Response:', response); // Ver la respuesta completa
            return response.data; // Retorna el array de categorías directamente
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
    fetchProductsByCategoryId: async (categoryId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/Categorias/${categoryId}/Productos`);
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

    fetchNameCategory: async (categoryId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/Categorias/getName/${categoryId}`);
            console.log('API Response:', response); // Ver la respuesta completa
            return response.data; // Retorna solo el nombre de la categoría
        } catch (error) {
            // Manejo de errores
            if (error.response) {
                console.error(`Error al cargar el nombre de la categoría - Error ${error.response.status}: ${error.response.statusText}`);
                throw new Error(`Error al cargar el nombre de la categoría - Error ${error.response.status}: ${error.response.statusText}`);
            } else if (error.request) {
                console.error('Error al cargar el nombre de la categoría - No response received.');
                throw new Error('Error al cargar el nombre de la categoría - No response received.');
            } else {
                console.error(`Error al cargar el nombre de la categoría - ${error.message}`);
                throw new Error(`Error al cargar el nombre de la categoría - ${error.message}`);
            }
        }
    },};

export default CategoryServices;
