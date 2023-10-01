import { Box, Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';
import Header from "../base/Header";
import IngredientService from '../../services/IngredientService';
import useMediaQuery from "@mui/material/useMediaQuery";
import { Grid } from '@mui/material';
import SupplierService from "../../services/SupplierService";
import { MenuItem, InputLabel, Select } from '@mui/material';



function IngredientForm() {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const { id } = useParams();
  const navigate = useNavigate();

  const [supplierList, setSupplierList] = useState([]);


  useEffect(() => {
    SupplierService.getSuppliers()
        .then((res) => {
          setSupplierList(res.data);
        })
        .catch((error) => {
          console.log('Error fetching suppliers:', error);
        });

    if (id === '_add') {
      return;
    } else {
      IngredientService.getIngredientById(id).then((res) => {
        let ingredient = res.data;
        setIngredientName(ingredient.name);
        setDescription(ingredient.description);
        setMaxQuantity(ingredient.maxQuantity);
        setStockQuantity(ingredient.stockQuantity);
        setUnitOfMeasurement(ingredient.unitOfMeasurement);
        setUnitPrice(ingredient.unitPrice);
        setSupplierId(ingredient.supplier.supplierId);
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

    saveOrUpdateIngredient(values);
  };

  const saveOrUpdateIngredient = (values) => {
    const {
      ingredientName,
      description,
      maxQuantity,
      stockQuantity,
      unitOfMeasurement,
      unitPrice,
      supplierId
    } = values;

    if (
        ingredientName === '' &&
        description === '' &&
        maxQuantity === 0 &&
        stockQuantity === 0 &&
        unitOfMeasurement === '' &&
        unitPrice === 0 &&
        supplierId === 0
    ) {
      console.log("All values are empty, skipping saveOrUpdateIngredient");
      return;
    }

    SupplierService.getSupplierById(supplierId)
        .then((supplierResponse) => {
          const supplier = supplierResponse.data;

          const ingredient = {
            name: ingredientName,
            description,
            maxQuantity,
            stockQuantity,
            unitOfMeasurement,
            unitPrice,
            supplier: {
              supplierId: supplierId,
              address: supplier.address || '', // Use the address value from the supplier
              contact: supplier.contact || '', // Use the contact value from the supplier
              email: supplier.email || '', // Use the email value from the supplier
              suppliedProduct: supplier.suppliedProduct || null, // Use the suppliedProduct value from the supplier
              cin: supplier.cin || '', // Use the cin value from the supplier
              firstName: supplier.firstName || '', // Use the firstName value from the supplier
              lastName: supplier.lastName || '', // Use the lastName value from the supplier
              ice: supplier.ice || 0 // Use the ice value from the supplier
            }
          };

          if (id === '_add') {
            IngredientService.createIngredient(ingredient)
                .then(() => {
                  navigate('/ingredients');
                })
                .catch((error) => {
                  console.log('Error creating ingredient:', error);
                });
          } else {
            IngredientService.updateIngredient(ingredient, id)
                .then(() => {
                  navigate('/ingredients');
                })
                .catch((error) => {
                  console.log('Error updating ingredient:', error);
                });
          }
        })
        .catch((error) => {
          console.log('Error fetching supplier:', error);
        });
  };
  const cancel = () => {
    navigate('/ingredients');
  };

  const getTitle = () => {
    if (id === '_add') {
      return <span className="text-center">Ajouter un ingrédient</span>;
    } else {
      return <span className="text-center">Metter à jour un ingrédient</span>;
    }
  };

  const getSubTitle = () => {
    if (id === '_add') {
      return <span className="text-center">Ajouter un nouveau ingrédient</span>;
    } else {
      return <span className="text-center">Metter à jour les détails d'ingrédient</span>;
    }
  };

  const [formValues, setFormValues] = useState(null)

  return (
      <Box m="20px">
        <Header title={getTitle()} subtitle={getSubTitle()} />

        <Formik
            initialValues={initialValues}
            onSubmit={handleFormSubmit}
            validationSchema={checkoutSchema}
            enableReinitialize
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
              <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap="20px">
                <TextField
                    fullWidth
                    variant="filled"
                    label="Nom d'ingredient"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.ingredientName}
                    name="ingredientName"
                    error={touched.ingredientName && !!errors.ingredientName}
                    helperText={touched.ingredientName && errors.ingredientName}
                />
                <TextField
                    fullWidth
                    variant="filled"
                    label="Description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                    name="description"
                    error={touched.description && !!errors.description}
                    helperText={touched.description && errors.description}
                />
                <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    label="Quantité maximale"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.maxQuantity}
                    name="maxQuantity"
                    error={touched.maxQuantity && !!errors.maxQuantity}
                    helperText={touched.maxQuantity && errors.maxQuantity}
                />
                <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    label="Quantité stockée"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.stockQuantity}
                    name="stockQuantity"
                    error={touched.stockQuantity && !!errors.stockQuantity}
                    helperText={touched.stockQuantity && errors.stockQuantity}
                />
                <TextField
                    fullWidth
                    variant="filled"
                    label="Unité de mesure"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.unitOfMeasurement}
                    name="unitOfMeasurement"
                    error={touched.unitOfMeasurement && !!errors.unitOfMeasurement}
                    helperText={touched.unitOfMeasurement && errors.unitOfMeasurement}
                />
                <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    label="Prix unitaire"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.unitPrice}
                    name="unitPrice"
                    error={touched.unitPrice && !!errors.unitPrice}
                    helperText={touched.unitPrice && errors.unitPrice}
                />

                {/* here the supplier text field */}

                <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    label="Fournisseur"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setFieldValue('supplierId', e.target.value);
                    }}
                    value={values.supplierId}
                    name="supplierId"
                    error={touched.supplierId && !!errors.supplierId}
                    helperText={touched.supplierId && errors.supplierId}
                    select
                >
                  {supplierList.map((supplier) => (
                      <MenuItem
                          key={supplier.supplierId}
                          value={supplier.supplierId}
                          selected={supplier.supplierId === values.supplierId}
                      >
                        {supplier.businessName
                            ? supplier.businessName
                            : `${supplier.firstName} ${supplier.lastName}`}
                      </MenuItem>
                  ))}
                </TextField>


                <Box display="flex" justifyContent="end" gap="10px">
                  <Button type="submit" variant="contained" color="secondary">
                    Envoyer
                  </Button>
                  <Button variant="contained" color="error" onClick={cancel}>
                    Annuler
                  </Button>
                </Box>
              </Box>
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
