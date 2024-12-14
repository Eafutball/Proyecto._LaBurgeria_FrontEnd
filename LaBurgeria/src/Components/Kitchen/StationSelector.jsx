import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CocinaServices from '../../services/CocinaServices';

const StationSelector = ({ onSelectStation, setStationsStatus, selectedOrder }) => {
  const [localStations, setLocalStations] = useState([]);
  const [orderStatus, setOrderStatus] = useState(selectedOrder.Estado);

  const estadoColores = {
    'En Preparación': '#F5432',  // Rojo
    'Listo': '#A7F3A7',          // Verde claro
    'Entregado': '#4B4B4B',      // Gris oscuro
  };

  const estados = [
    'En Preparación',  // Rojo
    'Listo',           // Verde claro
    'Entregado',       // Gris oscuro
  ];

  const handleStationSelect = (station) => {
    // Verificar si la estación ya está en el último estado
    if (station.Estado === 'Entregado') {
      return;  // No hace nada si la estación ya está entregada
    }

    // Determinar el siguiente estado en la lista de estados
    const currentStateIndex = estados.indexOf(station.Estado);
    const nextState = estados[currentStateIndex + 1] || null;  // Avanza al siguiente estado

    if (!nextState) {
      return; // Si no hay siguiente estado, no hace nada
    }

    console.log('Seleccionada estación:', station);
    console.log('Estado siguiente:', nextState);

    // Actualizar el estado de la estación en `setStationsStatus`
    setStationsStatus(prev => {
      const updatedStatus = { ...prev, [station.EstacionID]: nextState };
      console.log('Estado actualizado en setStationsStatus:', updatedStatus);
      return updatedStatus;
    });

    // Realizar el paso de proceso
    handleProcessStep(station.EstacionID, nextState);

    // Actualizar el estado de las estaciones locales
    setLocalStations(prev => {
      const updatedStations = prev.map(s =>
        s.EstacionID === station.EstacionID ? { ...s, Estado: nextState } : s
      );
      console.log('Estaciones después de la actualización:', updatedStations);
      return updatedStations;
    });

    // Llamar a la función onSelectStation con la estación seleccionada
    onSelectStation(station);
  };

  const handleProcessStep = async (stationId, newState) => {
    try {
      console.log("Enviando datos para actualizar la estación:", { PedidoID: selectedOrder.PedidoID, nuevoEstado: newState });
      const response = await CocinaServices.update(JSON.stringify({ PedidoID: selectedOrder.PedidoID, nuevoEstado: newState }));
      console.log("Respuesta del servidor:", response);
    } catch (error) {
      console.error("Error procesando paso:", error);
    }
  };

  const fetchStations = async () => {
    try {
      const response = await CocinaServices.getAllStations(+selectedOrder.PedidoID);
      setLocalStations(response.data);
    } catch (error) {
      console.error("Error obteniendo estaciones:", error);
    }
  };

  const updateOrderStatus = () => {
    const totalStations = localStations.length;
    const counts = localStations.reduce((acc, station) => {
      acc[station.Estado] = (acc[station.Estado] || 0) + 1;
      return acc;
    }, {});

    if (counts['Entregado'] === totalStations) {
      setOrderStatus('Entregado');
    } else if (counts['Listo'] === totalStations) {
      setOrderStatus('Listo');
    } else if (counts['En Preparación'] > 0) {
      setOrderStatus('En Preparación');
    }
  };

  useEffect(() => {
    fetchStations();
  }, [selectedOrder]);

  useEffect(() => {
    updateOrderStatus();
  }, [localStations]);

  return (
    <div className="station-selector">
      <h3>Selecciona una Estación</h3>
      <ul>
        {localStations.map((station) => (
          <li
            key={station.EstacionID}
            onClick={() => handleStationSelect(station)}
            style={{ cursor: 'pointer', fontWeight: 'bold', padding: '10px', backgroundColor: estadoColores[station.Estado] || '#A6D0FF' }}
          >
            {station.Nombre} - Estado: {station.Estado}
          </li>
        ))}
      </ul>
      <h4>Estado del Pedido: {orderStatus}</h4>
      <div style={{ backgroundColor: estadoColores[orderStatus] || '#A6D0FF', padding: '10px', color: '#fff' }}>
        {orderStatus}
      </div>
    </div>
  );
};

StationSelector.propTypes = {
  onSelectStation: PropTypes.func.isRequired,
  setStationsStatus: PropTypes.func.isRequired,
  selectedOrder: PropTypes.object.isRequired,
};

export default StationSelector;
