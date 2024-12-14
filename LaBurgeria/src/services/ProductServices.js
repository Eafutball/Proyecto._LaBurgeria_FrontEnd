import axios from 'axios';

const PRODUCT_URL = "http://localhost:81/LaBurgeria";

const ProductServices = {
    // Método para obtener la lista completa de productos
    getFullProductList: async () => {
        try {
            const response = await axios.get(`${PRODUCT_URL}/producto/getFullProductList`);

            // Verifica si la respuesta fue exitosa
            if (response.status === 200) { // Check for HTTP status 200
                return response.data; // Retorna los datos directamente
            } else {
                console.error("Error en la respuesta:", response);
                throw new Error('Error al obtener la lista completa de productos. Código de estado: ' + response.status);
            }
        } catch (error) {
            // Log specific error messages
            if (axios.isAxiosError(error)) {
                console.error("Error en la solicitud:", error.message);
            } else {
                console.error("Error inesperado:", error);
            }
            throw new Error('Error al obtener la lista completa de productos');
        }
    },

    // Método para obtener la información completa de un producto específico
    getFullProductInfo: async (productId) => {
        console.log('ID del producto recibido:', productId); // Agregar esta línea
        try {
            const response = await axios.get(`${PRODUCT_URL}/producto/getFullProductInfo/${productId}`);
            
            // Verificar si la respuesta es exitosa y contiene los datos
            if (response.status === 200 && response.data) {
                // Retornar un objeto con la información del producto directamente
                return {
                    success: true,
                    Nombre: response.data.producto.Nombre,
                    Descripción: response.data.producto.Descripción,
                    Precio: response.data.producto.Precio,
                    Imagen: response.data.producto.Imagen,
                    Categoria: response.data.categoria,
                    idCategoria: response.data.idCategoria,
                    Ingredientes: response.data.ingredientes
                };
            } else {
                throw new Error(`Respuesta inesperada del servidor para el producto ${productId}`);
            }
        } catch (error) {
            console.error(`Error al obtener la información del producto ${productId}:`, error);
            return {
                success: false,
                message: `Error al obtener la información del producto ${productId}`
            };
        }
    },
    

    // Método para crear un producto
    createProduct: async (productData) => {
        try {
            console.log("Enviando datos al servidor:", productData);
    
            // Realiza la solicitud POST para crear el producto
            const response = await axios.post(`${PRODUCT_URL}/producto/create`, productData);
            
            // Verifica si el producto ya existe o si fue creado exitosamente
            const { Producto, ProductoExistente, mensaje } = response.data;
    
            if (ProductoExistente) {
                console.warn("Producto duplicado:", mensaje);
                return { 
                    success: false, 
                    mensaje: "El nombre del producto ya existe. Intenta con otro nombre." 
                };
            }
    
            console.log("Producto creado con éxito:", Producto);
            return {
                success: true,
                Producto,
                mensaje: "Producto creado exitosamente.",
            };
    
        } catch (error) {
            const errorMessage = error.response
                ? `Error ${error.response.status}: ${error.response.data?.mensaje || 'Error en el servidor.'}`
                : "Error al crear el producto. Verifica la conexión.";
    
            console.error("Error en createProduct:", errorMessage);
            return {
                success: false,
                mensaje: errorMessage,
            };
        }
    },
    
    updateProduct: async (productData) => {
        try {
            // Verifica si productData es un objeto y contiene los datos necesarios
            if (!productData || typeof productData !== 'object') {
                throw new Error("Los datos del producto deben ser un objeto.");
            }
    
            // Verifica si el ProductoID es válido
            if (!productData.ProductoID || typeof productData.ProductoID !== 'number') {
                throw new Error("El ID del producto es inválido. Debe ser un número.");
            }
    
            // Verifica que el nombre del producto no esté vacío
            if (!productData.Nombre || typeof productData.Nombre !== 'string' || productData.Nombre.trim() === '') {
                throw new Error("El nombre del producto no puede estar vacío.");
            }
    
            // Verifica que la descripción no esté vacía (opcional)
            if (!productData.Descripción || typeof productData.Descripción !== 'string' || productData.Descripción.trim() === '') {
                throw new Error("La descripción del producto no puede estar vacía.");
            }
    
            // Verifica que el Precio sea un número válido y mayor a cero
            if (!productData.Precio || typeof productData.Precio !== 'number' || productData.Precio <= 0) {
                throw new Error("El precio del producto debe ser un número mayor que cero.");
            }
    
            // Verifica que la CategoríaID sea un número válido (opcional)
            if (typeof productData.CategoríaID !== 'undefined' && (typeof productData.CategoríaID !== 'number' || productData.CategoríaID <= 0)) {
                throw new Error("La categoría del producto debe ser un número válido.");
            }
    
            // Verifica que la Imagen sea una URL válida (opcional)
            if (productData.Imagen && typeof productData.Imagen !== 'string') {
                throw new Error("La imagen del producto debe ser una cadena de texto válida.");
            }
    
            // Realiza la solicitud PUT para actualizar el producto
            const response = await axios({
                method: 'put',
                url: `${PRODUCT_URL}/producto/update`, // Asegúrate de incluir el endpoint correcto
                headers: {
                    'Content-Type': 'application/json', // Especifica el tipo de contenido
                },
                data: productData, // Enviar los datos directamente, Axios se encargará de la conversión a JSON
            });
    
            // Retorna la respuesta de éxito
            return {
                success: true,
                mensaje: "Producto actualizado exitosamente.",
                data: response.data,
            };
        } catch (error) {
            // Manejo de errores más detallado
            const errorMessage = error.response 
                ? `Error ${error.response.status}: ${error.response.data?.mensaje || 'Error en el servidor.'}` 
                : error.message || "Error al actualizar el producto. Verifica la conexión.";
    
            console.error("Error en updateProduct:", errorMessage);
            
            // Retorna un objeto de error para ser manejado en la UI
            return {
                success: false,
                mensaje: errorMessage,
            };
        }
    }
    
    

    
    
};

export default ProductServices;
