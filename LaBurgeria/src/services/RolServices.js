import axios from 'axios';

const API_URL = "http://localhost:81/LaBurgeria"; // Asegúrate de que esta URL sea la correcta

const RolesServices = {
    // Método para obtener todos los roles
    getAllRoles: async () => {
        try {
            const response = await axios.get(`${API_URL}/Rol`); // Asegúrate de que la ruta sea la correcta
            return { roles: response.data }; // Retorna los roles de manera más coherente
        } catch (error) {
            console.error('Error al cargar la lista de roles:', error);
            throw error; // Vuelve a lanzar el error para manejo posterior
        }
    },
};

export default RolesServices;
