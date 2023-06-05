import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import SupplierService from '../../services/SupplierService';
import Header from "../base/Header";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useMediaQuery, useTheme } from '@mui/material';
import { tokens } from "../../theme";

export default function ViewSupplier() {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { id } = useParams();
    const navigate = useNavigate();
    const [supplier, setSupplier] = useState(null);

    useEffect(() => {
        SupplierService.getSupplierById(id)
            .then((response) => {
                setSupplier(response.data);
            })
            .catch((error) => {
                console.error('Error fetching supplier:', error);
            });
    }, [id]);

    const editSupplier = (id) => {
        navigate(`/edit-supplier/${id}`);
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
            <Header title="SUPPLIER DETAILS" subtitle=" " />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Card sx={{ width: '50%', height: '50%', backgroundColor: colors.blueAccent[700] }}>
                    <CardContent>
                        <Grid item xs={12}>
                            <Typography gutterBottom variant="h5" component="div" sx={{ fontSize: 24, textAlign: 'center' }}>
                                {supplier?.businessName || `${supplier?.firstName} ${supplier?.lastName}`}
                            </Typography>
                        </Grid>
                        {supplier ? (
                            <Grid container spacing={2}>
                                {renderField('Address', supplier.address)}
                                {renderField('Business Name', supplier.businessName)}
                                {renderField('CIN', supplier.cin)}
                                {renderField('Contact', supplier.contact)}
                                {renderField('Email', supplier.email)}
                                {renderField('First Name', supplier.firstName)}
                                {renderField('ICE', supplier.ice)}
                                {renderField('Last Name', supplier.lastName)}
                                {renderField('Supplied Product', supplier.suppliedProduct)}
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
                            onClick={() => navigate('/suppliers')}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<BrowserUpdatedIcon />}
                            onClick={() => editSupplier(id)}
                        >
                            Edit
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Box>
    );
}