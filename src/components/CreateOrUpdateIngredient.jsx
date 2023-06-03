import { Box, Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';
import Header from "../scenes/base/Header";
import IngredientService from '../services/IngredientService';
import useMediaQuery from "@mui/material/useMediaQuery";

function IngredientForm() {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id === '_add') {
      return;
    } else {
      IngredientService.getIngredientById(id).then((res) => {
        let ingredient = res.data;
        setIngredientName(ingredient.name);
        setDescription(ingredient.description);
        setMaxQuantity(ingredient.max_quantity);
        setStockQuantity(ingredient.stock_quantity);
        setUnitOfMeasurement(ingredient.unit_of_measurement);
        setUnitPrice(ingredient.unit_price);
        setSupplierId(ingredient.supplier_id);
      });
    }
  }, [id]);

  const [ingredientName, setIngredientName] = useState('');
  const [description, setDescription] = useState('');
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [unitOfMeasurement, setUnitOfMeasurement] = useState('');
  const [unitPrice, setUnitPrice] = useState(0);
  const [supplierId, setSupplierId] = useState(0);

  const initialValues = {
    ingredientName,
    description,
    maxQuantity,
    stockQuantity,
    unitOfMeasurement,
    unitPrice,
    supplierId,
  };

  const handleFormSubmit = (values) => {
    console.log(values);
    saveOrUpdateIngredient(values);
  };

  const saveOrUpdateIngredient = (values) => {
    const ingredient = {
      name: values.ingredientName,
      description: values.description,
      max_quantity: values.maxQuantity,
      stock_quantity: values.stockQuantity,
      unit_of_measurement: values.unitOfMeasurement,
      unit_price: values.unitPrice,
      supplier_id: values.supplierId,
    };

    console.log('ingredient => ' + JSON.stringify(ingredient));

    if (id === '_add') {
      IngredientService.createIngredient(ingredient)
        .then((res) => {
          navigate('/ingredients');
        })
        .catch((error) => {
          console.log('Error creating ingredient:', error);
        });
    } else {
      IngredientService.updateIngredient(ingredient, id)
        .then((res) => {
          navigate('/ingredients');
        })
        .catch((error) => {
          console.log('Error updating ingredient:', error);
        });
    }
  };

  const cancel = () => {
    navigate('/ingredients');
  };

  const getTitle = () => {
    if (id === '_add') {
      return <span className="text-center">Add Ingredient</span>;
    } else {
      return <span className="text-center">Update Ingredient</span>;
    }
  };

  const getSubTitle = () => {
    if (id === '_add') {
      return <span className="text-center">Add a new ingredient</span>;
    } else {
      return <span className="text-center">Update ingredient details</span>;
    }
  };

  const [formValues, setFormValues] = useState(null) 
  
  return (
    <Box m="20px">
      <Header title={getTitle()} subtitle={getSubTitle()} />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={formValues || initialValues}
        validationSchema={checkoutSchema}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Ingredient Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.ingredientName}
                name="ingredientName"
                error={touched.ingredientName && !!errors.ingredientName}
                helperText={touched.ingredientName && errors.ingredientName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Max Quantity"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.maxQuantity}
                name="maxQuantity"
                error={touched.maxQuantity && !!errors.maxQuantity}
                helperText={touched.maxQuantity && errors.maxQuantity}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Stock Quantity"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.stockQuantity}
                name="stockQuantity"
                error={touched.stockQuantity && !!errors.stockQuantity}
                helperText={touched.stockQuantity && errors.stockQuantity}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Unit of Measurement"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.unitOfMeasurement}
                name="unitOfMeasurement"
                error={touched.unitOfMeasurement && !!errors.unitOfMeasurement}
                helperText={touched.unitOfMeasurement && errors.unitOfMeasurement}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Unit Price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.unitPrice}
                name="unitPrice"
                error={touched.unitPrice && !!errors.unitPrice}
                helperText={touched.unitPrice && errors.unitPrice}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Supplier ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.supplierId}
                name="supplierId"
                error={touched.supplierId && !!errors.supplierId}
                helperText={touched.supplierId && errors.supplierId}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained" onClick={handleFormSubmit}>
                Save
              </Button>
              <Button onClick={cancel} color="error" variant="contained" style={{ marginLeft: '10px' }}>
                Cancel
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}

const checkoutSchema = yup.object().shape({
  ingredientName: yup.string().required("Required"),
  description: yup.string().required("Required"),
  maxQuantity: yup.number().required("Required"),
  stockQuantity: yup.number().required("Required"),
  unitOfMeasurement: yup.string().required("Required"),
  unitPrice: yup.number().required("Required"),
  supplierId: yup.number().required("Required"),
});

export default IngredientForm;
