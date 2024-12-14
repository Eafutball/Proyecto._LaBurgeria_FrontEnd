import React, { useState, useEffect, useMemo } from "react";
import PedidoServices from "../../services/PedidoServices";
import Pusher from "pusher-js";
import PedidoFilters from "./PedidoFilters";
import PedidoTable from "./PedidoTable";
import { CircularProgress, Typography } from "@mui/material";
import { useUser } from "../../Hooks/useUser";
import { format } from "date-fns";
import debounce from "lodash.debounce"; // Importa debounce

const PedidoList = () => {
  // **Estados**
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: "", date: "" });

  // **Usuario**
  const { user, decodeToken } = useUser();
  const [userData, setUserData] = useState(null);

  // **Efectos**
  useEffect(() => {
    if (user) {
      try {
        const decoded = decodeToken();
        console.log("Token decodificado:", decoded); // Log para ver el token decodificado
        if (decoded) {
          setUserData(decoded);
        } else {
          setError("Token no válido o no se pudo decodificar.");
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setError("Error al decodificar el token.");
      }
    } else {
      setUserData(null);
      setError(null);
    }
  }, [user, decodeToken]);

  // Carga de pedidos
  useEffect(() => {
    if (userData) {
      const fetchPedidos = async () => {
        setLoading(true);
        try {
          console.log("Cargando pedidos para el usuario:", userData.id); // Log para saber qué usuario está cargando los pedidos
          const response = await PedidoServices.getAllPedidosByCliente(userData.id);

          // Validación de respuesta
          if (response) {
            console.log("Pedidos cargados:", response);
            setPedidos(response || []); // Asegurarse que los pedidos existen en la respuesta
          } else {
            setError("El cliente no tiene pedidos.");
          }
        } catch (error) {
          console.error("Error al cargar los pedidos:", error);
          setError("Error al cargar los pedidos.");
        } finally {
          setLoading(false);
        }
      };
      
      // Si el usuario es Admin o Encargado, se cargan todos los pedidos
      if (userData.rol === "Administrador" || userData.rol === "Encargado") {
        const fetchAllPedidos = async () => {
          setLoading(true);
          try {
            const response = await PedidoServices.getAllPedidos(); // Obtener todos los pedidos
            if (response) {
              setPedidos(response || []);
            } else {
              setError("No se encontraron pedidos.");
            }
          } catch (error) {
            console.error("Error al cargar los pedidos:", error);
            setError("Error al cargar los pedidos.");
          } finally {
            setLoading(false);
          }
        };
        fetchAllPedidos();
      } else {
        fetchPedidos(); // Cargar solo los pedidos del cliente
      }
    }
  }, [userData]);

  // Pusher para actualizaciones en tiempo real
  useEffect(() => {
    const pusher = new Pusher("033f56d291bc76d4c2c0", { cluster: "eu" });
    const channel = pusher.subscribe("LaBurgeria");

    channel.bind("new-pedido", (data) => {
      console.log("Nuevo pedido recibido por Pusher:", data); // Log cuando un nuevo pedido llega
      setPedidos((prev) => [data, ...prev]);
    });

    channel.bind("update-pedido", (data) => {
      console.log("Pedido actualizado por Pusher:", data); // Log cuando un pedido es actualizado
      setPedidos((prev) =>
        prev.map((item) =>
          item.PedidoID === data.PedidoID ? { ...item, ...data } : item
        )
      );
    });

    return () => pusher.unsubscribe("LaBurgeria");
  }, []);

  // **Filtrado de Pedidos**
  const filteredPedidosMemo = useMemo(() => {
    console.log("Aplicando filtros:", filters); // Log para ver los filtros aplicados
    return pedidos.filter((pedido) => {
      const isStatusMatch = filters.status ? pedido.Estado === filters.status : true;
      const isDateMatch = filters.date
        ? format(new Date(pedido.FechaHora), "yyyy-MM-dd") === filters.date
        : true;
      return isStatusMatch && isDateMatch;
    });
  }, [pedidos, filters]);

  useEffect(() => {
    console.log("Pedidos filtrados:", filteredPedidosMemo); // Log para ver los pedidos filtrados
    setFilteredPedidos(filteredPedidosMemo);
  }, [filteredPedidosMemo]);

  // **Manejadores**
  const handleResetFilters = () => {
    console.log("Filtros restablecidos");
    setFilters({ status: "", date: "" });
  };

  const handleStatusFilterChange = (value) => {
    console.log("Filtro de estado cambiado:", value); // Log para ver el nuevo valor del filtro de estado
    setFilters((prev) => ({ ...prev, status: value }));
  };

  // Usamos debounce para el filtro de fecha
  const handleDateFilterChange = debounce((value) => {
    console.log("Filtro de fecha cambiado:", value); // Log para ver el nuevo valor del filtro de fecha
    setFilters((prev) => ({ ...prev, date: value }));
  }, 500); // 500ms de espera

  // **Renderizado de Estados**
  if (loading) {
    return (
      <CircularProgress sx={{ display: "block", margin: "auto", padding: 3 }} />
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="h6" align="center">
        {error}
      </Typography>
    );
  }

  if (!pedidos.length) {
    return (
      <Typography variant="h6" align="center">
        No hay pedidos disponibles en este momento.
      </Typography>
    );
  }

  if (!filteredPedidos.length) {
    return (
      <Typography variant="h6" align="center">
        No se encontraron pedidos que coincidan con los filtros.
      </Typography>
    );
  }

  // **Renderizado Principal**
  return (
    <div>
      {(userData.rol === "Administrador" || userData.rol === "Encargado") && (
        <PedidoFilters
          statusFilter={filters.status}
          setStatusFilter={handleStatusFilterChange}
          dateFilter={filters.date}
          setDateFilter={handleDateFilterChange} // Pasamos el debounce aquí
          handleResetFilters={handleResetFilters}
        />
      )}
      <PedidoTable filteredPedidos={filteredPedidos} />
    </div>
  );
};

export default PedidoList;
