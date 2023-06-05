
import * as React from 'react';
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import ProductionCostService from "../services/ProductionCostService";
import IngredientService from "../services/IngredientService";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as yup from "yup";
import Header from "../scenes/base/Header";
import { useNavigate } from "react-router-dom";

const ProdCostForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");


    const navigate = useNavigate();

    const [ingredients, setIngredients] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = () => {
        IngredientService.getIngredients()
            .then((res) => {
                console.log("Fetched Ingredients:", res.data);
                setIngredients(res.data);
            })
            .catch((error) => {
                console.error("Error fetching ingredients:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const initialValues = {
        ingredientData: ingredients.reduce((data, ingredient) => {
            data[ingredient.ingredientId] = 0;
            console.log("initial data:", data);
            return data;
        }, {}),
    };

    const handleFormSubmit = (values) => {
        const ingredientData = Object.assign({}, values.ingredientData, { 0: 0 });

        console.log("ingredientData:", ingredientData);

        let productionCost = 0;
        let updatedStockQuantity = 0;

        const updatedIngredients = ingredients.map((ingredient) => {
            const ingredientId = ingredient.ingredientId;
            const quantity = ingredientData[ingredientId] || 0;
            const cost = quantity * ingredient.unitPrice;

            productionCost += cost;

            const oldStockQuantity = ingredient.stockQuantity;
            updatedStockQuantity = oldStockQuantity - quantity;

            IngredientService.updateIngredientStock(ingredientId, updatedStockQuantity);

            return {
                ...ingredient,
                stockQuantity: updatedStockQuantity,
            };
        });
        console.log("Updated Ingredients:", updatedIngredients);


        console.log("Production Cost: $", productionCost);


            // Save production cost to the table
            const currentDate = new Date().toISOString().split('T')[0];
            const productionCostEntry = {
                cost: productionCost,
                date: currentDate,
            };
            ProductionCostService.createProductionCost(productionCostEntry)
                .then(() => {
                    console.log("Production cost saved successfully!");
                    navigate("/production_cost");
                })
                .catch((error) => {
                    console.error("Error saving production cost:", error);
                });


    };

    const validationSchema = yup.object().shape({
        ingredientData: yup.object().shape(
            ingredients.reduce((schema, ingredient) => {
                schema[ingredient.ingredientId] = yup
                    .number()
                    .min(0, "Quantity must be greater than or equal to 0")
                    .max(
                        ingredient.stockQuantity,
                        `Quantity exceeds available stock (${ingredient.stockQuantity})`
                    )
                    .required("Quantity is required");
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
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
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


                        {ingredients.length > 0 &&
                            ingredients.map((ingredient) => (
                                <TextField
                                    key={ingredient.ingredientId}
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label={ingredient.name}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.ingredientData[ingredient.ingredientId] || "0"}
                                    name={`ingredientData.${ingredient.ingredientId}`}
                                    error={
                                        touched?.ingredientData &&
                                        touched.ingredientData[ingredient.ingredientId] &&
                                        !!errors?.ingredientData &&
                                        !!errors.ingredientData[ingredient.ingredientId]
                                    }
                                    helperText={
                                        touched?.ingredientData &&
                                        touched.ingredientData[ingredient.ingredientId] &&
                                        errors?.ingredientData &&
                                        errors.ingredientData[ingredient.ingredientId]
                                    }
                                    sx={{ gridColumn: "span 2" }}
                                />
                            ))}
                        </Box>
                        <Box display="flex" justifyContent="center" mt="20px">
                            <Button
                                type="submit"
                                color="secondary"
                                variant="contained"
                                onClick={handleFormSubmit}
                            >
                                Calculate Production Cost
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

export default ProdCostForm;

