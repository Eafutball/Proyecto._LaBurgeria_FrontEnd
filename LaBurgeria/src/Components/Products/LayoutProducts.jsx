import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductServices from '../../services/ProductServices';
import ProductGrid from './ProductGrid';
import './LayoutProducts.css';
import Footer from '../Footer';
import BannerBackground from '../../assets/home-banner-background.png';
import { useUser } from '../../Hooks/useUser';

const LayoutProducts = () => {
  // **Usuario**
  const { user, decodeToken } = useUser();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  // **Efectos**
  useEffect(() => {
    if (user) {
      try {
        const decoded = decodeToken();
        console.log('Token decodificado:', decoded);
        if (decoded) {
          setUserData(decoded);
        } else {
          setError('Token no válido o no se pudo decodificar.');
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        setError('Error al decodificar el token.');
      }
    } else {
      setUserData(null);
      setError(null); // Limpiamos el error si no hay usuario
    }
  }, [user, decodeToken]);

  const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const data = await ProductServices.getFullProductList();
          if (data && data.data) {
            setProducts(data.data); // Asegúrate de que 'data.data' sea correcto
          } else {
            setError('No se encontraron productos.');
          }
        } catch (err) {
          console.error('Error fetching products:', err);
          setError('No se pudieron cargar los productos.');
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }, []);

    return { products, loading, error };
  };

  const { products, loading, error: productsError } = useProducts();

  // **Verificación de Rol**
  const isAdmin = userData && userData.rol === 'Administrador';  // Asegúrate de que 'role' esté en el token decodificado

  return (
    <div className="layout-products">
      <img src={BannerBackground} alt="Banner" className="banner-image" />
      <header className="layout-header">
        <h1>Nuestra Selección de Productos</h1>
        <p>Descubre lo mejor de nuestra tienda.</p>
        <div className="button-container">
          <div className="button-wrapper">
            {/* Mostrar el botón solo si el usuario es administrador */}
            {isAdmin && (
              <Link to="/create-product">
                <button className="btn-create">Crear Producto</button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="layout-main">
        {loading && <p>Cargando productos...</p>}
        {productsError && <p>{productsError}</p>}
        {!loading && !productsError && <ProductGrid products={products} isAdmin ={isAdmin} />}
      </main>
      <Footer />
    </div>
  );
};

export default LayoutProducts;
