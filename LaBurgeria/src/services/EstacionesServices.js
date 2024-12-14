import axios from 'axios';

const COMBO_URL = "http://localhost:81/LaBurgeria";

const EstacionesServices = {
    getAllStations: async () => {
        try {
            const response = await axios.get(`${COMBO_URL}/Estaciones`);
            return { Estaciones: response.data }; // Retorna un objeto con la clave 'combos'
        } catch (error) {
            console.error('Error al cargar la lista de combos:', error);
            throw error; // Vuelve a lanzar el error para manejo posterior si es necesario
        }
    },
    
    
    

  

  
    
    
};

export default EstacionesServices;
