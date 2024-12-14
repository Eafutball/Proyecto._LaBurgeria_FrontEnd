import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import IngredientServices from '../../services/IngredientServices';

const IngredientSelect = ({ selectedIngredients, setSelectedIngredients }) => {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para obtener ingredientes desde el servicio
    const fetchIngredients = async () => {
        try {
            const fetchedIngredients = await IngredientServices.fetchAllIngredients();
            const ingredientsWithNumericId = fetchedIngredients.map(({ IngredienteID, Nombre }) => ({
                value: Number(IngredienteID),
                label: Nombre,
            }));
            setIngredients(ingredientsWithNumericId);
        } catch (err) {
            console.error('Error fetching ingredients:', err);
            setError('No se pudieron cargar los ingredientes. Inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar cambios en la selección de ingredientes
    const handleIngredientChange = (event, value) => {
        const selectedIds = value.map(option => option.value);
        setSelectedIngredients(selectedIds);
    };

    // Efecto para cargar ingredientes al montar el componente
    useEffect(() => {
        fetchIngredients();
    }, []);

    // Obtener los nombres de los ingredientes seleccionados
    const selectedIngredientNames = ingredients
        .filter(ingredient => selectedIngredients.includes(ingredient.value))
        .map(ingredient => ingredient.label)
        .join(', '); // Combina los nombres en una cadena separada por comas

    // Renderiza el mensaje de carga
    const renderLoading = () => <div className="loading-message">Cargando ingredientes...</div>;

    // Renderiza el mensaje de error
    const renderError = () => <div className="error-message">{error}</div>;

    // Renderiza el componente de selección de ingredientes
    const renderIngredientSelect = () => (
        <div>
            <h3>Seleccionar Ingredientes:</h3>
            <Autocomplete
                multiple
                options={ingredients}
                onChange={handleIngredientChange}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Ingredientes" placeholder="Selecciona ingredientes" />
                )}
            />
            {/* Mostrar los ingredientes seleccionados */}
            {selectedIngredients.length > 0 && (
                <div className="selected-ingredients">
                    <h4>Ingredientes Seleccionados:</h4>
                    <p>{selectedIngredientNames}</p>
                </div>
            )}
        </div>
    );

    // Decide qué renderizar
    if (loading) return renderLoading();
    if (error) return renderError();
    return renderIngredientSelect();
};

export default IngredientSelect;
