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
import BonDeCommandeService from "../../services/BonDeCommandeService";
import UserService from "../../services/UserService";

function ListBonDeCommande() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [bonDeCommandes, setBonDeCommande] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        BonDeCommandeService.getAllBonDeCommandes()
            .then((res) => {
                setBonDeCommande(res.data);
            })
            .catch((error) => {
                console.log('Error retrieving bon de commande :', error);
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



    const deleteBonDeCommande = (id) => {
        BonDeCommandeService.deleteBonDeCommande(id)
            .then(() => {
                setBonDeCommande((prevBonDeCommandes) =>
                    prevBonDeCommandes.filter((bonDeCommande) => bonDeCommande.id !== id)
                );
                window.location.reload();
            })
            .catch((error) => {
                console.log('Error deleting bon de commande :', error);
            });
    };

    const viewBonDeCommande = (id) => {
        navigate(`/bon-de-commandes/view/${id}`);
    };

    const addBonDeCommande = () => {
        navigate('/bon-de-commandes/_add');
    };

    const columns = [
        { field: 'numeroCommande', headerName: 'Numero Commande', flex: 1 },
        { field: 'dateCommande', headerName: 'Date Commande', type: 'date', flex: 1 },
        { field: 'client', headerName: 'Client', flex: 1 },
        { field: 'totalHT', headerName: 'Total HT', type: 'number', flex: 1 },
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
                            <IconButton aria-label="delete" size="small" onClick={() => deleteBonDeCommande(id)}>
                                <DeleteForeverIcon fontSize="inherit" />
                            </IconButton>
                        </Box> )}

                    <Box sx={{ background: colors.greenAccent[500], borderRadius: '10%', marginRight: '10px' }}>
                        <IconButton aria-label="view" size="small" onClick={() => viewBonDeCommande(id)}>
                            <VisibilityIcon fontSize="inherit" />
                        </IconButton>
                    </Box>
                </Box>
            ),
        },
    ];

    const rows = bonDeCommandes.map((bonDeCommande) => ({
        id: bonDeCommande.id,
        numeroCommande: bonDeCommande.numeroCommande,
        dateCommande: new Date(bonDeCommande.dateCommande),
        client: bonDeCommande.client,
        totalHT: bonDeCommande.totalHT,
    }));

    return (
        <Box m="20px">
            <Header title="BON DE COMMANDES" subtitle="All bon de commandes" />
            <Button
                onClick={addBonDeCommande}
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<AddIcon />}
                sx={{ marginRight: '10px' }}
            >
                Add
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

export default ListBonDeCommande;
