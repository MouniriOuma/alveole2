import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, useTheme } from "@mui/material";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';
import { tokens } from "../../theme";
import Header from "../base/Header";
import FactureService from "../../services/FactureService";
import UserService from "../../services/UserService";

function ListFacture() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [factures, setFacture] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        FactureService.getAllFactures()
            .then((res) => {
                setFacture(res.data);
            })
            .catch((error) => {
                console.log('Error retrieving factures :', error);
            });
    }, []);

    //define the role
    const username = localStorage.getItem('username');
    const [role, setRole] = React.useState('');

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



    const deleteFacture = (id) => {
        FactureService.deleteFacture(id)
            .then(() => {
                setFacture((prevFactures) =>
                    prevFactures.filter((facture) => facture.id !== id)
                );
                window.location.reload();
            })
            .catch((error) => {
                console.log('Error deleting facture :', error);
            });
    };

    const viewFacture = (id) => {
        navigate(`/facture/view/${id}`);
    };

    const addFacture = () => {
        navigate('/facture/add');
    };

    const columns = [
        { field: 'numeroFacture', headerName: 'Numero de Facture', flex: 1 },
        { field: 'numeroCommande', headerName: 'Numero de Commande', flex: 1 },
        { field: 'dateFacture', headerName: 'Date de Facture', type: 'date', flex: 1 },
        { field: 'client', headerName: 'Client', flex: 1 },
        { field: 'totalHT', headerName: 'Total HT', type: 'number', flex: 1 },
        { field: 'totalTVA', headerName: 'Total TVA', type: 'number', flex: 1 },
        { field: 'totalTTC', headerName: 'Total TTC', type: 'number', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: ({ row: { id } }) => (
                <Box
                    width="60%"
                    m="0 auto"
                    p="5px"
                    display="flex"
                    justifyContent="center"
                    borderRadius="4px"
                >

                    {!isUser && (
                        <Box sx={{ background: colors.redAccent[700], borderRadius: '10%', marginRight: '10px' }}>
                            <IconButton aria-label="delete" size="small" onClick={() => deleteFacture(id)}>
                                <DeleteForeverIcon fontSize="inherit" />
                            </IconButton>
                        </Box> )}

                    <Box sx={{ background: colors.greenAccent[500], borderRadius: '10%', marginRight: '10px' }}>
                        <IconButton aria-label="view" size="small" onClick={() => viewFacture(id)}>
                            <VisibilityIcon fontSize="inherit" />
                        </IconButton>
                    </Box>
                </Box>
            ),
        },
    ];

    const rows = factures.map((facture) => ({
        id: facture.id,
        numeroFacture: facture.numeroFacture,
        numeroCommande: facture.numeroCommande,
        dateFacture: new Date(facture.dateFacture),
        client: facture.client,
        totalHT: facture.totalHT,
        totalTVA: facture.totalTVA,
        totalTTC: facture.totalTTC,
    }));

    return (
        <Box m="20px">
            <Header title="FACTURE" subtitle="toutes les factures" />
            <Button
                onClick={addFacture}
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<AddIcon />}
                sx={{ marginRight: '10px' }}
            >
                Ajouter
            </Button>
            <Box
                m="40px 0 0 0"
                height="60vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}
            >
                <DataGrid checkboxSelection rows={rows} columns={columns} />
            </Box>
        </Box>
    );
}

export default ListFacture;
