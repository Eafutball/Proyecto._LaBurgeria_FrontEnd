import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ComboServices from "../../services/ComboServices";
import "./ComboDetail.css";
import BannerBackground from "../../assets/home-banner-background.png";
import Footer from "../Footer";

const ComboDetail = () => {
  const { ComboID } = useParams();
  const [combo, setCombo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const loadComboDetails = async () => {
    try {
      const response = await ComboServices.getComboInfo(+ComboID);
      setCombo(response);
    } catch (err) {
      setError(err.message || "Error al cargar los detalles del combo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComboDetails();
  }, [+ComboID]);

  if (loading) return <p className="loading">Cargando detalles del combo...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!combo) return <p>No se encontraron detalles del combo.</p>;


  const handleQuantityChange = (event) => {
    let value = Math.floor(event.target.value);
    value = Math.max(1, value);
    setQuantity(value);
  };

  const handleOrder = () => {
    alert(`Pedido realizado: ${combo.nombre} x ${quantity}`);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="container_box">
      <div className="combo-detail-wrapper">
        <section className="combo-detail">
          <img src={BannerBackground} alt="Banner" className="banner-image" />

          <div className="combo-detail__content">
            <header className="combo-detail__header">
              <div className="combo-detail__image-container">
                <img
                  className="combo-detail__image"
                  src={combo.imagen || "path/to/default/image.png"} // Imagen por defecto
                  alt={combo.nombre}
                />
              </div>
              <div className="combo-detail__info">
                <h1 className="combo-detail__name">{combo.nombre}</h1>
                <p className="combo-detail__price">Precio: ${combo.precio}</p>
              </div>
            </header>

            <main className="combo-detail__main">
              <h3 className="combo-detail__products-title">Productos incluidos:</h3>
              {combo.productos.length > 0 ? (
                <ul className="combo-detail__products-list">
                  {combo.productos.map((product, index) => (
                    <li key={index} className="combo-detail__product">
                      {product.Nombre} - ${product.Precio}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay productos incluidos en este combo.</p>
              )}

              <div className="combo-detail__interaction">
                <label htmlFor="quantity">Cantidad:</label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  step="1"
                  className="quantity-input"
                />
                <button
                  className="combo-detail__order-button"
                  onClick={handleOrder}
                >
                  Realizar Pedido
                </button>
              </div>

              {showModal && (
                <div className="modal">
                  <div className="modal-content">
                    <span className="close" onClick={toggleModal}>
                      &times;
                    </span>
                    <h2>Detalles Adicionales</h2>
                    <p>Este combo es ideal para...</p>
                    {/* Agregar más información si es necesario */}
                  </div>
                </div>
              )}
            </main>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ComboDetail;