{/*import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import React, { useState } from 'react';
import ProductService from "../services/ProductService";
import IngredientService from "../services/IngredientService";
import * as React from 'react';
import  { useState, useEffect } from 'react';

const ProductionForm = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = () => {
    IngredientService.getAllIngredients().then((res) => {
      setIngredients(res.data);
    });
  };

  const initialValues = {
    ingredientData: ingredients.reduce((data, ingredient) => {
      data[ingredient.ingredient_id] = 0;
      return data;
    }, {}),
  };

  const handleFormSubmit = (values) => {
    const ingredientData = values.ingredientData;

    // Calculate production cost
    let productionCost = 0;
    const updatedIngredients = ingredients.map((ingredient) => {
      const ingredientId = ingredient.ingredient_id;
      const quantity = ingredientData[ingredientId];
      const cost = quantity * ingredient.unit_price;
      productionCost += cost;

      // Update stock quantity
      const updatedStockQuantity = ingredient.stock_quantity - quantity;
      IngredientService.updateIngredientStock(ingredientId, updatedStockQuantity);

      return {
        ...ingredient,
        stock_quantity: updatedStockQuantity,
      };
    });

    console.log('Production Cost: $', productionCost);
    console.log('Updated Ingredients:', updatedIngredients);
  };

  const validationSchema = yup.object().shape({
    ingredientData: yup.object().shape(
      ingredients.reduce((schema, ingredient) => {
        schema[ingredient.ingredient_id] = yup
          .number()
          .integer('Quantity must be an integer')
          .min(0, 'Quantity must be greater than or equal to 0')
          .max(ingredient.stock_quantity, `Quantity exceeds available stock (${ingredient.stock_quantity})`)
          .required('Quantity is required');
        return schema;
      }, {})
    ),
  });

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
            {ingredients.map((ingredient) => (
              <TextField
                key={ingredient.ingredient_id}
                fullWidth
                variant="filled"
                type="number"
                label={ingredient.name}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.ingredientData[ingredient.ingredient_id]}
                name={`ingredientData.${ingredient.ingredient_id}`}
                error={touched.ingredientData && touched.ingredientData[ingredient.ingredient_id] && !!errors.ingredientData[ingredient.ingredient_id]}
                helperText={touched.ingredientData && touched.ingredientData[ingredient.ingredient_id] && errors.ingredientData[ingredient.ingredient_id]}
              />
            ))}

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Calculate Production Cost
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default ProductionForm;*/}

