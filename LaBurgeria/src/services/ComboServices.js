import axios from 'axios';

const COMBO_URL = "http://localhost:81/LaBurgeria";

const ComboServices = {
    getAllCombos: async () => {
        try {
            const response = await axios.get(`${COMBO_URL}/combos`);
            return { combos: response.data }; // Retorna un objeto con la clave 'combos'
        } catch (error) {
            console.error('Error al cargar la lista de combos:', error);
            throw error; // Vuelve a lanzar el error para manejo posterior si es necesario
        }
    },

    getComboInfo: async (comboId) => {
        // Validar que comboId sea un número positivo
        if (typeof comboId !== 'number' || comboId <= 0) {
            console.error('ID de combo inválido. Debe ser un número positivo.');
            throw new Error('ID de combo inválido. Debe ser un número positivo.');
        }
    
        try {
            console.log(`Realizando solicitud GET para combo ID: ${comboId}`);
            // Realizar la solicitud GET al endpoint del combo
            const response = await axios.get(`${COMBO_URL}/combos/getComboInfo/${comboId}`);
            const { data, status, statusText } = response;
    
            console.log(`Respuesta recibida:`, { status, statusText, data });
    
            // Verificar si la solicitud fue exitosa y si los datos requeridos están presentes
            if (status === 200 && data?.success) {
                const { ComboID, nombre, precio, descripcion, productos, imagen } = data;
    
                // Validar que los productos y nombres de productos son arrays y contienen datos
                if (!ComboID || !nombre || !precio || !Array.isArray(productos)) {
                    console.error('La respuesta del servidor no contiene todos los datos necesarios del combo.');
                    throw new Error('La respuesta del servidor no contiene todos los datos necesarios del combo.');
                }
    
                console.log(`Datos del combo estructurados:`, {
                    ComboID,
                    nombre,
                    precio,
                    descripcion: descripcion || 'Descripción no disponible',
                    productos,
                    imagen
                });
    
                // Retornar los datos estructurados necesarios para la interfaz
                return {
                    ComboID,
                    nombre,
                    precio,
                    descripcion: descripcion || 'Descripción no disponible',
                    productos: productos.map((producto) => ({
                        ProductoID: producto.ProductoID,
                        Nombre: producto.Nombre,
                        Descripción: producto.Descripción,
                        Precio: producto.Precio,
                        Imagen: producto.Imagen
                    })),
                    imagen
                };
            } else {
                console.error(`Error al cargar la información del combo: ${statusText || 'Estado desconocido'}`);
                throw new Error(`Error al cargar la información del combo: ${statusText || 'Estado desconocido'}`);
            }
        } catch (error) {
            // Manejo de errores de red o servidor específicos de Axios
            if (axios.isAxiosError(error)) {
                console.error('Error de red o servidor al cargar la información del combo:', error.message);
                throw new Error('Error de red o servidor. Intenta nuevamente más tarde.');
            } else {
                // Manejo de errores inesperados
                console.error('Error inesperado al cargar la información del combo:', error);
                throw new Error('Ocurrió un error inesperado. Intenta nuevamente más tarde.');
            }
        }
    },
    
    
    

    createCombo: async (comboData) => {
        try {
            const response = await axios.post(`${COMBO_URL}/combos/create/`, comboData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.data.success) {
                throw new Error('Failed to create combo: ' + (response.data.message || 'Unknown error'));
            }
            return response.data.Combo; // Return the response data
        } catch (error) {
            console.error('Error al cargar la información del combo:', error.response ? error.response.data : error.message);
            throw error; // Rethrow the error for further handling if needed
        }
    },

    updateCombo: async (comboData) => {
        try {
            const response = await axios.put(`${COMBO_URL}/combos/update/`, comboData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            // Verificar si la respuesta fue exitosa
            if (!response.data.success) {
                throw new Error(response.data.mensaje || 'Error desconocido al actualizar el combo');
            }
    
            return response.data; // Retornar la información del combo actualizado
        } catch (error) {
            // Manejo de errores más específico
            const errorMessage = error.response?.data?.mensaje || error.message || 'Error al actualizar el combo';
            console.error('Error al cargar la información del combo:', errorMessage);
            throw new Error(errorMessage); // Lanza un error con un mensaje específico
        }
    },
    
    
};

export default ComboServices;
