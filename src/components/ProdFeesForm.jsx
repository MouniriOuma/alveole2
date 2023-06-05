
import * as React from 'react';
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import ProductionCostService from "../services/ProductionCostService";
import IngredientService from "../services/IngredientService";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as yup from "yup";

const ProdFeesForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

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

                        <Box display="flex" justifyContent="end" mt="20px">
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

export default ProdFeesForm;


{/*
const ProdFeesForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

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
    let updatedStockQuantity = 0;
  const handleFormSubmit = (values) => {

      const ingredientData = Object.assign({}, values.ingredientData, { 0: 0 });

      console.log("ingredientData :", ingredientData);
      let productionCost = 0;
      let cost = 0;
      let quantity = 0;
      let unitPrice = 0;
      let oldStockQuantity = 0;
      let ingredientId = 0;

    // Calculate production cost

    const updatedIngredients = ingredients.map((ingredient) => {

        ingredientId = ingredient.ingredientId;
      console.log('ingredientId', ingredientId);


            quantity = ingredientData[ingredientId];
        console.log('quantity', quantity);


        unitPrice = ingredient.unitPrice;


            cost = quantity * ingredient.unitPrice;
        console.log('cost', cost);

         productionCost += cost;


        oldStockQuantity = ingredient.stockQuantity;
      // Update stock quantity
        updatedStockQuantity = oldStockQuantity - quantity;
      IngredientService.updateIngredientStock(ingredientId, updatedStockQuantity);

      return {
        ...ingredient,
        stockQuantity: updatedStockQuantity,
      };
    });

    console.log('Production Cost: $', productionCost);

    // Remove this later
    console.log('Updated Ingredients:', updatedIngredients);
  };

  const validationSchema = yup.object().shape({
    ingredientData: yup.object().shape(
        ingredients.reduce((schema, ingredient) => {
          schema[ingredient.ingredientId] = yup
              .number()
              .min(0, 'Quantity must be greater than or equal to 0')
              .max(ingredient.stockQuantity, `Quantity exceeds available stock (${ingredient.stockQuantity})`)
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
                {ingredients.length > 0 && ingredients.map((ingredient) => (
                    <TextField
                        key={ingredient.ingredientId}
                        fullWidth
                        variant="filled"
                        type="number"
                        label={ingredient.name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.ingredientData[ingredient.ingredientId] || '0'}
                        name={`ingredientData.${ingredient.ingredientId}`}
                        error={touched?.ingredientData && touched.ingredientData[ingredient.ingredientId] && !!errors?.ingredientData && !!errors.ingredientData[ingredient.ingredientId]}
                        helperText={touched?.ingredientData && touched.ingredientData[ingredient.ingredientId] && errors?.ingredientData && errors.ingredientData[ingredient.ingredientId]}
                        sx={{ gridColumn: "span 2" }}
                    />
                ))}

                <Box display="flex" justifyContent="end" mt="20px">
                  <Button type="submit" color="secondary" variant="contained" onClick={handleFormSubmit}>
                    Calculate Production Cost
                  </Button>
                </Box>
              </form>
          )}
        </Formik>
      </Box>
  );
};

export default ProdFeesForm;*/}
