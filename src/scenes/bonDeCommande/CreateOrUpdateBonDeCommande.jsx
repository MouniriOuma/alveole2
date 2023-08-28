import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, MenuItem, InputAdornment } from '@mui/material';
import { Formik, FieldArray, Field } from 'formik';
import * as yup from 'yup';
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../base/Header";
import BonDeCommandeService from '../../services/BonDeCommandeService';
import { parseISO, formatISO } from 'date-fns';

const BonDeCommandeForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const { id } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        if (id === '_add') {
            return;
        } else {
            BonDeCommandeService.getBonDeCommandeById(id).then((res) => {
                let bonDeCommande = res.data;
                setNumeroCommande(bonDeCommande.numeroCommande);
                setClient(bonDeCommande.client);
                setDateCommande(bonDeCommande.dateCommande);
                setTotalHT(bonDeCommande.totalHT);
                setBonDeCommandeDetails(bonDeCommande.bonDeCommandeDetails);
            });
        }
    }, [id]);

    function setBonDeCommandeDetails(details) {
        let formattedDetails = details.map((detail) => ({
            id_detail: detail.id,
            produit: detail.produit,
            quantite: detail.quantite,
            prixUnitaire: detail.prixUnitaire,
        }));
        setDetailsArray(formattedDetails);
    }

    const [numeroCommande, setNumeroCommande] = useState('');
    const [dateCommande, setDateCommande] = useState('2023-01-01');
    const [client, setClient] = useState('');
    const [totalHT, setTotalHT] = useState(0);
    const [detailsArray, setDetailsArray] = useState([
        {
            produit: '',
            quantite: 0,
            prixUnitaire: 0,
        },
    ]);

    const initialDetails = detailsArray.map(detail => ({
        produit: detail.produit,
        quantite: detail.quantite,
        prixUnitaire: detail.prixUnitaire,
    }));

    const initialValues = {
        numeroCommande,
        dateCommande,
        client,
        totalHT,
        details: detailsArray.length > 0 ? detailsArray : initialDetails,
        //details: detailsArray === [ {
        //                 produit: '',
        //                 quantite: 0,
        //                 prixUnitaire: 0,
        //             }] ? initialDetails : detailsArray,
    };

    const handleFormSubmit = (values) => {
        console.log(values);
        saveOrUpdateBonDeCommande(values);
    };

    const saveOrUpdateBonDeCommande = (values) => {
        const {
            numeroCommande,
            dateCommande,
            client,
            totalHT,
            details,
        } = values;

        if (details && details.length > 0) {
            console.log('full')
        } else {console.log('empty')}

        // The object to be sent to the database
        const updatedBonDeCommande = {
            numeroCommande,
            dateCommande,
            client,
            totalHT,
            bonDeCommandeDetails: details.map(detail => ({
                produit: detail.produit,
                quantite: detail.quantite,
                prixUnitaire: detail.prixUnitaire,
            })),
        };
        console.log("BC => " + JSON.stringify(updatedBonDeCommande));

        if (
            numeroCommande === '' &&
            client === '' &&
            dateCommande === '2023-01-01' &&
            totalHT === 0 &&
            detailsArray === [ {
                produit: '',
                quantite: 0,
                prixUnitaire: 0,
            }]
        ) {
            console.log('All values are empty, skipping saveOrUpdateBonDeCommande');
            return;
        }

        if (id === '_add') {
            BonDeCommandeService.createBonDeCommande(updatedBonDeCommande)
                .then(() => {
                    navigate('/bonDeCommande');
                })
                .catch((error) => {
                    console.log('Error creating bonDeCommande:', error);
                });
        }
        else {
            BonDeCommandeService.updateBonDeCommande(id, updatedBonDeCommande)
                .then(() => {
                    navigate('/bonDeCommande');
                })
                .catch((error) => {
                    console.log('Error updating bonDeCommande:', error);
                });
        }

    };

    const cancel = () => {
        navigate('/bonDeCommande');
    };

    const getTitle = () => {
        if (id === '_add') {
            return <span className="text-center">Add bon de commande</span>;
        } else {
            return <span className="text-center">Update bon de commande</span>;
        }
    };

    const getSubTitle = () => {
        if (id === '_add') {
            return <span className="text-center">Add a new bon de commande</span>;
        } else {
            return <span className="text-center">Update your bon de commande</span>;
        }
    };

    const checkoutSchema = yup.object().shape({
        numeroCommande: yup.string().required('Required'),
        dateCommande: yup.date().required('Required'),
        client: yup.string().required('Required'),
        totalHT: yup.number().required('Required'),
        produit: yup.string().required('Required'),
        quantite: yup.number().required('Required'),
        prixUnitaire: yup.number().required('Required'),
    });

    return (
        <Box m="20px">
            <Header title={getTitle()} subtitle={getSubTitle()} />

            <div className="row">
                <div className="col-sm-12">
                    <Formik
                        onSubmit={handleFormSubmit}
                        initialValues={initialValues}
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
                              submitForm,
                              setFieldValue,
                          }) => (
                            <form onSubmit={handleSubmit}>
                                <Box
                                    display="grid"
                                    gap="30px"
                                    sx={{
                                        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                    }}
                                >
                                    <Box
                                        display="grid"
                                        gap="30px"
                                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                        sx={{
                                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                        }}>
                                        <Box mb={2}>
                                            <TextField
                                                type="text"
                                                name="numeroCommande"
                                                label="Numero Commande"
                                                variant="filled"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.numeroCommande}
                                                error={touched.numeroCommande && !!errors.numeroCommande}
                                                helperText={touched.numeroCommande && errors.numeroCommande}
                                                sx={{ gridColumn: "span 2" }}
                                                fullWidth
                                            />
                                        </Box>
                                        <Box mb={2}>
                                            <TextField
                                                type="date"
                                                name="dateCommande"
                                                label="Date Commande"
                                                fullWidth
                                                variant="filled"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.dateCommande}
                                                error={touched.dateCommande && !!errors.dateCommande}
                                                helperText={touched.dateCommande && errors.dateCommande}
                                                sx={{ gridColumn: "span 2" }}
                                            />
                                        </Box>
                                        <Box mb={2}>
                                            <TextField
                                                type="text"
                                                name="client"
                                                label="Client"
                                                fullWidth
                                                variant="filled"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.client}
                                                error={touched.client && !!errors.client}
                                                helperText={touched.client && errors.client}
                                                sx={{ gridColumn: "span 2" }}
                                            />
                                        </Box>
                                        <Box mb={2}>
                                            <TextField
                                                type="number"
                                                name="totalHT"
                                                label="Total HT"
                                                fullWidth
                                                variant="filled"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.totalHT}
                                                error={touched.totalHT && !!errors.totalHT}
                                                helperText={touched.totalHT && errors.totalHT}
                                                sx={{ gridColumn: "span 2" }}
                                            />
                                        </Box>
                                    </Box>
                                    <FieldArray name="details">
                                        {({ push, remove }) => (
                                            <>
                                                {values.details.map((_, index) => (
                                                    <div key={index} className="mb-3">
                                                        <div className="row">
                                                            <div className="col-md-4">
                                                                <TextField
                                                                    type="text"
                                                                    name={`details[${index}].produit`}
                                                                    label="Produit"
                                                                    fullWidth
                                                                    variant="filled"
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    value={values.details[index].produit}
                                                                    sx={{ gridColumn: "span 2" }}
                                                                />
                                                            </div>
                                                            <div className="col-md-4">
                                                                <TextField
                                                                    type="number"
                                                                    name={`details[${index}].quantite`}
                                                                    label="Quantite"
                                                                    fullWidth
                                                                    variant="filled"
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    value={values.details[index].quantite}
                                                                    sx={{ gridColumn: "span 2" }}
                                                                />
                                                            </div>
                                                            <div className="col-md-4">
                                                                <TextField
                                                                    type="number"
                                                                    name={`details[${index}].prixUnitaire`}
                                                                    label="Prix Unitaire"
                                                                    fullWidth
                                                                    variant="filled"
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    value={values.details[index].prixUnitaire}
                                                                    sx={{ gridColumn: "span 2" }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="mt-2">
                                                            {index > 0 && (
                                                                <Button
                                                                    sx={{m: 2}}
                                                                    variant="outlined"
                                                                    color="error"
                                                                    onClick={() => remove(index)}
                                                                >
                                                                    Remove
                                                                </Button>
                                                            )}
                                                            {index === values.details.length - 1 && (
                                                                <Button
                                                                    sx={{m: 2}}
                                                                    variant="outlined"
                                                                    color="success"
                                                                    onClick={() => push({ produit: '', quantite: 0, prixUnitaire: 0 })}
                                                                >
                                                                    Add More
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </FieldArray>


                                </Box>
                                <div style={{ textAlign: 'center' }}>
                                    <Button type="submit" variant="contained" color="secondary" onClick={handleFormSubmit}>
                                        Submit
                                    </Button>
                                    <Button
                                        onClick={cancel}
                                        color="error"
                                        variant="contained"
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </Box>
    );
}

export default BonDeCommandeForm;
