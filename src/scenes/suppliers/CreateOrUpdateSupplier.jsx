import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../base/Header";
import SupplierService from '../../services/SupplierService';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';




const SupplierForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id === '_add') {
      return;
    } else {
      SupplierService.getSupplierById(id).then((res) => {
        let supplier = res.data;
        setAddress(supplier.address);
        setBusinessName(supplier.businessName);
        setCIN(supplier.cin);
        setContact(supplier.contact);
        setEmail(supplier.email);
        setFirstName(supplier.firstName);
        setICE(supplier.ice);
        setLastName(supplier.lastName);
        setSuppliedProduct(supplier.suppliedProduct);
      });
    }
  }, [id]);

  const [address, setAddress] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [cin, setCIN] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [ice, setICE] = useState('');
  const [lastName, setLastName] = useState('');
  const [suppliedProduct, setSuppliedProduct] = useState('');

  const initialValues = {
    address,
    businessName,
    cin,
    contact,
    email,
    firstName,
    ice,
    lastName,
    suppliedProduct,
  };

  const handleFormSubmit = (values) => {

    saveOrUpdateSupplier(values);
  };

  const saveOrUpdateSupplier = (values) => {
    const supplier = {
      address: values.address,
      businessName: values.businessName,
      cin: values.cin,
      contact: values.contact,
      email: values.email,
      firstName: values.firstName,
      ice: values.ice,
      lastName: values.lastName,
      suppliedProduct: values.suppliedProduct,
    };



    if (id === '_add') {
      SupplierService.createSupplier(supplier).then((res) => {
        navigate('/suppliers');
      });
    } else {
      SupplierService.updateSupplier(supplier, id).then((res) => {
        navigate('/suppliers');
      });
    }
  };

  const cancel = () => {
    navigate('/suppliers');
  };

  const getTitle = () => {
    if (id === '_add') {
      return <span className="text-center">Ajouter un fournisseur</span>;
    } else {
      return <span className="text-center">Metter à jour un fournisseur</span>;
    }
  };

  const getSubTitle = () => {
    if (id === '_add') {
      return <span className="text-center">Ajouter un nouveau fournissseur</span>;
    } else {
      return <span className="text-center">Metter à jour les dérails du fournisseur</span>;
    }
  };

  const [formValues, setFormValues] = useState(null) 

  return (
    <Box m="20px">
      <Header title={getTitle()} subtitle={getSubTitle()} />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={formValues || initialValues}
        validationSchema={supplierSchema}
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
                name="address"
                label="Adresse"
                variant="filled"
                size="large"
                type="text"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                id="businessName"
                name="businessName"
                label="Business Name"
                variant="filled"
                size="small"
                value={values.businessName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.businessName && !!errors.businessName}
                helperText={touched.businessName && errors.businessName}
              />

              <TextField
                id="cin"
                name="cin"
                label="CIN"
                variant="filled"
                size="small"
                value={values.cin}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.cin && !!errors.cin}
                helperText={touched.cin && errors.cin}
              />

              <TextField
                id="contact"
                name="contact"
                label="Contact"
                variant="filled"
                size="small"
                value={values.contact}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
              />

              <TextField
                id="email"
                name="email"
                label="Email"
                variant="filled"
                size="small"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />

              <TextField
                id="firstName"
                name="firstName"
                label="Prènom"
                variant="filled"
                size="small"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
              />


              <TextField
                id="lastName"
                name="lastName"
                label="Nom"
                variant="filled"
                size="small"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
              />
              <TextField
                id="ice"
                name="ice"
                label="ICE"
                variant="filled"
                size="small"
                value={values.ice}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.ice && !!errors.ice}
                helperText={touched.ice && errors.ice}
              />

              <TextField
                id="suppliedProduct"
                name="suppliedProduct"
                label="Produit fourni"
                variant="filled"
                size="small"
                value={values.suppliedProduct}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.suppliedProduct && !!errors.suppliedProduct}
                helperText={touched.suppliedProduct && errors.suppliedProduct}
              />
            </Box>

            <Box display="flex" justifyContent="center" mt="30px">
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                sx={{ marginRight: '10px' }}
              >
                Sauvegarder
              </Button>
              <Button
                type="button"
                variant="contained"
                color="error"
                onClick={cancel}
              >
                Annuler
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const supplierSchema = yup.object().shape({
  address: yup.string(),
  businessName: yup.string(),
  cin: yup.string(),
  contact: yup.string().required('Contact is required'),
  email: yup.string(),
  firstName: yup.string(),
  ice: yup.number(),
  lastName: yup.string(),
  suppliedProduct: yup.string().required('Supplied Product is required'),
});

export default SupplierForm;
