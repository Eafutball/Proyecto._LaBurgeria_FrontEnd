import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import MenuServices from '../../services/MenuServices';
import { format } from 'date-fns';
import './UpdateMenuForm.css';
import { useParams } from 'react-router-dom';
import ComboServices from '../../services/ComboServices';
import ProductServices from '../../services/ProductServices';
import BannerBackground from '../../assets/home-banner-background.png';

const UpdateMenuForm = () => {
  const { MenuID } = useParams();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    dia: '',
    fechaInicio: '',
    fechaFin: '',
    horaInicio: '',
    horaFin: '',
    formatoMenu: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [productosPrecargados, setProductos] = useState([]);
  const [combosPrecargados, setCombos] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState([]);
  const [noProducts, setNoProducts] = useState(false);
  const [noCombos, setNoCombos] = useState(false);

  useEffect(() => {
    const cargarMenu = async () => {
      try {
        console.log(`Cargando menú con ID: ${MenuID}`);
        const menu = await MenuServices.getMenu(+MenuID);
        setFormData({
          nombre: menu.Nombre,
          descripcion: menu.Descripción,
          dia: menu.Dia.toLowerCase(),
          fechaInicio: menu.FechaInicio,
          fechaFin: menu.FechaFin,
          horaInicio: menu.HoraInicio,
          horaFin: menu.HoraFin,
          formatoMenu: menu.FormatoMenu,
        });
        console.log('Menú cargado:', menu);
        await Promise.all([fetchProductos(), fetchCombos()]);
      } catch (err) {
        handleError(err, 'Error al cargar el menú');
      }
    };

    cargarMenu();
  }, [MenuID]);

  const fetchProductos = async () => {
    try {
      const productos = await ProductServices.getFullProductList();
      setProductos(productos.data);
      setNoProducts(productos.length === 0);
    } catch (err) {
      handleError(err, 'Error al cargar los productos');
    }
  };

  const fetchCombos = async () => {
    try {
      const combos = await ComboServices.getAllCombos();
      setCombos(combos.combos);
      setNoCombos(combos.length === 0);
    } catch (err) {
      handleError(err, 'Error al cargar los combos');
    }
  };

  const handleError = (err, defaultMessage) => {
    const errorMsg = err.response?.data?.error || defaultMessage;
    setError(errorMsg);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const { dia, fechaInicio, fechaFin, horaInicio, horaFin } = formData;
    const validDays = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];

    if (!validDays.includes(dia)) {
      setError('El día seleccionado no es válido. Debe ser uno de: lunes, martes, miércoles, jueves, viernes.');
      return false;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      setError('La fecha de inicio no puede ser mayor que la fecha de fin.');
      return false;
    }

    if (horaInicio >= horaFin) {
      setError('La hora de inicio debe ser menor que la hora de fin.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { nombre, descripcion, dia, fechaInicio, fechaFin, horaInicio, horaFin, formatoMenu } = formData;

    try {
      const response = await MenuServices.updateMenu({
        MenúID: +MenuID,
        Nombre: nombre,
        Descripcion: descripcion,
        Dia: dia,
        FechaInicio: format(new Date(fechaInicio), 'yyyy-MM-dd'),
        FechaFin: format(new Date(fechaFin), 'yyyy-MM-dd'),
        HoraInicio: horaInicio,
        HoraFin: horaFin,
        FormatoMenu: formatoMenu,
        Productos: selectedProducts.map(producto => Number(producto)),
        Combos: selectedCombos.map(combo => Number(combo)),
      });
      setSuccess(true);
      resetForm();
    } catch (err) {
      handleError(err, 'Error al actualizar el menú.');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      dia: '',
      fechaInicio: '',
      fechaFin: '',
      horaInicio: '',
      horaFin: '',
      formatoMenu: '',
    });
    setSelectedProducts([]);
    setSelectedCombos([]);
    setError(null);
  };

  return (
    <div className="create-menu-container">
      <div className="header-section">
        <h1>Formulario de Actualización de Menú</h1>
      </div>
      <img src={BannerBackground} alt="Banner" className="banner-image" />

      <form onSubmit={handleSubmit}>
        <div className="intro-section">
          <p>Por favor, complete la información para actualizar el menú.</p>
        </div>

        {/* Nombre y Descripción */}
        <div className="form-section">
          <div className="form-item">
            <TextField label="Nombre" variant="outlined" fullWidth name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>
          <div className="form-item">
            <TextField label="Descripción" variant="outlined" fullWidth multiline rows={4} name="descripcion" value={formData.descripcion} onChange={handleChange} required />
          </div>
        </div>

        {/* Día de la Semana */}
        <div className="day-section form-section">
          <h3>Detalles del Menú</h3>
          <div className="form-item">
            <FormControl fullWidth required>
              <InputLabel>Día</InputLabel>
              <Select name="dia" value={formData.dia} onChange={handleChange} label="Día">
                {['lunes', 'martes', 'miércoles', 'jueves', 'viernes'].map((day) => (
                  <MenuItem key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Fechas de Inicio y Fin */}
        <div className="date-section form-section">
          <h3>Fechas</h3>
          <div className="form-item">
            <TextField label="Fecha de Inicio" type="date" variant="outlined" fullWidth name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
          </div>
          <div className="form-item">
            <TextField label="Fecha de Fin" type="date" variant="outlined" fullWidth name="fechaFin" value={formData.fechaFin} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
          </div>
        </div>

        {/* Horarios */}
        <div className="time-section form-section">
          <h3>Horarios</h3>
          <div className="form-item">
            <TextField label="Hora de Inicio" type="time" variant="outlined" fullWidth name="horaInicio" value={formData.horaInicio} onChange={handleChange} required />
          </div>
          <div className="form-item">
            <TextField label="Hora de Fin" type="time" variant="outlined" fullWidth name="horaFin" value={formData.horaFin} onChange={handleChange} required />
          </div>
        </div>

        {/* Formato del Menú */}
        <div className="format-section form-section">
          <h3>Formato del Menú</h3>
          <div className="form-item">
            <TextField label="Formato del Menú" variant="outlined" fullWidth name="formatoMenu" value={formData.formatoMenu} onChange={handleChange} />
          </div>
        </div>

        {/* Selección de Productos */}
        <div className="products-section form-section">
          <h3>Seleccionar Productos</h3>
          <div className="form-item">
            <FormControl fullWidth>
              <InputLabel>Productos</InputLabel>
              <Select multiple value={selectedProducts} onChange={(e) => setSelectedProducts(e.target.value)}>
                {productosPrecargados.map((producto) => (
                  <MenuItem key={producto.ProductoID} value={producto.ProductoID}>
                    {producto.Nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Selección de Combos */}
        <div className="combos-section form-section">
          <h3>Seleccionar Combos</h3>
          <div className="form-item">
            <FormControl fullWidth>
              <InputLabel>Combos</InputLabel>
              <Select multiple value={selectedCombos} onChange={(e) => setSelectedCombos(e.target.value)}>
                {combosPrecargados.map((combo) => (
                  <MenuItem key={combo.ComboID} value={combo.ComboID}>
                    {combo.Nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Botón de Envío */}
        <div className="submit-section form-section">
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Actualizar Menú
          </Button>
        </div>

        {/* Alertas de Error y Éxito */}
        <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
          <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
            Menú actualizado con éxito.
          </Alert>
        </Snackbar>
      </form>
    </div>
  );
};

export default UpdateMenuForm;
