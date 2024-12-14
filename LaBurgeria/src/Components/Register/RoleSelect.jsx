import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types'; // Importa PropTypes
import RolesServices from '../../services/RolServices';

const RoleSelect = ({ name, label, value, onChange, error }) => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);  // Manejo de errores en la carga de roles

    // Función para obtener los roles
    const fetchRoles = async () => {
        try {
            setLoading(true);
            const response = await RolesServices.getAllRoles();
            setRoles(response.roles); // Establece los roles en el estado
        } catch (err) {
            console.error('Error al cargar roles:', err);
            setFetchError('Hubo un error al cargar los roles.'); // Establece un mensaje de error
        } finally {
            setLoading(false);
        }
    };

    // Ejecutar la función fetchRoles cuando el componente se monte
    useEffect(() => {
        if (roles.length === 0) {
            fetchRoles();
        }
    }, [roles.length]);

    // Asignar valor predeterminado si no está definido
    useEffect(() => {
        if (roles.length > 0 && (value === '' || value === undefined)) {
            onChange({ target: { name, value: roles[0].RolID } });  // Asigna un valor predeterminado al primer rol
        }
    }, [roles, value, name, onChange]);

    if (loading) {
        return <CircularProgress />; // Muestra un indicador de carga mientras se cargan los roles
    }

    return (
        <FormControl fullWidth error={Boolean(error || fetchError)}>
            <InputLabel>{label}</InputLabel>
            <Select
                name={name}
                value={value || ''}  // Usa '' si value es undefined o null
                onChange={onChange}
                label={label}
                aria-labelledby={name}
            >
                {roles.map((role) => (
                    <MenuItem key={role.RolID} value={role.RolID}>
                        {role.Nombre}
                    </MenuItem>
                ))}
            </Select>
            {(error || fetchError) && <FormHelperText>{error?.message || fetchError}</FormHelperText>}
        </FormControl>
    );
};

// Validación de las props con PropTypes
RoleSelect.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.object,
};

export default RoleSelect;
