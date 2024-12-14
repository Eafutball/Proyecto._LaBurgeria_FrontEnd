import React, { useEffect, useState } from 'react';
import TopProductsChart from './TopProductsChart'; // Componente para los productos más pedidos
import OrderStateChart from './OrderStateChart'; // Componente para la cantidad de pedidos por estado

// Componentes de Material-UI
import { Grid, Typography, Paper, CircularProgress, AppBar, Toolbar, Container, Box, IconButton } from '@mui/material'; // Componentes Material-UI
import DashboardServices from '../../services/DashboardServices';
import MenuIcon from '@mui/icons-material/Menu'; // Icono de menú para el AppBar

const DashboardLayout = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [topCombos, setTopCombos] = useState([]);
  const [orderStateCount, setOrderStateCount] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching top products and combos...');
        const productsData = await DashboardServices.fetchTopProducts(); // Obtener los tres productos más pedidos
        console.log('Products and Combos fetched:', productsData);  // Ver el contenido de los datos obtenidos
        setTopProducts(productsData.top_products);
        setTopCombos(productsData.top_combos);

        // Crear un objeto con la fecha actual en el formato 'YYYY-MM-DD'
        const formattedDate = new Date();
        const dateObject = {
          FechaHora: formatDate(formattedDate),  // Usamos la función formatDate
        };
        console.log('JSON object for order state count:', dateObject);  // Ver el objeto JSON que se está enviando

        // Llamar al servicio con el objeto con la fecha formateada
        const orderStateData = await DashboardServices.fetchOrderCountByState(dateObject); // Obtener la cantidad de pedidos por estado
        console.log('Order state count fetched:', orderStateData);  // Ver el contenido de los datos de estados
        setOrderStateCount(orderStateData);

        setLoading(false); // Cambiar el estado de carga cuando los datos estén listos
      } catch (error) {
        console.error('Error fetching data for dashboard:', error);
        setLoading(false); // También desactivamos el loading si hay un error
      }
    };
    
    fetchData();
  }, []);

  // Función para formatear la fecha a 'YYYY-MM-DD'
  const formatDate = (date) => {
    const d = new Date(date);
    
    // Extraer las partes de la fecha
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Sumar 1 al mes, y agregar cero si es necesario
    const day = d.getDate().toString().padStart(2, '0');
    
    // Formatear la fecha en el formato deseado 'YYYY-MM-DD'
    return `${year}-${month}-${day}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column' }}>
        <CircularProgress size={50} sx={{ color: '#2196f3' }} />
        <Typography variant="h6" align="center" sx={{ marginTop: 2, color: '#555' }}>
          Cargando...
        </Typography>
      </Box>
    );
  }

  return (
    <div>
      {/* Barra de navegación */}
      <AppBar position="static" sx={{ backgroundColor: '#00796b', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: '24px' }}>
            Dashboard de Pedidos
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Contenedor principal */}
      <Container sx={{ marginTop: 4 }}>
        <Grid container spacing={4}>
          {/* Título de la sección */}
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 3, color: '#333', textAlign: 'center' }}>
              Resumen General
            </Typography>
          </Grid>
          
          {/* Componente para los productos más pedidos */}
          <Grid item xs={12} md={6}>
            <Paper elevation={6} sx={{ padding: 3, borderRadius: '16px', boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)', backgroundColor: '#f9f9f9' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2, color: '#00796b' }}>
                Productos Más Pedidos
              </Typography>
              <TopProductsChart topProducts={topProducts} topCombos={topCombos} />
            </Paper>
          </Grid>
          
          {/* Componente para la cantidad de pedidos por estado */}
          <Grid item xs={12} md={6}>
            <Paper elevation={6} sx={{ padding: 3, borderRadius: '16px', boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)', backgroundColor: '#f9f9f9' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2, color: '#00796b' }}>
                Cantidad de Pedidos por Estado
              </Typography>
              <OrderStateChart orderStateCount={orderStateCount} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default DashboardLayout;
