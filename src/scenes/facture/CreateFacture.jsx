import React from "react";
import {Box, Button, Divider, TextField} from "@mui/material";
import { FieldArray, Form, Formik, getIn } from "formik";
import * as Yup from "yup";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useNavigate, useParams} from "react-router-dom";
import Header from "../base/Header";
import FactureService from "../../services/FactureService";

const FactureForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        numeroFacture: yup.string().required('Required'),
        numeroCommande: yup.string().required('Required'),
        numeroLivraison: yup.string().required('Required'),
        dateFacture: yup.date().required('Required'),
        client: yup.string().required('Required'),
        TVA: Yup.number().required("required").min(0, "Must be at least 0").max(100, "Must be at most 100"),
        details: Yup.array().of(
            Yup.object().shape({
                produit: Yup.string().required("required"),
                quantiteCommande: Yup.number().required("required"),
                prixUnitaire: Yup.number().required("required")
            })
        )
    });

    const cancel = () => {
        navigate('/Facture');
    };

    const getTitle = () => {
        return <span className="text-center">Add bon de Livraison</span>;
    };

    const getSubTitle = () => {
        return <span className="text-center">Add a new bon de Livraison</span>;
    };

    const saveFacture = (values) => {
        const {
            numeroFacture,
            numeroCommande,
            numeroLivraison,
            dateFacture,
            client,
            totalHT,
            totalTVA: originalTotalTVA, // Rename to avoid conflict with the new variable
            TVA,
            details,
        } = values;

// Calculate totalHT, totalTVA, and totalTTC
        const newTotalHT = details.reduce((total, detail) => {
            const detailTotal = detail.quantiteCommande * detail.prixUnitaire;
            return total + detailTotal;
        }, 0);

        const newTotalTVA = (TVA / 100) * newTotalHT; // Corrected calculation
        const newTotalTTC = newTotalHT + newTotalTVA; // Corrected calculation

// The object to be sent to the database
        const updatedFacture = {
            numeroFacture,
            numeroCommande,
            numeroLivraison,
            dateFacture,
            client,
            totalHT: newTotalHT,
            totalTVA: newTotalTVA,
            totalTTC: newTotalTTC,
            factureDetails: details.map(detail => ({
                produit: detail.produit,
                quantiteCommande: detail.quantiteCommande,
                prixUnitaire: detail.prixUnitaire,
            })),
        };

        console.log("BC => " , JSON.stringify(updatedFacture, null, 2));

        FactureService.createFacture(updatedFacture)
            .then(() => {
                navigate('/Facture');
            })
            .catch((error) => {
                console.log('Error creating Facture:', error);
            });
    };
    return (
        <Box m="20px">
            <Header title={getTitle()} subtitle={getSubTitle()} />
            <div className="row">
                <div className="col-sm-12">
                    <Formik
                        initialValues={{
                            numeroFacture: '',
                            numeroCommande: '',
                            numeroLivraison: '',
                            dateFacture: '2023-01-01',
                            client: '',
                            totalHT: 0,
                            totalTTC: 1,
                            totalTVA: 1,
                            TVA: 0,
                            details: [{
                                produit: '',
                                quantiteCommande: 0,
                                prixUnitaire: 0,
                            }],
                        }}
                        validationSchema={validationSchema}
                        onSubmit={values => {
                            console.log("onSubmit", JSON.stringify(values, null, 2));
                            saveFacture(values);
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
                                                label="Numero Livraison"
                                                name="numeroFacture"
                                                value={values.numeroFacture}
                                                required
                                                fullWidth
                                                helperText={
                                                    touched.numeroFacture && errors.numeroFacture
                                                        ? errors.numeroFacture
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
                                                label="Numero Livraison"
                                                name="numeroLivraison"
                                                value={values.numeroLivraison}
                                                required
                                                fullWidth
                                                helperText={
                                                    touched.numeroLivraison && errors.numeroLivraison
                                                        ? errors.numeroLivraison
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
                                                label="Date Livraison"
                                                name="dateFacture"
                                                type="date"
                                                value={values.dateFacture}
                                                required
                                                fullWidth
                                                helperText={
                                                    touched.dateFacture && errors.dateFacture
                                                        ? errors.dateFacture
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
                                        <Box mb={2}>
                                            <TextField
                                                margin="normal"
                                                variant="outlined"
                                                label="TVA"
                                                name="TVA"
                                                type="number"
                                                value={values.TVA}
                                                required
                                                fullWidth
                                                helperText={
                                                    touched.TVA && errors.TVA
                                                        ? errors.TVA
                                                        : ""
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Box>
                                    </Box>
                                    <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                                    <FieldArray name="details">
                                        {({ push, remove }) => (
                                            <div>
                                                {values.details.map((detail, index) => {
                                                    const produitName = `details[${index}].produit`;
                                                    const touchedProduit = getIn(touched, produitName);
                                                    const errorProduit = getIn(errors, produitName);

                                                    const quantiteCommandeName = `details[${index}].quantiteCommande`;
                                                    const touchedQuantiteCommande = getIn(touched, quantiteCommandeName);
                                                    const errorQuantiteCommande = getIn(errors, quantiteCommandeName);

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
                                                                        name={quantiteCommandeName}
                                                                        value={detail.quantiteCommande}
                                                                        type="number"
                                                                        required
                                                                        fullWidth
                                                                        helperText={
                                                                            touchedQuantiteCommande && errorQuantiteCommande
                                                                                ? errorQuantiteCommande
                                                                                : ""
                                                                        }
                                                                        error={Boolean(touchedQuantiteCommande && errorQuantiteCommande)}
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
                                                        push({ produit: "", quantiteCommande: 0, prixUnitaire: 0 })
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
                                        <Button
                                            onClick={cancel}
                                            color="error"
                                            variant="contained"
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Cancel
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

export default FactureForm;
