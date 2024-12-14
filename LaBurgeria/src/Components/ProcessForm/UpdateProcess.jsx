import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import './ProcessForm.css';
import ProcessServices from '../../services/ProcessServices';
import BannerBackground from "../../assets/home-banner-background.png";
import { useParams } from 'react-router-dom';
import ProductServices from '../../services/ProductServices';
import EstacionesServices from '../../services/EstacionesServices';

const UpdateProcess = () => {
  const { ProductoID } = useParams();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedStations, setSelectedStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Obtener la lista de productos
        const productsResponse = await ProductServices.getFullProductList();
        console.log('Productos obtenidos:', productsResponse.data);
        setProducts(productsResponse.data || []); // Asegúrate de que sea un array

        // Obtener la lista de estaciones
        const stationsResponse = await EstacionesServices.getAllStations();
        console.log('Estaciones obtenidas:', stationsResponse.Estaciones);
        setStations(stationsResponse.Estaciones || []); // Asegúrate de que sea un array 

        // Obtener el producto actual y las estaciones seleccionadas
        const productResponse = await ProductServices.getFullProductInfo(+ProductoID);
        console.log('Producto obtenido:', productResponse);

        setSelectedProduct({
          value: productResponse.ProductoID,
          label: productResponse.Nombre,
        });
        setSelectedStations(stations.map(station => ({
          value: station.EstacionID,
          label: station.Nombre,
        })));

      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        toast.error('Hubo un error al cargar los datos iniciales');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [ProductoID]);

  const handleSubmit = async () => {
    const processData = {
      ProductoID: Number(+ProductoID),
      Estaciones: selectedStations.map(station => ({
        EstacionID: station.value, // Cambia a station.value para obtener el ID correcto
      })),
    };

    console.log('Datos del proceso a registrar:', processData);

    try {
      await ProcessServices.updateProcessInfo(processData);
      toast.success('Proceso de preparación registrado con éxito');
    } catch (error) {
      console.error('Error al registrar el proceso:', error);
      toast.error('Hubo un error al registrar el proceso');
    }
  };

  const handleProductChange = (selectedOption) => {
    console.log('Producto seleccionado:', selectedOption);
    setSelectedProduct(selectedOption);
  };

  const handleStationChange = (selectedOptions) => {
    console.log('Estaciones seleccionadas:', selectedOptions);
    setSelectedStations(selectedOptions);
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="process-form-container">
      <img src={BannerBackground} alt="Banner" className="banner-image" />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="form-wrapper">
        <h2>Registrar Proceso de Preparación</h2>
        <Formik
          initialValues={{
            selectedProduct: selectedProduct ? selectedProduct.value : '',
            selectedStations: selectedStations.map(station => station.EstacionID),
          }}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, handleSubmit }) => (
            <Form className="process-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Selecciona un Producto</h3>
                <Select
                  value={selectedProduct}
                  onChange={option => {
                    handleProductChange(option);
                    setFieldValue('selectedProduct', option ? option.value : '');
                  }}
                  options={products.map(product => ({
                    value: product.ProductoID,
                    label: product.Nombre,
                  }))}
                  placeholder="Selecciona un producto"
                />
              </div>
              <div className="form-section">
                <h3>Selecciona Estaciones</h3>
                <Select
                  value={selectedStations}
                  onChange={selectedOptions => {
                    handleStationChange(selectedOptions);
                    setFieldValue('selectedStations', selectedOptions.map(option => option.value));
                  }}
                  options={stations.map(station => ({
                    value: station.EstacionID,
                    label: station.Nombre,
                  }))}
                  isMulti
                  placeholder="Selecciona estaciones"
                />
              </div>
              <div className="submit-section">
                <button type="submit">Registrar Proceso</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateProcess;
