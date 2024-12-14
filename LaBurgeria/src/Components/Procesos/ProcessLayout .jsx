import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from './ProductList';
import BannerBackground from '../../assets/home-banner-background.png';
import './ProcessLayout.css';
import ProcessServices from '../../services/ProcessServices';
import { useUser } from '../../Hooks/useUser';

const ProcessLayout = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, decodeToken } = useUser();
  const [isAdminOrCocina, setIsAdminOrCocina] = useState(false);

  useEffect(() => {
    if (user) {
      try {
        const decoded = decodeToken();
        console.log('Token decodificado:', decoded);
        if (decoded && (decoded.rol === "Administrador" || decoded.rol === "Cocina")) {
          setIsAdminOrCocina(true);
        } else {
          setIsAdminOrCocina(false);
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        setIsAdminOrCocina(false);
      }
    } else {
      setIsAdminOrCocina(false);
    }
  }, [user, decodeToken]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedProducts = await ProcessServices.getRecentProcesses();
        console.log('Datos recibidos:', fetchedProducts);

        if (Array.isArray(fetchedProducts.processes)) {
          setProducts(fetchedProducts.processes);
          console.log('Productos obtenidos:', fetchedProducts.processes);
        } else {
          throw new Error('Datos de productos no válidos.');
        }
      } catch (err) {
        setError(err.message || 'Error al cargar productos');
        console.error('Error en la carga de productos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCreateProcess = () => {
    navigate('/create-process');
  };

  return (
    <div className="process-layout">
      <div className="banner-container">
        <img src={BannerBackground} alt="Banner" className="banner-image" />
      </div>
      <div className="title-container">
        <h1>Procesos de Productos</h1>
        {isAdminOrCocina && (
          <button onClick={handleCreateProcess} className="create-process-button">
            Crear Proceso de Preparación
          </button>
        )}
      </div>
      <div className="content-container">
        {loading ? (
          <div className="loading-container">
            <p>Cargando productos...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>Error: {error}</p>
          </div>
        ) : products.length > 0 ? (
          <div className="product-list-container">
            <ProductList products={products} isAdminOrCocina={isAdminOrCocina} />
          </div>
        ) : (
          <div className="no-products-container">
            <p>No hay productos disponibles.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessLayout;
