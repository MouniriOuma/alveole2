import React, { useState, useEffect, useRef  } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {Box, useMediaQuery} from "@mui/material";
import {useNavigate} from "react-router-dom";
import IngredientService from "../../services/IngredientService";
import ProductionCostService from "../../services/ProductionCostService";
import Header from "../base/Header";

const ProdCostForm = () => {
    const isNonMobile = useMediaQuery('(min-width:600px)');

    const navigate = useNavigate();

    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const formikRef = useRef(null);

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = () => {
        IngredientService.getIngredients()
            .then((res) => {
                console.log('Fetched Ingredients:', res.data);
                setIngredients(res.data);

                // Set initial values based on fetched ingredients
                const initialValues = {
                    ingredientData: res.data.reduce((data, ingredient) => {
                        data[ingredient.ingredientId] = 0;
                        return data;
                    }, {}),
                };

                // Assign initial values to Formik initialValues
                formikRef.current.setValues(initialValues);
            })
            .catch((error) => {
                console.error('Error fetching ingredients:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleAddIngredient = (ingredientId) => {
        setSelectedIngredients((prevIngredients) => [...prevIngredients, ingredientId]);
    };

    const handleFormSubmit = (values) => {
        // handle form submission logic
    };

    const validationSchema = Yup.object().shape({
        ingredientData: Yup.object().shape(
            ingredients.reduce((schema, ingredient) => {
                schema[ingredient.ingredientId] = Yup.number()
                    .min(0, 'Quantity must be greater than or equal to 0')
                    .max(
                        ingredient.stockQuantity,
                        `Quantity exceeds available stock (${ingredient.stockQuantity})`
                    )
                    .required('Quantity is required');
                return schema;
            }, {})
        ),
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Box m="20px">
            <Header title="CALCULATE PRODUCTION COST" subtitle="Calculate production cost for the day" />
            <Formik
                initialValues={{ ingredientData: {} }}
                validationSchema={validationSchema}
                onSubmit={handleFormSubmit}
                enableReinitialize
                innerRef={formikRef}
            >
                <Form>
                    {selectedIngredients.map((ingredientId) => {
                        const ingredient = ingredients.find((ingredient) => ingredient.ingredientId === ingredientId);
                        return (
                            <div key={ingredient.ingredientId}>
                                <Field
                                    type="number"
                                    name={`ingredientData.${ingredient.ingredientId}`}
                                    className="input-field"
                                    label={ingredient.name}
                                />
                                <ErrorMessage
                                    name={`ingredientData.${ingredient.ingredientId}`}
                                    component="div"
                                    className="error-message"
                                />
                            </div>
                        );
                    })}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        {selectedIngredients.length < ingredients.length && (
                            <button
                                type="button"
                                className="add-ingredient-button"
                                onClick={() => handleAddIngredient(ingredients[selectedIngredients.length].ingredientId)}
                            >
                                Add Ingredient
                            </button>
                        )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <button type="submit" className="submit-button">
                            Calculate Production Cost
                        </button>
                    </div>
                </Form>
            </Formik>
        </Box>
    );
};

export default ProdCostForm;



