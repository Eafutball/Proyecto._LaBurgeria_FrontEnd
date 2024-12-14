import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import MenuServices from '../../services/MenuServices';
import { format } from 'date-fns';
import './CreateMenu.css';

const CreateMenu = ({ setMenu }) => {
    const [nombre, setMenuName] = useState('');
    const [descripcion, setMenuDescription] = useState('');
    const [dia, setDay] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [formatoMenu, setFormatoMenu] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de día (solo permite lunes a viernes)
        const validDays = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
        if (!validDays.includes(dia.toLowerCase())) {
            setError("El día debe ser de lunes a viernes.");
            return;
        }

        // Validación de fechas
       

        const formattedStartDate = new Date(fechaInicio);
        const formattedEndDate = new Date(fechaFin);

     
        if (formattedEndDate < formattedStartDate) {
            setError("La fecha de inicio no debe ser mayor a la final");
            return;
        }

        // Validación de horas
        if (horaInicio >= horaFin) {
            setError("La hora de inicio debe ser anterior a la hora de fin.");
            return;
        }

        // Formateo de fechas
        const formattedStartDateString = format(formattedStartDate, 'yyyy-MM-dd');
        const formattedEndDateString = format(formattedEndDate, 'yyyy-MM-dd');

        try {
            // Envío de la solicitud al API
            const response = await MenuServices.createMenu({
                Nombre: nombre,
                Descripción: descripcion,
                Dia: dia,
                FechaInicio: formattedStartDateString,
                FechaFin: formattedEndDateString,
                HoraInicio: horaInicio,
                HoraFin: horaFin,
                FormatoMenu: formatoMenu,
            });

            setMenu(response.Menu);
            resetForm();
            setSuccess(true);
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Error al crear el menú.";
            setError(errorMsg);
        }
    };

    const resetForm = () => {
        setMenuName('');
        setMenuDescription('');
        setDay('');
        setFechaInicio('');
        setFechaFin('');
        setHoraInicio('');
        setHoraFin('');
        setFormatoMenu('');
        setError(null);
    };

    return (
        <div className="create-menu-container">
            <form onSubmit={handleSubmit}>
                {/* Nombre y Descripción */}
                <div className="form-section">
                    <h2>Crear Nuevo Menú</h2>
                    <div className="form-group">
                        <div className="form-field">
                            <TextField
                                label="Nombre"
                                variant="outlined"
                                fullWidth
                                value={nombre}
                                onChange={(e) => setMenuName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <TextField
                                label="Descripción"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                value={descripcion}
                                onChange={(e) => setMenuDescription(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Día de la Semana */}
                <div className="form-section">
                    <h3>Detalles del Menú</h3>
                    <div className="form-group">
                        <div className="form-field">
                            <FormControl fullWidth required>
                                <InputLabel>Día</InputLabel>
                                <Select
                                    value={dia}
                                    onChange={(e) => setDay(e.target.value)}
                                    label="Día"
                                >
                                    <MenuItem value="lunes">Lunes</MenuItem>
                                    <MenuItem value="martes">Martes</MenuItem>
                                    <MenuItem value="miércoles">Miércoles</MenuItem>
                                    <MenuItem value="jueves">Jueves</MenuItem>
                                    <MenuItem value="viernes">Viernes</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </div>

                {/* Fechas de Inicio y Fin */}
                <div className="form-section">
                    <h3>Fechas</h3>
                    <div className="form-group">
                        <div className="form-field">
                            <TextField
                                label="Fecha de Inicio"
                                type="date"
                                variant="outlined"
                                fullWidth
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <TextField
                                label="Fecha de Fin"
                                type="date"
                                variant="outlined"
                                fullWidth
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Horas de Inicio y Fin */}
                <div className="form-section">
                    <h3>Horarios</h3>
                    <div className="form-group">
                        <div className="form-field">
                            <TextField
                                label="Hora de Inicio"
                                type="time"
                                variant="outlined"
                                fullWidth
                                value={horaInicio}
                                onChange={(e) => setHoraInicio(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <TextField
                                label="Hora de Fin"
                                type="time"
                                variant="outlined"
                                fullWidth
                                value={horaFin}
                                onChange={(e) => setHoraFin(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Formato del Menú */}
                <div className="form-section">
                    <h3>Formato del Menú</h3>
                    <div className="form-group">
                        <div className="form-field">
                            <TextField
                                label="Formato del Menú"
                                variant="outlined"
                                fullWidth
                                value={formatoMenu}
                                onChange={(e) => setFormatoMenu(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Botón de envío */}
                <div className="form-section">
                    <div className="form-group">
                        <Button type="submit" variant="contained" color="primary">
                            Crear Menú
                        </Button>
                    </div>
                </div>

                {/* Mensajes de error y éxito */}
                {error && (
                    <div className="form-section">
                        <div className="form-group">
                            <Alert severity="error">{error}</Alert>
                        </div>
                    </div>
                )}

                <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
                    <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                        ¡Menú creado exitosamente!
                    </Alert>
                </Snackbar>
            </form>
        </div>
    );
};

CreateMenu.propTypes = {
    setMenu: PropTypes.func.isRequired,
};

export default CreateMenu;
