import axios from 'axios';

const API_BASE_URL = "http://localhost:81/LaBurgeria";

// Función para manejar errores
const handleError = (error, context) => {
    let errorDetails = '';
    if (error.response) {
        const { status, statusText, data } = error.response;
        errorDetails = ` - Error ${status}: ${statusText}. Detalles: ${data.message || "No disponible"}`;
    } else {
        errorDetails = error.message;
    }

    console.error(`${context} ${errorDetails}`);
    throw new Error(`${context} ${errorDetails}`);
};

const ProcessServices = {
    /**
     * Obtener los procesos más recientes.
     * @returns {Promise<Array>} - Procesos más recientes en formato de array.
     */
    getRecentProcesses: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/Procesos/getAllProductsDetailsWithSteps`);
            const processes = response.data;
    
            if (!Array.isArray(processes)) {
                console.warn('Se recibió un resultado no esperado:', processes);
                return { processes: [processes] }; // Devuelve el objeto como un array dentro de un objeto
            }
    
            // Mapeamos los procesos para validarlos y devolver el objeto con los datos deseados
            const result = processes
                .map(product => {
                    return {
                        id: product.id || '', // Asegurando que 'id' siempre esté presente
                        nombre: product.nombre || 'Nombre no disponible', // Nombre del producto
                        precio: product.precio || 0, // Precio del producto
                        img: product.img || 'ImageNotFound.png', // Imagen predeterminada si no existe
                        pasos: product.pasos || 0, // Número total de pasos
                        est: product.est ? product.est.map(est => ({
                            EstacionID: est.EstacionID || '', // ID de la estación
                            nombre: est.nombre || 'Estación desconocida' // Nombre de la estación
                        })) : []
                    };
                })
                .filter(Boolean); // Elimina cualquier null que pueda resultar de la validación
    
            return { processes: result }; // Retorna los productos como un objeto con una propiedad 'processes'
        } catch (error) {
            handleError(error, 'Error al cargar los procesos más recientes');
            return { processes: [] }; // En caso de error, retornamos un array vacío
        }
    },

    getProcessInfo: async (ProcessData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/Procesos/updatePreparationProcess`, ProcessData);
            const processes = Array.isArray(response.data) ? response.data : [response.data];

            return processes.reduce((acc, { PRODUCTO, TOTAL_PASOS, ESTACIONES }) => {
                if (PRODUCTO) {
                    acc[PRODUCTO.ProductoID] = {
                        id: PRODUCTO.ProductoID,
                        nombre: PRODUCTO.nombre || 'Nombre no disponible',
                        precio: PRODUCTO.precio || 0,
                        img: PRODUCTO.img || 'ImageNotFound.png',
                        TotalPasos: TOTAL_PASOS || 0,
                        Estaciones: ESTACIONES || []
                    };
                }
                return acc;
            }, {});

        } catch (error) {
            handleError(error, 'Error al obtener la información del proceso');
        }
    },

    updateProcessInfo: async (ProcessData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/Procesos/updatePreparationProcess`, ProcessData);
            const { message, producto, Estaciones, total_pasos } = response.data;

            if (!producto || !producto.ProductoID) {
                console.log('Producto no disponible, retornando undefined');
                return undefined;
            }

            const updatedProductInfo = {
                id: producto.ProductoID,
                nombre: producto.nombre || 'Nombre no disponible',
                precio: producto.precio || 0,
                img: producto.img || 'ImageNotFound.png',
                TotalPasos: total_pasos || 0,
                Estaciones: Estaciones.map(estacion => ({
                    EstacionID: estacion.EstacionID,
                    Nombre: estacion.Nombre || 'Nombre de estación no disponible',
                    Orden: estacion.Orden || 0
                }))
            };

            console.log('Proceso de preparación actualizado exitosamente:', updatedProductInfo);
            return {
                success: true,
                message: message,
                producto: updatedProductInfo
            };

        } catch (error) {
            handleError(error, 'Error al actualizar el proceso de preparación');
        }
    },

    createProcess: async (processData) => {
        try {
            console.log('Sending process data:', processData);
            const response = await axios.post(`${API_BASE_URL}/Procesos/createPreparationProcess`, processData);
            const { success, message, producto, Estaciones, total_pasos } = response.data;

            if (!success) {
                console.warn('Proceso no creado:', message);
                return null;
            }

            if (!producto || !producto.ProductoID) {
                console.error('Producto sin ID válido:', producto);
                return null;
            }

            return {
                id: producto.ProductoID,
                nombre: producto.nombre || 'Nombre no disponible',
                precio: producto.precio || 0,
                img: producto.img || 'ImageNotFound.png',
                TotalPasos: total_pasos || 0,
                Estaciones: Estaciones || []
            };

        } catch (error) {
            const requestData = JSON.stringify(processData);
            handleError(error, `Error al crear el proceso de preparación. Request data: ${requestData}`);
        }
    }
};

export default ProcessServices;
