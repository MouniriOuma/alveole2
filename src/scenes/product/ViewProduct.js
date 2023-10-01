import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import ProductService from '../../services/ProductService';
import Header from "../base/Header";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useMediaQuery, useTheme } from '@mui/material';
import { tokens } from "../../theme";
import UserService from "../../services/UserService";

export default function ViewProduct() {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        ProductService.getProductById(id)
            .then((response) => {
                setProduct(response.data);
            })
            .catch((error) => {
                console.error('Error fetching product:', error);
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


    const editProduct = (id) => {
        navigate(`/edit-product/${id}`);
    };

    return (
        <Box m="20px">
            <Header title="PRODUIT DETAILS" subtitle=" " />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Card sx={{ width: '50%', height: '50%', backgroundColor: colors.blueAccent[700] }}>
                    <CardContent>
                        {product ? (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography gutterBottom variant="h5" component="div" sx={{ fontSize: 24, textAlign: 'center' }}>
                                        {product.productName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 16 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <strong>Déscription:</strong>
                                            <Box sx={{ marginLeft: '30px' }}>{product.description}</Box>
                                        </Box>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 16 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <strong>Quantité:</strong>
                                            <Box sx={{ marginLeft: '50px' }}>{product.quantity}</Box>
                                        </Box>
                                    </Typography>
                                </Grid>
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
                            onClick={() => navigate('/products')}
                        >
                            Retour
                        </Button>
                        {!isUser && (
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<BorderColorIcon />}
                            onClick={() => editProduct(id)}
                        >
                            Modifier
                        </Button>)}
                    </CardActions>
                </Card>
            </Box>
        </Box>
    );
}
