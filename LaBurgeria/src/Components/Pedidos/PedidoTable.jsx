import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import PropTypes from "prop-types";

const PedidoTable = ({ filteredPedidos }) => {
  return (
    <TableContainer component={Paper} elevation={3} sx={{ maxHeight: "500px" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Lista de Pedidos
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Cliente</strong></TableCell>
            <TableCell><strong>Fecha</strong></TableCell>
            <TableCell><strong>Total ($)</strong></TableCell> {/* Cambio a dólar */}
            <TableCell><strong>Estado</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPedidos.map((pedido) => (
            <TableRow
              key={pedido.PedidoID}
              hover
              component={Link} // Mejorando la accesibilidad y el enlace
              to={`/pedido-detail/${pedido.PedidoID}`}
              sx={{
                textDecoration: "none",
                "&:hover": {
                  backgroundColor: "#f5f5f5", // Mejorar el color al pasar el mouse
                },
              }}
            >
              <TableCell>{pedido.PedidoID}</TableCell>
              <TableCell>{pedido.PersonalID || "Sin asignar"}</TableCell>
              <TableCell>
                {pedido.FechaHora ? format(new Date(pedido.FechaHora), "dd/MM/yyyy HH:mm") : "Fecha no disponible"}
              </TableCell>
              <TableCell>
                ${pedido.Total} {/* Cambio a dólares y formateo a dos decimales */}
              </TableCell>
              <TableCell>{pedido.Estado || "Pendiente"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// PropTypes validation for filteredPedidos
PedidoTable.propTypes = {
  filteredPedidos: PropTypes.arrayOf(
    PropTypes.shape({
      PedidoID: PropTypes.number.isRequired,
      PersonalID: PropTypes.string,
      FechaHora: PropTypes.string,
      Total: PropTypes.number.isRequired,
      Estado: PropTypes.string
    })
  ).isRequired
};

export default PedidoTable;
