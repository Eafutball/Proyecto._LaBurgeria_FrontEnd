import React, { useState, useEffect } from "react";
import PaymentHeader from "./PaymentHeader";
import PaymentMethod from "./PaymentMethod";
import PaymentForm from "./PaymentForm";
import PaymentConfirmation from "./PaymentConfirmation";
import { loadPedidoFromLocalStorage, removePedidoFromLocalStorage } from "../../constants/pedidoConstant";
import { Box, Container, Paper, CircularProgress, Snackbar, Alert } from "@mui/material"; // Importar componentes de MUI
import BannerBackground from '../../assets/home-banner-background.png';
import PedidoServices from "../../services/PedidoServices";

const PaymentLayout = () => {
    const pedido = loadPedidoFromLocalStorage();
    const [paymentMethod, setPaymentMethod] = useState(pedido.metdo_de_entrega || "Tarjeta"); // Estado para el método de pago
    const total = pedido.Total;
    const [cashAmount, setCashAmount] = useState(0);
    const [change, setChange] = useState(0);
    const [isPaid, setIsPaid] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Estado de carga
    const [errorMessage, setErrorMessage] = useState(""); // Estado para el mensaje de error
    const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito

    useEffect(() => {
        if (cashAmount >= total) {
            setChange(cashAmount - total); // Calcular el cambio si el monto en efectivo es mayor o igual al total
        } else {
            setChange(0);
        }
    }, [cashAmount, total]);

    const handleCashChange = (amount) => {
        setCashAmount(amount); // Actualizar el monto en efectivo
    };

    const handlePayment = async () => {
        try {
            setIsLoading(true); // Mostrar indicador de carga
            setIsPaid(true); // Indicar que el pago se ha realizado

            const updatedPedido = {
                PedidoID: +pedido.PedidoID, // Asegúrate de que el ID del pedido sea un número
                subtotal: pedido.subtotal,
                Total: pedido.Total,
                CostoEnvio: pedido.CostoEnvio,
                PersonalID: pedido.PersonalID,
                Estado: "Aceptada", // Cambiar el estado del pedido
                MetodoDeEntrega: pedido.metdo_de_entrega, // Asegúrate de que el nombre esté bien escrito
                MetodoDePago: paymentMethod, // Método de pago seleccionado
                encargado_asociado: pedido.encargado_asociado
            };
            

            const json = JSON.stringify(updatedPedido); // Convertir el objeto a JSON

            // Llamar a la API para actualizar el pedido
            await PedidoServices.updatePedido(json);
            removePedidoFromLocalStorage()
            // Mostrar mensaje de éxito
            setIsLoading(false);
            setSuccessMessage("Pago realizado con éxito. ¡Gracias por tu compra!"); // Mostrar mensaje de éxito
            console.log("Pedido actualizado exitosamente");

        } catch (error) {
            setIsLoading(false); // Detener indicador de carga
            setErrorMessage("Hubo un error al procesar el pago, por favor intenta nuevamente."); // Mostrar mensaje de error
            console.error("Error al actualizar el pedido:", error);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img src={BannerBackground} alt="Banner" className="banner-image" style={{ width: "100%", borderRadius: "8px" }} />

            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, backgroundColor: "#fafafa", width: "100%" }}>
                <PaymentHeader total={total} />

                <Box sx={{ mt: 3 }}>
                    <PaymentMethod setPaymentMethod={setPaymentMethod} />
                </Box>

                {!isPaid ? (
                    <Box sx={{ mt: 3 }}>
                        <PaymentForm
                            paymentMethod={paymentMethod}
                            total={total}
                            cashAmount={cashAmount}
                            change={change}
                            onCashChange={handleCashChange}
                            onPayment={handlePayment}
                        />
                    </Box>
                ) : (
                    <Box sx={{ mt: 3, textAlign: "center" }}>
                        <PaymentConfirmation/>
                    </Box>
                )}

                {/* Indicador de carga cuando el pago no se ha completado */}
                {isLoading && (
                    <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                        <CircularProgress />
                    </Box>
                )}

                {/* Mostrar mensaje de error si ocurre algún problema al procesar el pago */}
                {errorMessage && (
                    <Snackbar open={true} autoHideDuration={6000} onClose={() => setErrorMessage("")}>
                        <Alert severity="error">{errorMessage}</Alert>
                    </Snackbar>
                )}

                {/* Mostrar mensaje de éxito después del pago */}
                {successMessage && (
                    <Snackbar open={true} autoHideDuration={6000} onClose={() => setSuccessMessage("")}>
                        <Alert severity="success">{successMessage}</Alert>
                    </Snackbar>
                )}
            </Paper>
        </Container>
    );
};

export default PaymentLayout;
