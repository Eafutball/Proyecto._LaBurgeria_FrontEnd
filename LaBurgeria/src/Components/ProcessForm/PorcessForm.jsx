import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductSelect from './ProductSelect'; // Component for selecting a product
import StationSelect from './StationSelect'; // Component for selecting stations
import './ProcessForm.css'; // Styles for the form
import ProcessServices from '../../services/ProcessServices';
import BannerBackground from "../../assets/home-banner-background.png";

const ProcessForm = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedStations, setSelectedStations] = useState([]);

  const handleSubmit = async () => {
    const processData = {
      ProductoID: Number(selectedProduct),
      Estaciones: selectedStations.map((station) => ({
        EstacionID: station.EstacionID,
      })),
    };

    // Log the processData to the console
    console.log('Submitting Process Data:', processData);

    try {
      const response = await ProcessServices.createProcess(processData);
      console.log('Proceso registrado:', response);
      toast.success('Proceso de preparación registrado con éxito');
    } catch (error) {
      console.error('Error al registrar el proceso:', error);
      toast.error('Hubo un error al registrar el proceso');
    }
  };

  // Log whenever the selected product changes
  const handleProductChange = (product) => {
    console.log('Selected product:', product);
    setSelectedProduct(product);
  };

  // Log whenever the selected stations change
  const handleStationChange = (stations) => {
    console.log('Selected stations:', stations);
    setSelectedStations(stations);
  };

  return (
    <div className="process-form-container"> {/* Main container */}
      <img src={BannerBackground} alt="Banner" className="banner-image" />

      <ToastContainer position="top-right" autoClose={3000} />

      <div className="form-wrapper"> {/* Wrapper for form */}
        <h2>Registrar Proceso de Preparación</h2>
        <Formik
          initialValues={{}} // No need for specific initial values here
          onSubmit={handleSubmit} // Submit handler
        >
          {({ handleSubmit }) => (
            <Form className="process-form" onSubmit={handleSubmit}>
              <div className="form-section"> {/* Section for product selection */}
                <h3>Selecciona un Producto</h3>
                <ProductSelect
                  selectedProduct={selectedProduct} // Pass the current selected product
                  setSelectedProduct={(product) => {
                    handleProductChange(product); // Update state and log
                  }}
                />
              </div>

              <div className="form-section"> {/* Section for station selection */}
                <h3>Selecciona Estaciones</h3>
                <StationSelect
                  selectedStations={selectedStations} // Pass the current selected stations
                  setSelectedStations={(stations) => {
                    handleStationChange(stations); // Update state and log
                  }}
                />
              </div>

              <div className="submit-section"> {/* Section for submit button */}
                <button type="submit">Registrar Proceso</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProcessForm;