import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import FactureService from "../../services/FactureService";
import Header from "../base/Header";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import DownloadIcon from '@mui/icons-material/Download';
import { useMediaQuery, useTheme } from '@mui/material';
import { tokens } from "../../theme";
import UserService from "../../services/UserService";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';


export default function ViewFacture() {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { id } = useParams();
    const navigate = useNavigate();
    const [bill, setBill] = useState(null);

    useEffect(() => {
        FactureService.getFactureById(id)
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

    const exportPDF = async () => {
        try {
            const response = await FactureService.exportFactureToPDF(id);
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
            <Header title="FACTURE DETAILS" subtitle=" " />
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                {bill ? (
                    <Card style={{ width: '50%', height: '50%', backgroundColor: colors.blueAccent[700] }}>
                        <CardContent>
                            <Grid item xs={12}>
                                <Typography gutterBottom variant="h5" component="div" style={{ fontSize: 24, textAlign: 'center' }}>
                                    {bill.numeroFacture}
                                </Typography>
                            </Grid>
                            <Grid container spacing={2}>
                                {renderField('N Livraison', bill.numeroLivraison)}
                                {renderField('N Commande', bill.numeroCommande)}
                                {renderField('Date de facture', bill.dateFacture)}
                                {renderField('Client', bill.client)}
                            </Grid>
                            <Typography gutterBottom variant="h5" component="div" style={{ fontSize: 24, textAlign: 'center' }}>



                            </Typography>
                            {/* Display FactureDetails in a table */}
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Produit</TableCell>
                                            <TableCell>Quantité</TableCell>
                                            <TableCell>Prix unitaire (HT)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {bill.factureDetails.map((detail) => (
                                            <TableRow key={detail.id}>
                                                <TableCell>{detail.produit}</TableCell>
                                                <TableCell>{detail.quantiteCommande}</TableCell>
                                                <TableCell>{detail.prixUnitaire}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Grid container justifyContent="flex-end"  marginTop='10px' >
                                {renderField('Total HT', `${bill.totalHT} DH`)}
                            </Grid>
                            <Grid container justifyContent="flex-end"  marginTop='10px' >
                                {renderField('Total TVA', `${bill.totalTVA} DH`)}
                            </Grid>
                            <Grid container justifyContent="flex-end"  marginTop='10px' >
                                {renderField('Total TTC', `${bill.totalTTC} DH`)}
                            </Grid>

                        </CardContent>
                        <CardActions style={{ justifyContent: 'center', paddingBottom: '16px' }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                style={{ marginRight: '10px' }}
                                startIcon={<KeyboardBackspaceIcon />}
                                onClick={() => navigate('/Facture')}
                            >
                                Retour
                            </Button>

                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<DownloadIcon />}
                                style={{ marginLeft: '10px' }}
                                onClick={exportPDF}
                            >
                                Exporter en PDF
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
