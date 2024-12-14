import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import PageNotFound from './Components/PageNotFound.jsx';
import LayoutProducts from './Components/Products/LayoutProducts.jsx';
import Home from './Components/Home';
import ProductDetail from './Components/Details/ProductDetail.jsx';
import ComboDetail from './Components/Details/ComboDetail.jsx';
import LayoutCombos from './Components/Combos/LayoutCombos.jsx';
import MenuLayout from './Components/Menu/MenuLayout.jsx';
import ProcessLayout from './Components/Procesos/ProcessLayout .jsx';
import ProductForm from './Components/ProductForm/ProductForm.jsx';
import UpdateForm from './Components/ProductForm/UpdateForm.jsx';
import ComboForm from './Components/ComboForm/ComboForm.jsx';
import UpdateCombo from './Components/ComboForm/UpdateCombo.jsx';
import ProcessForm from './Components/ProcessForm/PorcessForm.jsx';
import UpdateProcess from './Components/ProcessForm/UpdateProcess.jsx';
import MenuFormLayout from './Components/MenuForm/MenuFormLayout.jsx';
import UpdateMenuForm from './Components/MenuForm/UpdateMenuForm.jsx';
import PedidoLayout from './Components/Pedidos/PedidoLayout.jsx';
import Invoice from './Components/Invoice/Invoice.jsx';
import PaymentLayout from './Components/Payment/PaymentLayout.jsx';
import Login from './Components/Login/Login.jsx';
import UserProvider from './Context/UserContext.jsx';
import { Logout } from './Components/Login/Logout.jsx';
import PedidoInvoice from './Components/Detail/PedidoInvoice.jsx';
import { Auth } from './Components/Auth/Auth.jsx';
import RegisterLayout from './Components/Register/RegisterLayout.jsx';
import KitchenApp from './Components/Kitchen/KitchenApp.jsx';
import DashboardLayout from './Components/DashBoard/DashboardLayout.jsx';

const rutas = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <Home /> },
      { path: '/productos', element: <LayoutProducts /> },
      { path: '/details/:ProductoID', element: <ProductDetail /> },
      { path: '/detailsCombo/:ComboID', element: <ComboDetail /> },
      { path: '/combos', element: <LayoutCombos /> },
      { path: '/menu', element: <MenuLayout /> },
      { path: '/processes', element: <ProcessLayout /> },

      // Rutas públicas
      { path: '/login', element: <Login /> },
      { path: '/logout', element: <Logout /> },
      { path: '/register-user', element: <RegisterLayout/> },

      // Rutas protegidas que requieren roles específicos
      {
        path: '/create-product',
        element: <Auth requiredRoles={['Administrador']} />,
        children: [{ path: '', element: <ProductForm /> }],
      },
      {
        path: '/dashboard',
        element: <Auth requiredRoles={['all']} />, // Ruta protegida para Admin
        children: [{ path: '', element: <DashboardLayout /> }],
      },
      {
        path: '/kitchen/dashboard',
        element: <Auth requiredRoles={["all"]} />,
        children: [{ path: '', element: <KitchenApp /> }],
      },
      {
        path: '/update-product/:ProductoID',
        element: <Auth requiredRoles={['Administrador']} />,
        children: [{ path: '', element: <UpdateForm /> }],
      },
      {
        path: '/create-combo',
        element: <Auth requiredRoles={['Administrador']} />,
        children: [{ path: '', element: <ComboForm /> }],
      },
      {
        path: '/update-combo/:comboID',
        element: <Auth requiredRoles={['Administrador']} />,
        children: [{ path: '', element: <UpdateCombo /> }],
      },
      {
        path: '/create-process',
        element: <Auth requiredRoles={['Administrador',"Cocina"]} />,
        children: [{ path: '', element: <ProcessForm /> }],
      },
      {
        path: '/update-process/:ProductoID',
        element: <Auth requiredRoles={['Administrador',"Cocina"]} />,
        children: [{ path: '', element: <UpdateProcess /> }],
      },
      {
        path: '/create-menu',
        element: <Auth requiredRoles={['Administrador']} />,
        children: [{ path: '', element: <MenuFormLayout /> }],
      },
      {
        path: '/update/:MenuID',
        element: <Auth requiredRoles={['Administrador']} />,
        children: [{ path: '', element: <UpdateMenuForm /> }],
      },
      {
        path: '/pedido-history',
        element: <Auth requiredRoles={["all"]} />,
        children: [{ path: '', element: <PedidoLayout /> }],
      },
      {
        path: '/create-pedido',
        element: <Auth requiredRoles={["all"]} />,
        children: [{ path: '', element: <Invoice /> }],
      },
      {
        path: '/payment',
        element: <Auth requiredRoles={['all']} />,
        children: [{ path: '', element: <PaymentLayout /> }],
      },

      // Rutas de detalles de pedido
      { path: '/pedido-detail/:id', element: <PedidoInvoice /> },

      // Ruta para manejar 404
      { path: '*', element: <PageNotFound /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={rutas} />
    </UserProvider>
  </StrictMode>
);
