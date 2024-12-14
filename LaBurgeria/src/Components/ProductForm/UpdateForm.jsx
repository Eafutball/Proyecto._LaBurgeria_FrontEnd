import React, { useEffect, useState } from "react";
import PropTypes from "prop-types"; 
import { ToastContainer, toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import CategorySelect from "./CategorySelect";
import IngredientSelect from "./IngredientSelect";
import ProductServices from "../../services/ProductServices";
import BannerBackground from "../../assets/home-banner-background.png";
import "./UpdateForm.css";
import { useParams } from "react-router-dom";
import ImageServices from "../../services/ImageServices";

const UpdateForm = () => {
    const { ProductoID } = useParams();
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState("");
    const [initialValues, setInitialValues] = useState({
        productName: "",
        description: "",
        price: "",
        selectedCategory: "",
        selectedCategoryId: '',
        selectedCategoryName: '',
    });

    const validationSchema = Yup.object().shape({
        productName: Yup.string().required("El nombre del producto es obligatorio."),
        description: Yup.string().required("La descripción es obligatoria."),
        price: Yup.number()
            .typeError("El precio debe ser un número.")
            .positive("El precio debe ser un número positivo.")
            .min(0.01, "El precio debe ser mayor que cero.")
            .required("El precio es obligatorio."),
        selectedCategory: Yup.string().required("Debes seleccionar una categoría."),
    });

    useEffect(() => {
        if (!isNaN(ProductoID)) {
            loadProductDetails();
        } else {
            toast.error("El ID del producto no es válido.");
        }
    }, [ProductoID]);

    const loadProductDetails = async () => {
        try {
            const response = await ProductServices.getFullProductInfo(+ProductoID);
            console.log(response);
            const categoria = response.Categoria; // Ajustar para usar la propiedad correcta
            const id = response.idCategoria; // Ajustar para usar la propiedad correcta

            setInitialValues({
                productName: response.Nombre || "",
                description: response.Descripción || "",
                price: response.Precio || "",
                selectedCategory: id || "",
                selectedCategoryName: categoria || "",
                image: response.Imagen || ""
            });
            setSelectedIngredients(response.Ingredientes || []); // Ajustar para usar la propiedad correcta
            setImagePreview(response.Imagen || ""); // Setear imagen existente
        } catch (err) {
            toast.error("Error al cargar los detalles del producto: " + err.message);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
            const imageUrl = URL.createObjectURL(file); // Crear vista previa
            setImagePreview(imageUrl);
            return imageUrl; // Retornar la URL de la imagen
        } else {
            setImagePreview(""); // Resetear vista previa si no hay archivo
            return ""; // Retornar una cadena vacía
        }
    };

    const handleRemoveImage = () => {
        setFile(null);
        setImagePreview(initialValues.image || ""); // Resetear a la imagen inicial
    };

    const submitForm = async (values, { resetForm }) => {
        setLoading(true);
        try {
            console.log('Valores del formulario:', values); // Agrega esta línea para verificar los valores
    
            let imageUrl = "";
    
            // Manejo de la imagen
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("ProductoID", +ProductoID);
              
                console.log('Datos del FormData:', formData); // Verificar el contenido del FormData
              
                const imageResponse = await ImageServices.createImage(formData);
                console.log('Respuesta de la subida de imagen:', imageResponse); // Verificar la respuesta del servicio
              
                if (!imageResponse.success) {
                  toast.error(`Error al subir la imagen: ${imageResponse.message}`);
                  return;
                }
                
                imageUrl = imageResponse.Imagen;
                console.log('URL de la imagen subida:', imageUrl); // Verificar la URL de la imagen subida
              } else {
                imageUrl = initialValues.image || ""; // Mantener la imagen existente si no se subió una nueva
                console.log('No se subió una nueva imagen, se mantiene la existente:', imageUrl); // Verificar la imagen existente
              }
              
            // Enviar los datos del producto
            const productData = {
                Nombre: values.productName || initialValues.productName,
                Descripción: values.description || initialValues.description,
                Precio: parseFloat(values.price) || parseFloat(initialValues.price),
                CategoríaID: parseInt(values.selectedCategory, 10) || parseInt(initialValues.selectedCategory, 10),
                ingredientes: selectedIngredients.length > 0 ? selectedIngredients : initialValues.selectedIngredients || [],
                ProductoID: +ProductoID,
                Imagen: imageUrl,
            };
    
            console.log('Datos del producto a enviar:', productData); // Agrega esta línea para verificar el objeto
    
            const productResponse = await ProductServices.updateProduct(productData);
            if (!productResponse.success) {
                toast.error(`Error al actualizar el producto: ${productResponse.mensaje}`);
                return;
            }
    
            toast.success("Producto actualizado exitosamente.");
            resetForm();
            setSelectedIngredients([]);
            setFile(null);
            setImagePreview("");
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-form-container">
            <ToastContainer />
            <h2>Actualizar Producto</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={submitForm}
                enableReinitialize
            >
                {({ setFieldValue }) => (
                    <Form>
                        <div className="banner-container">
                            <img src={BannerBackground} alt="Banner" className="banner-image" />
                        </div>
                        <div className="input-section">
                            <div className="input-group">
                                <label htmlFor="productName">Nombre del Producto:</label>
                                <Field name="productName" type="text" placeholder="Nombre del producto" />
                                <ErrorMessage name="productName" component="div" className="error-message" />
                            </div>
                            <div className="input-group">
                                <label htmlFor="description">Descripción:</label>
                                <Field name="description" as="textarea" placeholder="Descripción del producto" />
                                <ErrorMessage name="description" component="div" className="error-message" />
                            </div>
                            <div className="input-group">
                                <label htmlFor="price">Precio:</label>
                                <Field name="price" type="number" min="0" step="0.01" placeholder="Precio del producto" />
                                <ErrorMessage name="price" component="div" className="error-message" />
                            </div>
                            <div className="input-group">
                                <label htmlFor="image">Imagen:</label>
                                <input type="file" accept="image/*" onChange={handleImageChange} />
                                {file && (
                                    <div className="image-preview-container">
                                        <p>{file.name}</p>
                                        <button type="button" onClick={handleRemoveImage} className="remove-image-button">
                                            Eliminar Imagen
                                        </button>
                                        {imagePreview && (
                                            <img src={imagePreview} alt="Vista previa" className="image-preview" />
                                        )}
                                    </div>
                                )}
                                {!file && imagePreview && (
                                    <div className="image-preview-container">
                                        <img src={imagePreview} alt="Vista previa actual" className="image-preview" />
                                        <button type="button" onClick={handleRemoveImage} className="remove-image-button">
                                            Resetear Imagen
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="category-section">
                            <div className="input-group">
                                <CategorySelect
                                    selectedCategory={initialValues.selectedCategory}
                                    onCategoryChange={(value) => setFieldValue("selectedCategory", value)}
                                />
                                <ErrorMessage name="selectedCategory" component="div" className="error-message" />
                            </div>
                        </div>
                        <div className="ingredient-section">
                            <div className="input-group">
                                <IngredientSelect
                                    selectedIngredients={selectedIngredients}
                                    setSelectedIngredients={setSelectedIngredients}
                                />
                            </div>
                        </div>
                        <div className="button-container">
                            <button type="submit" disabled={loading}>
                                {loading ? "Actualizando..." : "Actualizar Producto"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

UpdateForm.propTypes = {
    productId: PropTypes.string.isRequired,
};

export default UpdateForm;