import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import ProductionCostService from '../../services/ProductionCostService';
import Header from "../base/Header";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useMediaQuery, useTheme } from '@mui/material';
import { tokens } from "../../theme";

export default function ViewProductionCost() {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { id } = useParams();
    const navigate = useNavigate();
    const [productionCost, setProductionCost] = useState(null);

    useEffect(() => {
        ProductionCostService.getProductionCostById(id)
            .then((response) => {
                setProductionCost(response.data);
            })
            .catch((error) => {
                console.error('Error fetching production cost:', error);
            });
    }, [id]);

    const editProductionCost = (id) => {
        navigate(`/edit-production-cost/${id}`);
    };

    const renderField = (label, value) => {
        if (!value || value === null || value === 0) {
            return null;
        }

        if (label === 'Cost') {
            value = `${value} DH`;
        }

        return (
            <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 16 }}>
                    <strong>{label}:</strong> {value}
                </Typography>
            </Grid>
        );
    };

    return (
        <Box m="20px">
            <Header title="PRODUCTION COST DETAILS" subtitle=" " />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Card sx={{ width: '50%', height: '50%', backgroundColor: colors.blueAccent[700] }}>
                    <CardContent>
                        <Grid item xs={12}>
                            <Typography gutterBottom variant="h5" component="div" sx={{ fontSize: 24, textAlign: 'center' }}>
                                {productionCost ? (
                                    <span>Production Cost of the {productionCost.date}</span>
                                ) : (
                                    <span>Loading...</span>
                                )}
                            </Typography>
                        </Grid>
                        {productionCost ? (
                            <Grid container spacing={2}>
                                {renderField('Date', productionCost.date)}
                                {renderField('Cost', productionCost.cost)}
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
                            onClick={() => navigate('/production_cost')}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<BorderColorIcon />}
                            onClick={() => editProductionCost(id)}
                        >
                            Edit
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Box>
    );
}
