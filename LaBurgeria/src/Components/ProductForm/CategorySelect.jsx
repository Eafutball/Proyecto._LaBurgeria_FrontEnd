import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CategoryServices from '../../services/CategoryServices'; 
import './CategorySelect.css'; 

const CategorySelect = ({ selectedCategory, onCategoryChange }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await CategoryServices.fetchAllCategories();
                setCategories(fetchedCategories);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (event) => {
        const selectedValue = event.target.value; // ID de la categoría
        // Convierte el valor seleccionado a número
        onCategoryChange(selectedValue ? parseInt(selectedValue, 10) : ''); // Se pasa el ID al componente padre
    };

    return (
        <div className="category-select-container">
            {loading && <p className="loading-message">Cargando categorías...</p>}
            {error && <p className="error-message">Error: {error}</p>}
            {!loading && !error && (
                <div className="category-select-wrapper">
                    <label htmlFor="category-select" className="category-select-label">
                        Selecciona una categoría:
                    </label>
                    <select
                        id="category-select"
                        value={selectedCategory}
                        onChange={handleChange}
                        className="category-select-dropdown"
                    >
                        <option value="">Seleccione una categoría</option>
                        {categories.map((category) => (
                            <option key={category.CategoríaID} value={category.CategoríaID}>
                                {category.Nombre}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

CategorySelect.propTypes = {
    selectedCategory: PropTypes.string.isRequired,
    onCategoryChange: PropTypes.func.isRequired,
};

export default CategorySelect;
