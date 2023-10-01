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

export default function ViewProductCost() {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { id } = useParams();
    const navigate = useNavigate();
    const [productCost, setProductCost] = useState(null);

    useEffect(() => {
        ProductCostService.getProductCostById(id)
            .then((response) => {
                setProductCost(response.data);
            })
            .catch((error) => {
                console.error('Error fetching product cost:', error);
            });
    }, [id]);

    const renderField = (label, value) => {
        if (!value || value === null || value === 0) {
            return null;
        }

        if (label === 'Cout') {
            value = `${value} DH`;
        }

        return (
            <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 20 }}>
                    <strong>{label}:</strong> {value}
                </Typography>
            </Grid>
        );
    };

    return (
        <Box m="20px">
            <Header title="DETAILS DE COUT DE PRODUIT " subtitle=" " />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Card sx={{ width: '50%', height: '50%', backgroundColor: colors.blueAccent[700] }}>
                    <CardContent>
                        <Grid item xs={12}>
                            <Typography gutterBottom variant="h5" component="div" sx={{ fontSize: 24, textAlign: 'center' }}>
                                {productCost ? (
                                    <span>Prix de {productCost.productName} du {productCost.date}</span>
                                ) : (
                                    <span>Loading...</span>
                                )}
                            </Typography>
                        </Grid>
                        {productCost ? (
                            <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                                {renderField('Cout', productCost.cost)}
                            </Grid>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Loading...
                            </Typography>
                        )}
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', paddingBottom: '16px' }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ marginRight: '10px' }}
                            startIcon={<KeyboardBackspaceIcon />}
                            onClick={() => navigate('/product-cost')}
                        >
                            Retour
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Box>
    );
}
