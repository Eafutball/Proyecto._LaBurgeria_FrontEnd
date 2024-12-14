import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Componentes de recharts
import PropTypes from 'prop-types'; // Importamos PropTypes

// Componentes de Material-UI
import { Paper, Typography, Grid } from '@mui/material'; // Componentes Material-UI

const OrderStateChart = ({ orderStateCount }) => {
  // Datos para el gráfico de estados de pedidos
  const orderStateData = orderStateCount.map(state => ({
    name: state.state,
    count: state.count,
  }));

  return (
    <Grid item xs={12} md={6}>
      <Paper elevation={3} sx={{
        padding: 3,
        borderRadius: '8px', // Bordes redondeados
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra sutil
        marginBottom: 4, // Espacio debajo del gráfico
      }}>
        <Typography variant="h5" sx={{
          marginBottom: 2, // Espacio debajo del título
          fontWeight: 'bold',
        }}>
          Cantidad de Pedidos por Estado
        </Typography>
        {/* Gráfico de barras para los estados de pedidos */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={orderStateData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Grid>
  );
};

// Definimos los tipos de las props
OrderStateChart.propTypes = {
  orderStateCount: PropTypes.arrayOf(
    PropTypes.shape({
      state: PropTypes.string.isRequired, // El estado debe ser una cadena
      count: PropTypes.number.isRequired, // El conteo debe ser un número
    })
  ).isRequired,
};

export default OrderStateChart;
