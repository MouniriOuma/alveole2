import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import ProductCostService from '../../services/ProductCostService';
import Header from "../base/Header";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useMediaQuery, useTheme } from '@mui/material';
import { tokens } from "../../theme";

export default function Cost() {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { price } = useParams();
    console.log(price);
    const navigate = useNavigate();


    const renderField = (value) => {
        if (!value || value === null || value === 0) {
            return null;
        }


           value = `${value} DH`;


        return (
            <Grid item xs={12}>
                <Typography variant="h5" color="text.secondary" sx={{ fontSize: 16 }}>
                    <strong>{value}</strong>
                </Typography>
            </Grid>
        );
    };

    const saveCost = (price) => {
        // Generate the current date in "YYYY-MM-DD" format
        const currentDate = new Date().toISOString().split('T')[0];

        // Prepare the data
        const productCost = {
            date: currentDate,
            cost: price,
        };

        ProductCostService.createProductCost(productCost).then((res) => {
            navigate("/product-cost");
        });

    }

    return (
        <Box m="20px">
            <Header title="Prix unitaire du produit d'aujourd'hui" subtitle=" " />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Card sx={{ width: '50%', height: '50%', backgroundColor: colors.blueAccent[700] }}>
                    <CardContent>
                        <Grid item xs={12}>
                            <Typography gutterBottom variant="h4" component="div" sx={{ fontSize: 24, textAlign: 'center' }}>

                                    <span>Le prix unitaire est </span>{renderField(price)}


                            </Typography>
                        </Grid>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', paddingBottom: '16px' }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ marginRight: '10px' }}
                            startIcon={<KeyboardBackspaceIcon />}
                            onClick={() => navigate('/add-product-cost')}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ marginRight: '10px' }}
                            startIcon={<KeyboardBackspaceIcon />}
                            onClick={saveCost(price)}
                        >
                            save
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ marginRight: '10px' }}
                            startIcon={<KeyboardBackspaceIcon />}
                            onClick={() => navigate('/product-cost')}
                        >
                            skip
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Box>
    );
}
