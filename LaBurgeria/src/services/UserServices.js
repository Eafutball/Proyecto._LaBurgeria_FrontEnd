import axios from 'axios';

const PRODUCT_URL = "http://localhost:81/LaBurgeria";

const UserServices = {
    // Método para obtener la información completa del usuario
    getFullUserInfo: async (id) => {
        try {
            const response = await axios.get(`${PRODUCT_URL}/Usuarios/getFullUserInfo/${id}`);
            // Verifica si la respuesta fue exitosa
            if (!response.data.success) {
                console.warn("Advertencia: Usuario no encontrado o error en la respuesta.");
                return null; // Retorna null si no fue exitoso
            }
            return response.data.user; // Retorna la información del usuario
        } catch (error) {
            // Log de errores específicos
            if (axios.isAxiosError(error)) {
                console.error("Error en la solicitud:", error.message);
            } else {
                console.error("Error inesperado:", error);
            }
            throw new Error('Error al obtener la información del usuario'); // Mensaje de error más específico
        }
    },   


    login: async (loginData) => {
        try {
            const response = await axios.post(`${PRODUCT_URL}/Usuarios/login`, loginData);
            return response.data; // Retorna la información del usuario
        } catch (error) {
            // Log de errores específicos
            if (axios.isAxiosError(error)) {
                console.error("Error en la solicitud:", error.message);
            } else {
                console.error("Error inesperado:", error);
            }
            throw new Error('Error al obtener la información del usuario'); // Mensaje de error más específico
        }
    },  
    
    getClientes: async () => {
        try {
            const response = await axios.post(`${PRODUCT_URL}/Usuarios/getClientes`);
            console.log("Respuesta de getClientes:", response); // Log de la respuesta completa
            return response.data.clientes; // Retorna la información del usuario
        } catch (error) {
            // Log de errores específicos
            if (axios.isAxiosError(error)) {
                console.error("Error en la solicitud:", error.message); // Log de error de Axios
            } else {
                console.error("Error inesperado:", error); // Log de errores no relacionados con Axios
            }
            throw new Error('Error al obtener la información del usuario'); // Mensaje de error más específico
        }
    },
    register: async (userData) => {
        try {
            console.log("Iniciando el proceso de registro de usuario...");
            console.log("Datos del usuario:", userData); // Log para ver los datos antes de enviar la solicitud
            
            // Realizando la solicitud POST para crear el usuario
            const response = await axios.post(`${PRODUCT_URL}/Usuarios/create`, userData);
            
            console.log("Respuesta del servidor recibida:", response); // Log para ver la respuesta completa del servidor
    
            // Verificando que la respuesta tenga el formato esperado
            if (response && response.data) {
                console.log("Usuario creado exitosamente:", response.data); // Log para mostrar la data del nuevo usuario
                return response.data; // Retorna la información del usuario
            } else {
                console.error("Respuesta inesperada del servidor:", response); // Log para capturar respuestas no esperadas
                throw new Error("Respuesta inesperada del servidor");
            }
        } catch (error) {
            // Manejo de errores con Axios
            if (axios.isAxiosError(error)) {
                // Extraemos detalles del error de Axios
                console.error("Error en la solicitud Axios:", error.response?.data || error.message); // Log del error de Axios
                // Enviar error con mensaje más claro para el frontend
                throw new Error(error.response?.data?.message || "Error en la solicitud al servidor");
            } else {
                // En caso de error inesperado
                console.error("Error inesperado:", error); // Log de errores inesperados
                throw new Error("Error inesperado en el proceso de registro");
            }
        }
    }
    
};

export default UserServices;