import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductServices from "../../services/ProductServices";
import "./ProductDetail.css"; // Asegúrate de que la ruta sea correcta
import BannerBackground from "../../assets/home-banner-background.png"; // Asegúrate de que la ruta sea correcta
import Footer from "../Footer";

const ProductDetail = () => {
  const { ProductoID } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const FRONTEND_URL = "http://localhost:5173";
  const BASE_URL = "http://localhost:81/LaBurgeria";

  // Función para obtener la URL de la imagen, usando una imagen por defecto si `Imagen` no está disponible
  const getImageUrl = (imagePath) => {
    return imagePath
      ? (imagePath.startsWith('/public/')
          ? `${FRONTEND_URL}${imagePath}`
          : `${BASE_URL}/${imagePath}`)
      : `${FRONTEND_URL}/NotFound.png`;
  };

  // Función para cargar los detalles del producto
  const loadProductDetails = async () => {
    try {
      const response = await ProductServices.getFullProductInfo(ProductoID);
      console.log(response); // Verifica la estructura de la respuesta
      setProduct(response);
    } catch (err) {
      setError("Error al cargar los detalles del producto. Inténtalo de nuevo más tarde." + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductDetails();
  }, [ProductoID]);

  // Manejo de estados de carga y error
  if (loading) return <p className="loading">Cargando detalles del producto...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!product) return <p>No se encontraron detalles del producto.</p>;

  // Extraer propiedades del objeto product
  const { Nombre, Descripción, Precio, Imagen } = product; // Extraer directamente las propiedades
  const categoriaNombre = product.Categoria || "Categoría no especificada"; // Manejo de categoría indefinida
  const ingredientes = product.Ingredientes || []; // Manejo de lista de ingredientes indefinida

  return (
    <div className="container_box">
      <section className="product-detail">
        <img src={BannerBackground} alt="Banner" className="banner-image" />

        <div className="product-detail__content">
          <header className="product-detail__header">
            <div className="product-detail__image-container">
              <img
                className="product-detail__image"
                src={getImageUrl(Imagen)} // Usar la función para obtener la URL de la imagen
                alt={Nombre}
              />
            </div>
            <div className="product-detail__info">
              <h1 className="product-detail__name">{Nombre}</h1>
            </div>
          </header>

          <main className="product-detail__main">
            <div className="product-detail__description-container">
              <p className="product-detail__description">{Descripción}</p>
            </div>
            <div className="product-detail__price-container">
              <p className="product-detail__price">Precio: ${Precio}</p>
            </div>
            <div className="product-detail__category-container">
              <p className="product-detail__category">Categoría: {categoriaNombre}</p>
            </div>
          </main>

          <footer className="product-detail__footer">
            <h3 className="product-detail__ingredients-title">Ingredientes</h3>
            <ul className="product-detail__ingredients-list">
              {ingredientes.length > 0 ? (
                ingredientes.map((ingredient, index) => (
                  <li key={index} className="product-detail__ingredient">
                    {ingredient.Nombre} {/* Asegúrate de que 'Nombre' sea la propiedad correcta */}
                  </li>
                ))
              ) : (
                <li>No hay ingredientes disponibles.</li>
              )}
            </ul>
          </footer>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductDetail;