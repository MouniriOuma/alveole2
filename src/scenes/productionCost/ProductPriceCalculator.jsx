import React, { useState, useEffect, useRef  } from 'react';
import {Box, Button, TextField, Typography} from "@mui/material";
import { FieldArray, Form, Formik, getIn } from "formik";
import * as yup from "yup";
import * as Yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useNavigate, useParams} from "react-router-dom";
import Header from "../base/Header";


const ProductPriceCalculator = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const navigate = useNavigate();

    const validationSchema = yup.object().shape({
        ingredients: yup.array().of(
            yup.object().shape({
                name: yup.string().required('Ingredient name is required'),
                quantite: yup.number().min(0).required('Quantity is required'),
                prixUnitaire: yup.number().min(0).required('Unit price is required'),
            })
        ),
        others: yup.array().of(
            yup.object().shape({
                name: yup.string().required('Other name is required'),
                prix: yup.number().min(0).required('Price is required'),
            })
        ),
        electricite: yup.number().min(0).required('Electricity cost is required'),
        salarie: yup.number().min(0).required('Salary cost is required'),
        location: yup.number().min(0).required('Location cost is required'),
        produits: yup.array().of(
            yup.object().shape({
                name: yup.string().required('Product name is required'),
                quantite: yup.number().min(0).required('Quantity is required'),
                prixUnitaire: yup.number().min(0).required('Unit price is required'),
            })
        ),
    });

    const cancel = () => {
        navigate('/BonDeCommande');
    };

    const getTitle = () => {
        return <span className="text-center">Calculer prix produit</span>;
    };

    const getSubTitle = () => {
        return <span className="text-center">Add details</span>;
    };

    function calculateProductPrice(values) {
        const {
            ingredients,
            others,
            electricite,
            salarie,
            location,
            nomProduit,
            quatiteProduit, // Corrected from 'quatiteProduit'
        } = values;

        // Calculate the total cost of ingredients
        const ingredientsTotalCost = ingredients.reduce((total, ingredient) => {
            const ingredientTotal = ingredient.quantite * ingredient.prixUnitaire;
            return total + ingredientTotal;
        }, 0);

        // Calculate the total cost of others
        const othersTotalCost = others.reduce((total, other) => {
            return total + other.prix;
        }, 0);

        // Calculate the total cost of all components (ingredients, others, electricity, salary, location)
        const totalCost = ingredientsTotalCost + othersTotalCost + electricite + salarie + location;

        // Calculate the cost per product
        const costPerProduct = totalCost / quatiteProduit; // Corrected from 'quantiteProduit'

        console.log('Cost per product inside function:', costPerProduct); // Log the cost per product

        navigate(`/production-cost/${costPerProduct}`);

        return costPerProduct;
    }
    return (
        <Box m="20px">
            <Header title={getTitle()} subtitle={getSubTitle()} />
            <div className="row">
                <div className="col-sm-12">
                    <Formik
                        initialValues={{
                            ingredients: [
                                {
                                    name:'',
                                    quantite: 0,
                                    prixUnitaire: 0,
                                }
                            ],
                            others: [
                                {
                                    name:'',
                                    prix: 0,
                                }
                            ],

                            electricite:0,
                            salarie:0,
                            location:0,

                            nomProduit:'',
                            quatiteProduit:0,

                        }}
                        validationSchema={validationSchema}
                        onSubmit={values => {
                            console.log("onSubmit", JSON.stringify(values, null, 2));
                            calculateProductPrice(values);
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

                                    <FieldArray name="ingredients">
                                    {({ push, remove }) => (
                                        <div>
                                            {values.ingredients.map((detail, index) => {
                                                const Name = `ingredients[${index}].name`;
                                                const touchedName = getIn(touched, Name);
                                                const errorName = getIn(errors, Name);

                                                const quantiteName = `ingredients[${index}].quantite`;
                                                const touchedQuantite = getIn(touched, quantiteName);
                                                const errorQuantite = getIn(errors, quantiteName);

                                                const prixUnitaireName = `ingredients[${index}].prixUnitaire`;
                                                const touchedPrixUnitaire = getIn(touched, prixUnitaireName);
                                                const errorPrixUnitaire = getIn(errors, prixUnitaireName);

                                                return (
                                                    <div key={index} className="mb-3">
                                                        <div className="row">
                                                            <Typography variant="subtitle1">Ingredients</Typography>
                                                            <div className="col-md-3">
                                                                <TextField
                                                                    margin="normal"
                                                                    variant="outlined"
                                                                    label="Name"
                                                                    name={Name}
                                                                    value={detail.name}
                                                                    required
                                                                    fullWidth
                                                                    helperText={
                                                                        touchedName && errorName
                                                                            ? errorName
                                                                            : ""
                                                                    }
                                                                    error={Boolean(touchedName && errorName)}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                />
                                                            </div>
                                                            <div className="col-md-3">
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
                                                            <div className="col-md-3">
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
                                                            <div className="col-md-1 d-flex align-items-center">
                                                                <Button
                                                                    sx={{ m: 2, height: '40px', width: '120px' }}
                                                                    type="button"
                                                                    color="error"
                                                                    variant="outlined"
                                                                    onClick={() => remove(index)}
                                                                >
                                                                    Remove
                                                                </Button>
                                                            </div>

                                                        </div>

                                                    </div>
                                                );
                                            })}
                                            <Button
                                                sx={{mt: -1}}
                                                type="button"
                                                variant="outlined"
                                                color="success"
                                                onClick={() =>
                                                    push({ name: "", quantite: 0, prixUnitaire: 0 })
                                                }
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    )}
                                </FieldArray>
                                    <Typography variant="subtitle2" style={{ marginBottom: '-20px' }}>Charges</Typography>
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
                                                label="Electricite"
                                                name="electricite"
                                                type="number"
                                                value={values.electricite}
                                                required
                                                fullWidth
                                                helperText={
                                                    touched.electricite && errors.electricite
                                                        ? errors.electricite
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
                                                label="salarie"
                                                name="salarie"
                                                value={values.salarie}
                                                type="number"
                                                required
                                                fullWidth
                                                helperText={
                                                    touched.salarie && errors.salarie
                                                        ? errors.salarie
                                                        : ""
                                                }
                                                error={Boolean(touched.salarie && errors.salarie)}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Box>
                                        <Box mb={2}>
                                            <TextField
                                                margin="normal"
                                                variant="outlined"
                                                label="location"
                                                name="location"
                                                value={values.location}
                                                type="number"
                                                required
                                                fullWidth
                                                helperText={
                                                    touched.location && errors.location
                                                        ? errors.location
                                                        : ""
                                                }
                                                error={Boolean(touched.location && errors.location)}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Box>
                                    </Box>

                                    <FieldArray name="others">
                                        {({ push, remove }) => (
                                            <div>
                                                {values.others.map((detail, index) => {
                                                    const Name = `others[${index}].name`;
                                                    const touchedName = getIn(touched, Name);
                                                    const errorName = getIn(errors, Name);

                                                    const prixName = `others[${index}].prix`;
                                                    const touchedPrix = getIn(touched, prixName);
                                                    const errorPrix = getIn(errors, prixName);

                                                    return (
                                                        <div key={index} className="mb-3">
                                                            <div className="row">
                                                                <Typography variant="subtitle3">Autres</Typography>
                                                                <div className="col-md-3">
                                                                    <TextField
                                                                        margin="normal"
                                                                        variant="outlined"
                                                                        label="Name"
                                                                        name={Name}
                                                                        value={detail.name}
                                                                        required
                                                                        fullWidth
                                                                        helperText={
                                                                            touchedName && errorName
                                                                                ? errorName
                                                                                : ""
                                                                        }
                                                                        error={Boolean(touchedName && errorName)}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                    />
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <TextField
                                                                        margin="normal"
                                                                        label="Prix "
                                                                        name={prixName}
                                                                        value={detail.prix}
                                                                        type="number"
                                                                        required
                                                                        fullWidth
                                                                        helperText={
                                                                            touchedPrix && errorPrix
                                                                                ? errorPrix
                                                                                : ""
                                                                        }
                                                                        error={Boolean(touchedPrix && errorPrix)}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                    />
                                                                </div>
                                                                <div className="col-md-1 d-flex align-items-center">
                                                                    <Button
                                                                        sx={{ m: 2, height: '40px', width: '120px' }}
                                                                        type="button"
                                                                        color="error"
                                                                        variant="outlined"
                                                                        onClick={() => remove(index)}
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    );
                                                })}
                                                <Button
                                                    sx={{mt: -1}}
                                                    type="button"
                                                    variant="outlined"
                                                    color="success"
                                                    onClick={() =>
                                                        push({ name: "", prix: 0 })
                                                    }
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        )}
                                    </FieldArray>

                                    <Typography variant="subtitle3" style={{ marginBottom: '-20px' }}>Produit</Typography>
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
                                                label="Name"
                                                name="nomProduit"
                                                value={values.nomProduit}
                                                required
                                                fullWidth
                                                helperText={
                                                    touched.nomProduit && errors.nomProduit
                                                        ? errors.nomProduit
                                                        : ""
                                                }
                                                error={Boolean(touched.nomProduit && errors.nomProduit)}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Box>
                                        <Box mb={2}>
                                            <TextField
                                                margin="normal"
                                                variant="outlined"
                                                label="Quantite"
                                                name="quatiteProduit"
                                                value={values.quatiteProduit}
                                                type="number"
                                                required
                                                fullWidth
                                                helperText={
                                                    touched.quatiteProduit && errors.quatiteProduit
                                                        ? errors.quatiteProduit
                                                        : ""
                                                }
                                                error={Boolean(touched.quatiteProduit && errors.quatiteProduit)}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Box>
                                    </Box>

                                    <div style={{ textAlign: 'center', marginTop: '-30px', marginBottom: '10px' }}>
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

export default ProductPriceCalculator;




