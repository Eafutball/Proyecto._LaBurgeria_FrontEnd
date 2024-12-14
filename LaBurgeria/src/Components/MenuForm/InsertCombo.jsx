import React, { useState, useEffect } from 'react';
import ComboServices from '../../services/ComboServices';
import MenuServices from '../../services/MenuServices';
import { 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Button, 
    CircularProgress, 
    Typography 
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';

const InsertCombo = ({ menuID }) => {
    const [selectedCombos, setSelectedCombos] = useState([]); // Renombrado para mayor claridad
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchedCombos, setFetchedCombos] = useState([]);

    useEffect(() => {
        const fetchCombos = async () => {
            console.log("Iniciando la carga de combos..."); // Indica el inicio de la carga
            setLoading(true);
            
            try {
                console.log("Enviando solicitud para obtener todos los combos."); // Mensaje antes de la solicitud
                const data = await ComboServices.getAllCombos();
                console.log("Respuesta recibida:", data); // Muestra la respuesta completa
    
                if (data.combos) {
                    console.log("Combos obtenidos:", data.combos); // Muestra los combos obtenidos
                    setFetchedCombos(data.combos);
                } else {
                    console.warn("No se encontraron combos en la respuesta."); // Alerta si no hay combos
                    const errorMessage = "No se encontraron combos.";
                    setError(errorMessage);
                    toast.error(errorMessage);
                }
            } catch (err) {
                console.error("Error fetching combos:", err); // Captura el error
                const errorMessage = "No se pudieron cargar los combos. Intenta de nuevo más tarde.";
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
                console.log("Carga de combos finalizada."); // Indica el final de la carga
            }
        };
    
        fetchCombos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Formulario enviado. Combos seleccionados:", selectedCombos); // Log de combos seleccionados
    
        try {
            const comboIDs = selectedCombos.map(combo => {
                const id = Number(combo); // Asegúrate de que sea un número
                return isNaN(id) ? 0 : id; // Cambia a 0 si no es un número válido
            });
    
            console.log("Enviando datos para insertar combos:", {
                MenúID: menuID,
                Combos: comboIDs, // Usa los comboIDs asegurándote que son enteros
            }); // Mensaje antes de la solicitud de inserción
    
            const response = await MenuServices.insertCombos({
                MenuID: menuID,
                Combos: comboIDs, // Aquí ya tienes los comboIDs como números enteros
            });
    
            console.log("Respuesta de la inserción de combos:", response); // Log de la respuesta de la inserción
            toast.success("Combo guardado exitosamente!");
            resetForm();
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Error al insertar el combo.";
            setError(errorMessage);
            console.error("Error al insertar el combo:", errorMessage); // Log de error de inserción
            toast.error(errorMessage);
        } finally {
            setLoading(false);
            console.log("Carga de datos de combo finalizada."); // Indica el final de la carga
        }
    };
    
    

    const resetForm = () => {
        setSelectedCombos([]);
        setError(null);
        console.log("Formulario reiniciado."); // Indica que el formulario ha sido reiniciado
    };

    return (
        <div>
            <Typography variant="h2">Insertar Combo</Typography>
            {loading && <CircularProgress />}
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel id="select-label">Selecciona los combos</InputLabel>
                    <Select
                        labelId="select-label"
                        multiple
                        value={selectedCombos}
                        onChange={(e) => setSelectedCombos(e.target.value)}
                        required
                    >
                        {fetchedCombos.map(combo => (
                            <MenuItem key={combo.ComboID} value={combo.ComboID}>
                                {combo.Nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    disabled={loading}
                >
                    Guardar Combo
                </Button>
                {error && <Typography color="error">{error}</Typography>}
            </form>
            <ToastContainer />
        </div>
    );
};

InsertCombo.propTypes = {
    menuID: PropTypes.number.isRequired,
};

export default InsertCombo;
