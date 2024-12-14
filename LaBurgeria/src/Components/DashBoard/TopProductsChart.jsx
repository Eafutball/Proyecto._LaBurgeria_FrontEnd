import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Componentes de recharts
import PropTypes from 'prop-types'; // Importamos PropTypes

// Componentes de Material-UI
import { Paper, Typography, Grid } from '@mui/material'; // Componentes Material-UI

const TopProductsChart = ({ topProducts, topCombos }) => {
  // Datos para el gráfico de productos
  const topProductsData = topProducts.map(product => ({
    name: product.nombreProducto,
    count: parseInt(product.totalPedidos, 10), // Asegúrate de que el totalPedidos sea un número
  }));

  // Datos para el gráfico de combos
  const topCombosData = topCombos.map(combo => ({
    name: combo.nombreCombo,
    count: parseInt(combo.totalPedidos, 10), // Asegúrate de que el totalPedidos sea un número
  }));

  return (
    <Grid container spacing={3}>
      {/* Gráfico de Productos Más Pedidos */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{
          padding: 3,
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: 4,
        }}>
          <Typography variant="h5" sx={{
            marginBottom: 2,
            fontWeight: 'bold',
          }}>
            Top 3 Productos Más Pedidos
          </Typography>
          {/* Gráfico de barras para productos */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="rgba(75, 192, 192, 0.8)" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Gráfico de Combos Más Pedidos */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{
          padding: 3,
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: 4,
        }}>
          <Typography variant="h5" sx={{
            marginBottom: 2,
            fontWeight: 'bold',
          }}>
            Top 3 Combos Más Pedidos
          </Typography>
          {/* Gráfico de barras para combos */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCombosData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="rgba(153, 102, 255, 0.8)" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

TopProductsChart.propTypes = {
  topProducts: PropTypes.arrayOf(
    PropTypes.shape({
      nombreProducto: PropTypes.string.isRequired,
      totalPedidos: PropTypes.string.isRequired, // Asegúrate de que el totalPedidos sea una cadena
    })
  ).isRequired,
  topCombos: PropTypes.arrayOf(
    PropTypes.shape({
      nombreCombo: PropTypes.string.isRequired,
      totalPedidos: PropTypes.string.isRequired, // Asegúrate de que el totalPedidos sea una cadena
    })
  ).isRequired,
};

export default TopProductsChart;
