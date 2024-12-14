import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import PropTypes from "prop-types";
import PedidoServices from "../../services/PedidoServices";

const FacturaProductos = ({ pedido }) => {
  const [productosYCombos, setProductosYCombos] = useState([]);

  // Función para obtener productos y combos del pedido
  const fetchProductos = async () => {
    try {
      const productosData = await PedidoServices.getProductsByPedido(
        pedido.PedidoID
      );

      if (productosData && productosData.length > 0) {
        setProductosYCombos(productosData);
      } else {
        console.warn(
          "No se encontraron productos ni combos en la respuesta:",
          productosData
        );
      }
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [pedido.PedidoID]);

  return (
    <Box sx={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Título */}
      <Typography
        variant="h5"
        align="center"
        sx={{ marginBottom: "20px", fontWeight: "bold" }}
      ></Typography>
      <Divider sx={{ marginBottom: "20px" }} />

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          {/* Encabezado de la tabla */}
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Producto</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Cantidad</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Precio Unitario</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Subtotal</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Observaciones</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Cuerpo de la tabla */}
          <TableBody>
            {productosYCombos && productosYCombos.length > 0 ? (
              productosYCombos.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.Nombre}</TableCell>
                  <TableCell align="center">{item.cantidad}</TableCell>
                  <TableCell align="right">${item.Precio}</TableCell>
                  <TableCell align="right">
                    ${item.cantidad * item.Precio}
                  </TableCell>
                  <TableCell align="right">{item.observaciones}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No hay productos ni combos en este pedido.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

FacturaProductos.propTypes = {
  pedido: PropTypes.shape({
    PedidoID: PropTypes.number.isRequired,
  }).isRequired,
};

export default FacturaProductos;
