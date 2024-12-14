import axios from "axios";

const BASE_URL = "http://localhost:81/LaBurgeria";
const IMAGE_URL = `${BASE_URL}/Image`;

class ImageServices {
  async createImage(formData) {
    console.log("Datos de la imagen a subir:", formData);
  
    try {
      const response = await axios.post(IMAGE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });
  
      // Intentamos parsear la respuesta para asegurar que esté en formato objeto
      const responseData = typeof response.data === 'string'
        ? JSON.parse(response.data)
        : response.data;
  
      console.log("Respuesta del servidor al subir la imagen:", responseData);
  
      return {
        success: true,
        message: responseData.message || "Imagen subida correctamente.",
        ProductoID: responseData.ProductoID,
        Imagen: responseData.Imagen,
      };
    } catch (error) {
      console.error("Error al subir la imagen:", error);
  
      const isNetworkError = !error.response;
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message || 'No se pudo subir la imagen.';
  
      return {
        success: false,
        message: isNetworkError
          ? "Error de red: No se pudo conectar con el servidor. Verifica tu conexión."
          : `Error ${status || 'desconocido'}: ${errorMessage}`,
      };
    }
  }
}  

export default new ImageServices();
