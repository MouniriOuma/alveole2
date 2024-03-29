import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { FieldArray, Form, Formik, getIn } from "formik";
import * as Yup from "yup";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useNavigate, useParams} from "react-router-dom";
import Header from "../base/Header";
import BonDeLivraisonService from "../../services/BonDeLivraisonService";

const BonDeLivraisonForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        numeroCommande: yup.string().required('Required'),
        numeroLivraison: yup.string().required('Required'),
        dateLivraison: yup.date().required('Required'),
        client: yup.string().required('Required'),
        details: Yup.array().of(
            Yup.object().shape({
                produit: Yup.string().required("required"),
                quantiteCommande: Yup.number().required("required"),
                prixUnitaire: Yup.number().required("required")
            })
        )
    });

    const cancel = () => {
        navigate('/BonDeLivraison');
    };

    const getTitle = () => {
        return <span className="text-center">Ajouter un bon de Livraison</span>;
    };

    const getSubTitle = () => {
        return <span className="text-center">Ajouter un nouveau bon de Livraison</span>;
    };

    const saveBonDeLivraison = (values) => {
        const {
            numeroCommande,
            numeroLivraison,
            dateLivraison,
            client,
            totalHT,
            details,
        } = values;

        // The object to be sent to the database
        const updatedBonDeLivraison = {
            numeroCommande,
            numeroLivraison,
            dateLivraison,
            client,
            totalHT: details.reduce((total, detail) => {
                const detailTotal = detail.quantiteCommande * detail.prixUnitaire;
                return total + detailTotal;
            }, 0),
            bonDeLivraisonDetails: details.map(detail => ({
                produit: detail.produit,
                quantiteCommande: detail.quantiteCommande,
                prixUnitaire: detail.prixUnitaire,
            })),
        };


        const areAllValuesEmpty = (
            numeroCommande === '' &&
            numeroLivraison === '' &&
            client === '' &&
            dateLivraison === '2023-01-01' &&
            totalHT === 0
        );

        if (areAllValuesEmpty) {
            console.log('All values are empty, skipping saveBonDeLivraison');
            return;
        }

        BonDeLivraisonService.createBonDeLivraison(updatedBonDeLivraison)
            .then(() => {
                navigate('/BonDeLivraison');
            })
            .catch((error) => {
                console.log('Error creating BonDeLivraison:', error);
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
                            numeroLivraison: '',
                            dateLivraison: '2023-01-01',
                            client: '',
                            totalHT: 0,
                            details: [{
                                produit: '',
                                quantiteCommande: 0,
                                prixUnitaire: 0,
                            }],
                        }}
                        validationSchema={validationSchema}
                        onSubmit={values => {

                            saveBonDeLivraison(values);
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
                                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                        sx={{
                                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                        }}>
                                        <Box mb={2}>
                                            <TextField
                                                margin="normal"
                                                variant="outlined"
                                                label="N Livraison"
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
                                                label="N Commande"
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
                                                label="Date De Livraison"
                                                name="dateLivraison"
                                                type="date"
                                                value={values.dateLivraison}
                                                required
                                                fullWidth
                                                helperText={
                                                    touched.dateLivraison && errors.dateLivraison
                                                        ? errors.dateLivraison
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
                                                                        label="Quantité"
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
                                                    Ajouter
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
                                            Envoyer
                                        </Button>
                                        <Button
                                            onClick={cancel}
                                            color="error"
                                            variant="contained"
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Annuler
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

export default BonDeLivraisonForm;
