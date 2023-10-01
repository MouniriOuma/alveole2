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
import BorderColorIcon from "@mui/icons-material/BorderColor";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useMediaQuery, useTheme } from '@mui/material';
import { tokens } from "../../theme";
import UserService from "../../services/UserService";

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

    //define the role
    const username = localStorage.getItem('username');
    const [role, setRole] = useState('');

    React.useEffect(() => {

        UserService.getUserRoleByUsername(username)
            .then((response) => {

                const roleNames = response.data;
                if (roleNames.includes('ROLE_USER') && !roleNames.includes('ROLE_ADMIN')) {
                    setRole('user');
                } else if (roleNames.includes('ROLE_ADMIN')) {
                    setRole('admin');
                } else {
                    setRole('');
                }
            })
            .catch((error) => {
                console.error('Error fetching user roles:', error);
            });
    }, [username]);

    const isUser = role.includes('user') && !role.includes('admin');


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
            <Header title="DETAILS D'INGREDIENT" subtitle=" " />
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
                                {renderField('Déscription', ingredient.description)}
                                {renderField('Quantité maximale', ingredient.maxQuantity)}
                                {renderField('Quantité stockée', ingredient.stockQuantity)}
                                {renderField('Unité de mesure', ingredient.unitOfMeasurement)}
                                {renderField('Prix unitaire', ingredient.unitPrice)}
                                {renderField('Fournisseur', ingredient.supplier.businessName || `${ingredient.supplier.firstName} ${ingredient.supplier.lastName}`)}
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
                            Retour
                        </Button>
                        {!isUser && (
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<BorderColorIcon />}
                            onClick={() => editIngredient(id)}
                        >
                            Modifier
                        </Button>)}
                    </CardActions>
                </Card>
            </Box>
        </Box>
    );
}
