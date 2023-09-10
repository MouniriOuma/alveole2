import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../base/Header";
import ProductService from '../../services/ProductService';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ProductForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id === '_add') {
      return;
    } else {
      ProductService.getProductById(id).then((res) => {
        let product = res.data;
        setDescription(product.description);
        setProductName(product.productName);
        setQuantity(product.quantity);
      });
    }
  }, [id]);

  const [description, setDescription] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(0);

  const initialValues = {
    description,
    productName,
    quantity,
  };

  const handleFormSubmit = (values) => {

    if (values.description === "" && values.productName === "" && values.quantity === "") {
      // Skip sending to the database if all values are empty
      navigate("/products");
    } else {
      saveOrUpdateProduct(values);
    }
  };

  const saveOrUpdateProduct = (values) => {
    // Get the values from the form
    const description = values.description;
    const productName = values.productName;
    const quantity = values.quantity;

    // Create a new product object
    const product = {
      description,
      productName,
      quantity,
    };



    // Check if all values are empty
    const allValuesEmpty = Object.values(product).every((value) => !value);

    if (allValuesEmpty) {
      // All values are empty, skip saving or updating
      console.log("All values are empty, skipping saveOrUpdateProduct");
      return;
    }

    if (id === "_add") {
      ProductService.createProduct(product).then((res) => {
        navigate("/products");
      });
    } else {
      ProductService.updateProduct(product, id).then((res) => {
        navigate("/products");
      });
    }
  };



  const checkoutSchema = yup.object().shape({
    description: yup.string().required('Description is required'),
    productName: yup.string().required('Product Name is required'),
    quantity: yup
      .number()
      .required('Quantity is required'),
  });

  const cancel = () => {
    navigate('/products');
  };

  const getTitle = () => {
    if (id === '_add') {
      return <span className="text-center">Add product</span>;
    } else {
      return <span className="text-center">Update product</span>;
    }
  };

  const getSubTitle = () => {
    if (id === '_add') {
      return <span className="text-center">Add a new product</span>;
    } else {
      return <span className="text-center">Update your product</span>;
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
              label="Product Name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.productName}
              name="productName"
              error={touched.productName && !!errors.productName}
              helperText={touched.productName && errors.productName}
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
                sx={{ gridColumn: "span 2" }}
            />

            <TextField
              fullWidth
              variant="filled"
              type="number"
              label="Quantity"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.quantity}
              name="quantity"
              error={touched.quantity && !!errors.quantity}
              helperText={touched.quantity && errors.quantity}
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
};

export default ProductForm;
