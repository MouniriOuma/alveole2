import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import BonDeCommandeService from "../../services/BonDeCommandeService";
import Header from "../base/Header";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import DownloadIcon from '@mui/icons-material/Download';
import { useMediaQuery, useTheme } from '@mui/material';
import { tokens } from "../../theme";
import UserService from "../../services/UserService";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';


export default function ViewBonDeCommande() {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { id } = useParams();
    const navigate = useNavigate();
    const [bill, setBill] = useState(null);

    useEffect(() => {
        BonDeCommandeService.getBonDeCommandeById(id)
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


    const editBonDeCommande = (id) => {
        navigate(`/edit-Bon-De-Commande/${id}`);
    };
    const exportPDF = async () => {
        try {
            const response = await BonDeCommandeService.exportBonDeCommandeToPDF(id);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url);
        } catch (error) {
            console.error('Error exporting pdf:', error);
        }
    };

    const renderField = (label, value) => (
        <Grid item xs={6}>
            <Typography variant="body1" style={{ display: 'flex' }}>
                <span>{label} :</span>
                <span style={{ marginLeft: 20 }}>{value}</span>
            </Typography>
        </Grid>
    );



    return (
        <Box m="20px">
            <Header title="BON DE COMMANDE DETAILS" subtitle=" " />
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                {bill ? (
                    <Card style={{ width: '50%', height: '50%', backgroundColor: colors.blueAccent[700] }}>
                        <CardContent>
                            <Grid item xs={12}>
                                <Typography gutterBottom variant="h5" component="div" style={{ fontSize: 24, textAlign: 'center' }}>
                                    {bill.numeroCommande}
                                </Typography>
                            </Grid>
                            <Grid container spacing={2}>
                                {renderField('Date Commande', bill.dateCommande)}
                                {renderField('Client', bill.client)}
                            </Grid>
                            <Typography gutterBottom variant="h5" component="div" style={{ fontSize: 24, textAlign: 'center' }}>



                            </Typography>
                            {/* Display bonDeCommandeDetails in a table */}
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Unit Price</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {bill.bonDeCommandeDetails.map((detail) => (
                                            <TableRow key={detail.id}>
                                                <TableCell>{detail.produit}</TableCell>
                                                <TableCell>{detail.quantite}</TableCell>
                                                <TableCell>{detail.prixUnitaire}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Grid container justifyContent="flex-end"  marginTop='10px' >
                                {renderField('Total HT', `${bill.totalHT} DH`)}
                            </Grid>

                        </CardContent>
                        <CardActions style={{ justifyContent: 'center', paddingBottom: '16px' }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                style={{ marginRight: '10px' }}
                                startIcon={<KeyboardBackspaceIcon />}
                                onClick={() => navigate('/bon-de-commandes')}
                            >
                                Back
                            </Button>
                            {!isUser && (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<BorderColorIcon />}
                                    onClick={() => editBonDeCommande(id)}
                                >
                                    Edit
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<DownloadIcon />}
                                style={{ marginLeft: '10px' }}
                                onClick={exportPDF}
                            >
                                Export PDF
                            </Button>
                        </CardActions>
                    </Card>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        Loading...
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
