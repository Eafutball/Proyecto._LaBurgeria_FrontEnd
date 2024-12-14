import axios from 'axios';

const API_BASE_URL = "http://localhost:81/LaBurgeria";

const MenuServices = {
    /**
     * Obtener el menú más reciente.
     * @returns {Promise<Array>} - Menú más reciente en formato de array.
     */
    fetchRecentMenu: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/menu/fetchRecentMenu`);
            const menu = response.data;
            console.log('Menú más reciente cargado:', menu); // Log del menú cargado
            return Array.isArray(menu) ? menu : [menu]; // Devuelve un array con el objeto si no es un array
        } catch (error) {
            console.error('Error al cargar el menú más reciente:', error);
            throw error;
        }
    },

    getMenu: async (idMenu) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/menu/getMenu/${idMenu}`);
            const menu = response.data;
    
            console.log('Menú cargado con ID', idMenu, ':', menu); // Log del menú cargado por ID
            
            return {
                Nombre: menu.Nombre,
                Descripción: menu.Descripción | "No hay",
                Dia: menu.Dia,
                FechaInicio: menu.FechaInicio,
                FechaFin: menu.FechaFin,
                HoraInicio: menu.HoraInicio,
                HoraFin: menu.HoraFin,
                FormatoMenu: menu.FormatoMenu,
            };
        } catch (error) {
            console.error('Error al cargar el menú:', error);
            throw error;
        }
    },
    

    activateMenu: async (menuData) => {
        try {
            console.log('Activando menú con datos:', menuData); // Log de datos para activar el menú
            const response = await axios.put(`${API_BASE_URL}/menu/activateMenu`, menuData);
            
            console.log('Respuesta del servidor al activar menú:', response.data); // Log de respuesta
            
            return {
                mensaje: response.data.mensaje,
                MenúID: response.data.menu_id
            };
        } catch (error) {
            console.error('Error al activar el menú:', error.response?.data?.mensaje || error.message);
            throw error;
        }
    },

    createMenu: async (menuData) => {
        try {
            console.log('Creando menú con datos:', menuData); // Log de datos para crear el menú
            const response = await axios.post(`${API_BASE_URL}/menu/create`, menuData);
            
            console.log('Respuesta del servidor al crear el menú:', response.data); // Log de respuesta
            
            return {
                success: response.data.success,
                Menu: {
                    MenúID: response.data.Menu.MenúID,
                    Nombre: response.data.Menu.Nombre,
                    Descripción: response.data.Menu.Descripción,
                    Dia: response.data.Menu.Dia,
                    FechaInicio: response.data.Menu.FechaInicio,
                    FechaFin: response.data.Menu.FechaFin,
                    HoraInicio: response.data.Menu.HoraInicio,
                    HoraFin: response.data.Menu.HoraFin,
                    FormatoMenu: response.data.Menu.FormatoMenu
                }
            };
        } catch (error) {
            console.error('Error al crear el menú:', error.response?.data?.mensaje || error.message);
            throw error;
        }
    },

    updateMenu: async (menuData) => {
        try {
            console.log('Actualizando menú con datos:', menuData); // Log de datos para actualizar el menú
            const response = await axios.post(`${API_BASE_URL}/menu/updateMenu`, menuData);
            
            console.log('Respuesta del servidor al actualizar el menú:', response.data); // Log de respuesta
            
            if (response.data.success) {
                return {
                    success: true,
                    Menu: response.data.Menu,
                };
            } else {
                throw new Error(response.data.mensaje || 'Error al actualizar el menú');
            }
        } catch (error) {
            console.error('Error al actualizar el menú:', error.response?.data?.mensaje || error.message);
            throw error;
        }
    },

    insertProducts: async (producData) => {
        console.log('Intentando insertar producto con los siguientes datos:', producData); // Log de datos a insertar
        try {
            const response = await axios.post(`${API_BASE_URL}/menu/insertProducts`, producData);
            console.log('Respuesta del servidor al insertar producto:', response.data); // Log de respuesta
            
            return {
                success: response.data.success,
                mensaje: response.data.message
            };
        } catch (error) {
            console.error('Error al insertar el producto:', error.response?.data?.mensaje || error.message);
            throw error;
        }
    },

    insertCombos: async (comboData) => {
        console.log('Intentando insertar combo con los siguientes datos:', comboData); // Log de datos a insertar
        try {
            const response = await axios.post(`${API_BASE_URL}/menu/insertCombos`, comboData);
            console.log('Respuesta del servidor al insertar combo:', response.data); // Log de respuesta
            
            return {
                success: response.data.success,
                mensaje: response.data.message
            };
        } catch (error) {
            console.error('Error al insertar el combo:', error.response?.data?.mensaje || error.message);
            throw error;
        }
    },

    fetchCombosByMenu: async (menuID) => {
        console.log(`Iniciando la carga de combos para el menú con ID: ${menuID}`); // Log de inicio
        try {
            const response = await axios.get(`${API_BASE_URL}/menu/getCombosOnMenu/${menuID}`);
            console.log(`Respuesta recibida para el menú ${menuID}:`, response.data); // Log de respuesta
            return response.data;
        } catch (error) {
            console.error(`Error al cargar los combos del menú con ID ${menuID}:`, error);
            throw error;
        }
    },

    fetchProductsByMenu: async (menuID) => {
        console.log(`Iniciando la carga de productos para el menú con ID: ${menuID}`); // Log de inicio
        try {
            const response = await axios.get(`${API_BASE_URL}/menu/getProductsOnMenu/${menuID}`);
            console.log(`Respuesta recibida para el menú ${menuID}:`, response.data); // Log de respuesta
            return response.data;
        } catch (error) {
            console.error(`Error al cargar los productos del menú con ID ${menuID}:`, error);
            throw error;
        }
    },

    fetchMenusOrdered: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/menu/fetchMenusOrdered`);
            console.log('Menús ordenados cargados:', response.data); // Log de menús ordenados
            return response.data;
        } catch (error) {
            console.error('Error al cargar los menús ordenados:', error);
            throw error;
        }
    },
};

export default MenuServices;
