import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import IngredientService from '../../services/IngredientService';
import Header from "../base/Header";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useMediaQuery, useTheme } from '@mui/material';
import { tokens } from "../../theme";

export default function ViewIngredient() {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { id } = useParams();
    const navigate = useNavigate();
    const [ingredient, setIngredient] = useState(null);

    useEffect(() => {
        IngredientService.getIngredientById(id)
            .then((response) => {
                setIngredient(response.data);
            })
            .catch((error) => {
                console.error('Error fetching ingredient:', error);
            });
    }, [id]);

    const editIngredient = (id) => {
        navigate(`/edit-ingredient/${id}`);
    };

    const renderField = (label, value) => {
        if (!value || value === null || value === 0) {
            return null;
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
            <Header title="INGREDIENT DETAILS" subtitle=" " />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Card sx={{ width: '50%', height: '50%', backgroundColor: colors.blueAccent[700] }}>
                    <CardContent>
                        <Grid item xs={12}>
                            {ingredient && (
                            <Typography gutterBottom variant="h5" component="div" sx={{ fontSize: 24, textAlign: 'center' }}>
                                {ingredient.name}
                            </Typography>
                                )}
                        </Grid>
                        {ingredient ? (
                            <Grid container spacing={2}>
                                {renderField('Description', ingredient.description)}
                                {renderField('Max Quantity', ingredient.maxQuantity)}
                                {renderField('Stock Quantity', ingredient.stockQuantity)}
                                {renderField('Unit of Measurement', ingredient.unitOfMeasurement)}
                                {renderField('Unit Price', ingredient.unitPrice)}
                                {renderField('Supplier', ingredient.supplier.businessName || `${ingredient.supplier.firstName} ${ingredient.supplier.lastName}`)}
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
                            onClick={() => navigate('/ingredients')}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<BrowserUpdatedIcon />}
                            onClick={() => editIngredient(id)}
                        >
                            Edit
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Box>
    );
}