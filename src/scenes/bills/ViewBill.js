import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import BillService from '../../services/BillService';
import Header from "../base/Header";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useMediaQuery, useTheme } from '@mui/material';
import { tokens } from "../../theme";
import UserService from "../../services/UserService";

export default function ViewBill() {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { id } = useParams();
    const navigate = useNavigate();
    const [bill, setBill] = useState(null);

    useEffect(() => {
        BillService.getBillById(id)
            .then((response) => {
                setBill(response.data);
            })
            .catch((error) => {
                console.error('Error fetching bill:', error);
            });
    }, [id]);

    //define the role
    const username = localStorage.getItem('username');
    const [role, setRole] = useState('');

    React.useEffect(() => {
        console.log('Fetching user roles...');
        UserService.getUserRoleByUsername(username)
            .then((response) => {
                console.log('User roles response:', response.data);
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


    const editBill = (id) => {
        navigate(`/edit-bill/${id}`);
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
            <Header title="BILL DETAILS" subtitle=" " />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Card sx={{ width: '50%', height: '50%', backgroundColor: colors.blueAccent[700] }}>
                    <CardContent>
                        <Grid item xs={12}>
                            <Typography gutterBottom variant="h5" component="div" sx={{ fontSize: 24, textAlign: 'center' }}>
                                {bill ? (
                                    <span>{bill.supplier.businessName || `${bill.supplier.firstName} ${bill.supplier.lastName}`}</span>
                                ) : (
                                    <span>Loading...</span>
                                )}
                            </Typography>
                        </Grid>
                        {bill ? (
                            <Grid container spacing={2}>
                                {renderField('Bill Number', bill.billNumber)}
                                {renderField('Amount', bill.amount)}
                                {renderField('Date', bill.date)}
                                {renderField('Status', bill.status)}
                                {renderField('Supplier', bill.supplier.businessName)}
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
                            onClick={() => navigate('/bills')}
                        >
                            Back
                        </Button>
                        {!isUser && (
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<BorderColorIcon />}
                            onClick={() => editBill(id)}
                        >
                            Edit
                        </Button>)}
                    </CardActions>
                </Card>
            </Box>
        </Box>
    );
}
