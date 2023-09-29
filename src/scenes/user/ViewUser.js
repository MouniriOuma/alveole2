
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
export default function ViewUser() {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        UserService.getUserById(id)
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                console.error('Error fetching user:', error);
            });
    }, [id]);

    const editUser = (id) => {
        navigate(`/edit-user/${id}`);
    };

    return (
        <Box m="20px">
            <Header title="DETAILS D'UTILISATEUR" subtitle=" " />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Card sx={{ width: '50%', height: '50%', backgroundColor: colors.blueAccent[700] }}>
                    <CardContent>
                        {user ? (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography gutterBottom variant="h5" component="div" sx={{ fontSize: 24, textAlign: 'center' }}>
                                        {user.username}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 16 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <strong>Email:</strong>
                                            <Box sx={{ marginLeft: '30px' }}>{user.email}</Box>
                                        </Box>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 16 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <strong>Role:</strong>
                                            <Box sx={{ marginLeft: '50px' }}>
                                                {user.roles.map((role) => {
                                                    if (role.name.includes('ROLE_ADMIN')) {
                                                        return 'admin';
                                                    } else if (role.name === 'ROLE_USER') {
                                                        return 'user';
                                                    } else {
                                                        return '';
                                                    }
                                                }).join(" ")}
                                            </Box>
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
                            onClick={() => navigate('/users')}
                        >
                            Retour
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<BorderColorIcon />}
                            onClick={() => editUser(id)}
                        >
                            Modifier
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Box>
    );
}
