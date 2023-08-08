import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../base/Header";
import ClientService from '../../services/ClientService';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ClientForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id === "_add") {
      return;
    } else {
      ClientService.getClientById(id).then((res) => {
        let client = res.data;
        setICE(client.ice);
        setRaisonSocial(client.raisonSocial);
        setAdresse(client.adresse);
        setContact(client.contact);
        setAdresseEmail(client.adresseEmail);
      });
    }
  }, [id]);

  const [ice, setICE] = useState("");
  const [raisonSocial, setRaisonSocial] = useState("");
  const [adresse, setAdresse] = useState("");
  const [contact, setContact] = useState("");
  const [adresseEmail, setAdresseEmail] = useState("");

  const initialValues = {
    ice,
    raisonSocial,
    adresse,
    contact,
    adresseEmail,
  };

  const handleFormSubmit = (values) => {
    console.log(values);
    if (values.ice === "0" && !values.raisonSocial && !values.adresse && !values.contact && !values.adresseEmail) {
      // Skip sending to the database if ice is 0 and all other values are null
      navigate("/clients");
    } else {
      saveOrUpdateClient(values);
    }
  };

  const saveOrUpdateClient = (values) => {
    // Get the values from the form
    const ice = values.ice;
    const raisonSocial = values.raisonSocial;
    const adresse = values.adresse;
    const contact = values.contact;
    const adresseEmail = values.adresseEmail;

    // Create a new client object
    const client = {
      ice,
      raisonSocial,
      adresse,
      contact,
      adresseEmail,
    };

    console.log("client => " + JSON.stringify(client));

    // Check if all values are empty
    const allValuesEmpty = Object.values(client).every((value) => !value);

    if (allValuesEmpty) {
      // All values are empty, skip saving or updating
      console.log("All values are empty, skipping saveOrUpdateClient");
      return;
    }

    if (id === "_add") {
      ClientService.createClient(client).then((res) => {
        navigate("/clients");
      });
    } else {
      ClientService.updateClient(client, id).then((res) => {
        navigate("/clients");
      });
    }
  };


  const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

  const checkoutSchema = yup.object().shape({
    ice: yup.string().required("required"),
    raisonSocial: yup.string().required("required"),
    adresseEmail: yup.string().email("invalid email"),
    contact: yup.string().matches(phoneRegExp, "Phone number is not valid").required("required"),
  });

  const cancel = () => {
    navigate("/clients");
  };

  const getTitle = () => {
    if (id === "_add") {
      return <span className="text-center">Add client</span>;
    } else {
      return <span className="text-center">Update Client</span>;
    }
  };

  const getSubTitle = () => {
    if (id === "_add") {
      return <span className="text-center">Add a new client</span>;
    } else {
      return <span className="text-center">Update your Client</span>;
    }
  };

  const [formValues, setFormValues] = useState(null);

  return (
      <Box m="20px">
        <Header title={getTitle()} subtitle={getSubTitle()} />

        <Formik
            onSubmit={handleFormSubmit}
            initialValues={formValues || initialValues}
            validationSchema={checkoutSchema}
            enableReinitialize
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
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
                      label="ICE"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.ice}
                      name="ice"
                      error={!!touched.ice && !!errors.ice}
                      helperText={touched.ice && errors.ice}
                      sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Raison Social"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.raisonSocial}
                      name="raisonSocial"
                      error={!!touched.raisonSocial && !!errors.raisonSocial}
                      helperText={touched.raisonSocial && errors.raisonSocial}
                      sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Adresse"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.adresse}
                      name="adresse"
                      error={!!touched.adresse && !!errors.adresse}
                      helperText={touched.adresse && errors.adresse}
                      sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Contact Number"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.contact}
                      name="contact"
                      error={!!touched.contact && !!errors.contact}
                      helperText={touched.contact && errors.contact}
                      sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Adresse Email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.adresseEmail}
                      name="adresseEmail"
                      error={!!touched.adresseEmail && !!errors.adresseEmail}
                      helperText={touched.adresseEmail && errors.adresseEmail}
                      sx={{ gridColumn: "span 4" }}
                  />
                </Box>

                <Box display="flex" justifyContent="end" mt="20px">
                  <Button type="submit" color="secondary" variant="contained" onClick={handleFormSubmit}>
                    Save
                  </Button>
                  <Button onClick={cancel} color="error" variant="contained" style={{ marginLeft: "10px" }}>
                    Cancel
                  </Button>
                </Box>
              </form>
          )}
        </Formik>
      </Box>
  );
};

export default ClientForm;

