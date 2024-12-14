const API_BASE_URL = "http://localhost:81/LaBurgeria";

// Función para realizar las solicitudes fetch y manejar los errores
const apiRequest = async (url, errorMessage) => {
    try {
        const response = await fetch(url);
        console.log('API Response:', response); // Ver la respuesta completa

        if (!response.ok) {
            let errorDetails = "";
            try {
                const errorResponse = await response.json();
                errorDetails = ` Detalles: ${errorResponse.message || "No disponible"}`;
            } catch (err) {
                // Si el cuerpo no es JSON, no hacemos nada
                errorDetails = err;
            }
            throw new Error(`${errorMessage} - Error ${response.status}: ${response.statusText}.${errorDetails}`);
        }

        // Devuelve el objeto JSON directamente
        return await response.json();
    } catch (error) {
        console.error(errorMessage, error);
        throw error; // Vuelve a lanzar el error para que sea manejado externamente
    }
}

const IngredientServices = {
    // Obtener todos los ingredientes
    fetchAllIngredients: async () => {
        try {
            const ingredients = await apiRequest(
                `${API_BASE_URL}/Ingredientes`, // Asegúrate de que esta ruta sea correcta
                'Error al cargar los ingredientes'
            );

            // Retorna un array de ingredientes, asegurando que sea un array
            return Array.isArray(ingredients) ? ingredients : [ingredients];
        } catch (error) {
            console.error('Error fetching ingredients:', error);
            throw error; // Lanza el error para que pueda ser manejado externamente
        }
    },

    // Aquí puedes añadir más métodos relacionados con ingredientes si es necesario
    // Por ejemplo, obtener un ingrediente específico, añadir un ingrediente, etc.
};

export default IngredientServices; // Cambia el nombre si es necesario
