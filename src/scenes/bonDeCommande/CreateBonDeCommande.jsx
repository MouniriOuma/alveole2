import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { FieldArray, Form, Formik, getIn } from "formik";
import * as Yup from "yup";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useNavigate, useParams} from "react-router-dom";
import Header from "../base/Header";
import BonDeCommandeService from "../../services/BonDeCommandeService";

const Dashboard = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        numeroCommande: yup.string().required('Required'),
        dateCommande: yup.date().required('Required'),
        client: yup.string().required('Required'),
        details: Yup.array().of(
            Yup.object().shape({
                produit: Yup.string().required("required"),
                quantite: Yup.number().required("required"),
                prixUnitaire: Yup.number().required("required")
            })
        )
    });

    const cancel = () => {
        navigate('/BonDeCommande');
    };

    const getTitle = () => {
        return <span className="text-center">Add bon de commande</span>;
    };

    const getSubTitle = () => {
        return <span className="text-center">Add a new bon de commande</span>;
    };

    const saveBonDeCommande = (values) => {
        const {
            numeroCommande,
            dateCommande,
            client,
            totalHT,
            details,
        } = values;

        // The object to be sent to the database
        const updatedBonDeCommande = {
            numeroCommande,
            dateCommande,
            client,
            totalHT: details.reduce((total, detail) => {
                const detailTotal = detail.quantite * detail.prixUnitaire;
                return total + detailTotal;
            }, 0),
            bonDeCommandeDetails: details.map(detail => ({
                produit: detail.produit,
                quantite: detail.quantite,
                prixUnitaire: detail.prixUnitaire,
            })),
        };
        console.log("BC => " + JSON.stringify(updatedBonDeCommande));

        const areAllValuesEmpty = (
            numeroCommande === '' &&
            client === '' &&
            dateCommande === '2023-01-01' &&
            totalHT === 0
        );

        if (areAllValuesEmpty) {
            console.log('All values are empty, skipping saveBonDeCommande');
            return;
        }

        BonDeCommandeService.createBonDeCommande(updatedBonDeCommande)
            .then(() => {
                navigate('/bonDeCommande');
            })
            .catch((error) => {
                console.log('Error creating bonDeCommande:', error);
            });
    };
    return (
        <Box m="20px">
            <Header title={getTitle()} subtitle={getSubTitle()} />
            <div className="row">
                <div className="col-sm-12">
                    <Formik
                        initialValues={{
                            numeroCommande: '',
                            dateCommande: '2023-01-01',
                            client: '',
                            totalHT: 0,
                            details: [{
                                produit: '',
                                quantite: 0,
                                prixUnitaire: 0,
                            }],
                        }}
                        validationSchema={validationSchema}
                        onSubmit={values => {
                            console.log("onSubmit", JSON.stringify(values, null, 2));
                            saveBonDeCommande(values);
                        }}
                    >

                        {({ values, touched, errors, handleChange, handleBlur, isValid }) => (
                            <Form noValidate autoComplete="off">
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
                                        gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                                        sx={{
                                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                        }}>
                                        <Box mb={2}>
                                            <TextField
                                                margin="normal"
                                                variant="outlined"
                                                label="Numero Commande"
                                                name="numeroCommande"
                                                value={values.numeroCommande}
                                                required
                                                fullWidth
                                                helperText={
                                                    touched.numeroCommande && errors.numeroCommande
                                                        ? errors.numeroCommande
                                                        : ""
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Box>
                                        <Box mb={2}>
                                            <TextField
                                                margin="normal"
                                                variant="outlined"
                                                label="Date Commande"
                                                name="dateCommande"
                                                type="date"
                                                value={values.dateCommande}
                                                required
                                                fullWidth
                                                helperText={
                                                    touched.dateCommande && errors.dateCommande
                                                        ? errors.dateCommande
                                                        : ""
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Box>
                                        <Box mb={2}>
                                            <TextField
                                                margin="normal"
                                                variant="outlined"
                                                label="Client"
                                                name="client"
                                                value={values.client}
                                                required
                                                fullWidth
                                                helperText={
                                                    touched.client && errors.client
                                                        ? errors.client
                                                        : ""
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Box>
                                    </Box>
                                    <FieldArray name="details">
                                        {({ push, remove }) => (
                                            <div>
                                                {values.details.map((detail, index) => {
                                                    const produitName = `details[${index}].produit`;
                                                    const touchedProduit = getIn(touched, produitName);
                                                    const errorProduit = getIn(errors, produitName);

                                                    const quantiteName = `details[${index}].quantite`;
                                                    const touchedQuantite = getIn(touched, quantiteName);
                                                    const errorQuantite = getIn(errors, quantiteName);

                                                    const prixUnitaireName = `details[${index}].prixUnitaire`;
                                                    const touchedPrixUnitaire = getIn(touched, prixUnitaireName);
                                                    const errorPrixUnitaire = getIn(errors, prixUnitaireName);

                                                    return (
                                                        <div key={index} className="mb-3">
                                                            <div className="row">
                                                                <div className="col-md-4">
                                                                    <TextField
                                                                        margin="normal"
                                                                        variant="outlined"
                                                                        label="Produit"
                                                                        name={produitName}
                                                                        value={detail.produit}
                                                                        required
                                                                        fullWidth
                                                                        helperText={
                                                                            touchedProduit && errorProduit
                                                                                ? errorProduit
                                                                                : ""
                                                                        }
                                                                        error={Boolean(touchedProduit && errorProduit)}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                    />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <TextField
                                                                        margin="normal"
                                                                        variant="outlined"
                                                                        label="Quantite"
                                                                        name={quantiteName}
                                                                        value={detail.quantite}
                                                                        type="number"
                                                                        required
                                                                        fullWidth
                                                                        helperText={
                                                                            touchedQuantite && errorQuantite
                                                                                ? errorQuantite
                                                                                : ""
                                                                        }
                                                                        error={Boolean(touchedQuantite && errorQuantite)}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                    />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <TextField
                                                                        margin="normal"
                                                                        label="Prix Unitaire"
                                                                        name={prixUnitaireName}
                                                                        value={detail.prixUnitaire}
                                                                        type="number"
                                                                        required
                                                                        fullWidth
                                                                        helperText={
                                                                            touchedPrixUnitaire && errorPrixUnitaire
                                                                                ? errorPrixUnitaire
                                                                                : ""
                                                                        }
                                                                        error={Boolean(touchedPrixUnitaire && errorPrixUnitaire)}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <Button
                                                                sx={{m: 2}}
                                                                type="button"
                                                                color="error"
                                                                variant="outlined"
                                                                onClick={() => remove(index)}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    );
                                                })}
                                                <Button
                                                    sx={{m: 2}}
                                                    type="button"
                                                    variant="outlined"
                                                    color="success"
                                                    onClick={() =>
                                                        push({ produit: "", quantite: 0, prixUnitaire: 0 })
                                                    }
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        )}
                                    </FieldArray>
                                    <div style={{ textAlign: 'center' }}>
                                        <Button
                                            type="submit"
                                            color="secondary"
                                            variant="contained"
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </Box>
    );
};

export default Dashboard;
