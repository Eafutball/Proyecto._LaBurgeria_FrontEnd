import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import CategorySelect from "./CategorySelect";
import IngredientSelect from "./IngredientSelect";
import ProductServices from "../../services/ProductServices";
import ImageServices from "../../services/ImageServices";
import BannerBackground from "../../assets/home-banner-background.png";
import "./ProductForm.css";

const ProductForm = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [createdProduct, setCreatedProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImagePreview("");
  };

  const submitForm = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const productData = {
        Nombre: values.productName,
        Descripción: values.description,
        Precio: parseFloat(values.price),
        CategoríaID: parseInt(values.selectedCategory, 10),
        ingredientes: selectedIngredients,
        ProductoID: Math.floor(Math.random() * 100000) + 1,
        Imagen: file,
      };

      const productResponse = await ProductServices.createProduct(productData);

      if (!productResponse.success) {
        toast.error(`Error al crear el producto: ${productResponse.mensaje}`);
        return;
      }

      const ProductoObtenido = productResponse.Producto;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("ProductoID", ProductoObtenido.ProductoID);

        const imgResponse = await ImageServices.createImage(formData);
        if (!imgResponse.success) {
          throw new Error(`Error al subir la imagen: ${imgResponse.mensaje}`);
        }
      }

      setCreatedProduct(ProductoObtenido);
      toast.success("Producto creado exitosamente.");
      resetForm();
      setSelectedIngredients([]);
      setFile(null);
      setImagePreview("");
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 409:
            toast.error("Error: El nombre del producto ya existe. Intente con otro.");
            break;
          case 400:
            toast.error(`Error en la solicitud: ${data?.mensaje || "Datos incorrectos proporcionados."}`);
            break;
          case 500:
            toast.error("Error en el servidor. Inténtalo de nuevo más tarde.");
            break;
          default:
            toast.error(`Error inesperado (${status}): ${data?.mensaje || "Ocurrió un problema."}`);
        }
      } else {
        toast.error(`Error de red o del cliente: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <ToastContainer />
      <h2>Registrar Producto</h2>
      <Formik
        initialValues={{
          productName: "",
          description: "",
          price: "",
          selectedCategory: "",
        }}
        validationSchema={validationSchema}
        onSubmit={submitForm}
      >
        {({ values, setFieldValue, errors }) => (
          <Form>
            <div className="banner-container">
              <img src={BannerBackground} alt="Banner" className="banner-image" />
            </div>
            <div className="input-section">
              <div className="input-group">
                <label htmlFor="productName">Nombre del Producto:</label>
                <Field name="productName" type="text" />
                <ErrorMessage name="productName" component="div" className="error-message" />
              </div>
              <div className="input-group">
                <label htmlFor="description">Descripción:</label>
                <Field name="description" as="textarea" />
                <ErrorMessage name="description" component="div" className="error-message" />
              </div>
              <div className="input-group">
                <label htmlFor="price">Precio:</label>
                <Field name="price" type="number" min="0" step="0.01" />
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
              </div>
            </div>
            <div className="category-section">
              <div className="input-group">
                <CategorySelect
                  selectedCategory={values.selectedCategory}
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
              <button type="submit" disabled={loading || Object.keys(errors).length > 0}>
                {loading ? "Creando..." : "Crear Producto"}
              </button>
            </div>
            {createdProduct && (
              <div className="created-product">
                <h3>Producto Creado:</h3>
                <div>
                  <strong>Nombre:</strong> {createdProduct.Nombre}
                </div>
                <div>
                  <strong>Descripción:</strong> {createdProduct.Descripción}
                </div>
                <div>
                  <strong>Precio:</strong> ${createdProduct.Precio}
                </div>
                <div>
                  <strong>Categoría ID:</strong> {createdProduct.CategoríaID}
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProductForm;
