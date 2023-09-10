import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import WaterElecService from '../../services/WaterElecService';
import Header from "../base/Header";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useMediaQuery, useTheme } from '@mui/material';
import { tokens } from "../../theme";
import UserService from "../../services/UserService";
export default function ViewWaterElec() {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { id } = useParams();
    const navigate = useNavigate();
    const [waterElec, setWaterElec] = useState(null);

    useEffect(() => {
        WaterElecService.getWaterElecById(id)
            .then((response) => {
                setWaterElec(response.data);
            })
            .catch((error) => {
                console.error('Error fetching water/electricity:', error);
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


    const editWaterElec = (id) => {
        navigate(`/edit-waterElecs/${id}`);
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
            <Header title="WATER/ELECTRICITY DETAILS" subtitle=" " />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Card sx={{ width: '50%', height: '50%', backgroundColor: colors.blueAccent[700] }}>
                    <CardContent>
                        <Grid item xs={12}>
                            <Typography gutterBottom variant="h5" component="div" sx={{ fontSize: 24, textAlign: 'center' }}>
                                {waterElec ? (
                                    <span>{waterElec.water_elec}</span>
                                ) : (
                                    <span>Loading...</span>
                                )}
                            </Typography>
                        </Grid>
                        {waterElec ? (
                            <Grid container spacing={2}>
                                {renderField('Bill Number', waterElec.bill_Num)}
                                {renderField('Cost', waterElec.cost)}
                                {renderField('Date', waterElec.date)}
                                {renderField('Water/Electricity', waterElec.water_elec)}
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
                            onClick={() => navigate('/waterElecs')}
                        >
                            Back
                        </Button>
                        {!isUser && (
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<BorderColorIcon />}
                            onClick={() => editWaterElec(id)}
                        >
                            Edit
                        </Button>)}
                    </CardActions>
                </Card>
            </Box>
        </Box>
    );
}
