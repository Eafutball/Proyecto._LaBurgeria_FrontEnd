import React, { useState, useEffect } from "react";
import { CircularProgress, Typography, Paper, Divider, Container } from "@mui/material";
import PedidoServices from "../../services/PedidoServices";
import { useParams } from "react-router-dom";
import FacturaHeader from "./FacturaHeader";
import FacturaInfo from "./FacturaInfo";
import FacturaProductos from "./FacturaProductos";
import FacturaResumen from "./FacturaResumen";
import BannerBackground from "../../assets/home-banner-background.png";

const PedidoInvoice = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidoDetail = async () => {
      try {
        const response = await PedidoServices.getPedido(+id);
        setPedido(response);
      } catch (err) {
        setError("Error al cargar los detalles del pedido.");
      } finally {
        setLoading(false);
      }
    };

    fetchPedidoDetail();
  }, [id]);

  if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", padding: 3 }} />;
  if (error) return <Typography color="error" variant="h6" align="center">{error}</Typography>;

  if (!pedido) {
    return <Typography variant="h6" align="center">No se encontró el pedido.</Typography>;
  }

  return (
    <Container maxWidth="lg">
              <img src={BannerBackground} alt="Banner" className="banner-image" />

      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <FacturaHeader pedido={pedido} />
        <Divider sx={{ margin: "20px 0" }} />
        <FacturaInfo pedido={pedido} />
        <Divider sx={{ margin: "20px 0" }} />
        <FacturaProductos pedido={pedido} />
        <Divider sx={{ margin: "20px 0" }} />
        <FacturaResumen pedido={pedido} />
      </Paper>
    </Container>
  );
};

export default PedidoInvoice;
