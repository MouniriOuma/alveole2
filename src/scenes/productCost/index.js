import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCostService from '../../services/ProductCostService';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../base/Header";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import UserService from "../../services/UserService";

function ListProdCost() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [productCosts, setProductCosts] = React.useState([]);

    React.useEffect(() => {
        ProductCostService.getProductCosts().then((res) => {
            setProductCosts(res.data);
        });
    }, []);


    //define the role
    const username = localStorage.getItem('username');
    const [role, setRole] = React.useState('');

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


    const navigate = useNavigate();

    const deleteProductCost = (id) => {
        ProductCostService.deleteProductCost(id)
            .then(() => {
                setProductCosts((prevCosts) =>
                    prevCosts.filter((cost) => cost.id !== id)
                );
                window.location.reload();
            })
            .catch((error) => {
                // Handle the error here
                console.log('Error deleting Product cost:', error);
            });
    };

    const viewProductCost = (id) => {
        navigate(`/view-product-cost/${id}`);
    };

    const addProductCost = () => {
        navigate('/add-product-cost');
    };

    const columns = [
        { field: 'productName', headerName: 'Nom produit', flex: 1 },
        { field: 'date', headerName: 'Date', flex: 1 },
        { field: 'cost', headerName: 'Coût', flex: 1 },
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
                    <Box sx={{ background: colors.greenAccent[500], borderRadius: '10%', marginRight: '10px' }}>
                        <IconButton aria-label="view" size="small" onClick={() => viewProductCost(id)}>
                            <VisibilityIcon fontSize="inherit" />
                        </IconButton>
                    </Box>

                    {!isUser && (

                    <Box sx={{ background: colors.redAccent[700], borderRadius: '10%', marginRight: '10px' }}>
                        <IconButton aria-label="delete" size="small" onClick={() => deleteProductCost(id)}>
                            <DeleteForeverIcon fontSize="inherit" />
                        </IconButton>
                    </Box>)}

                </Box>

            ),
        },
    ];

    const rows = productCosts.map((cost) => ({
        id: cost.id,
        productName: cost.productName,
        cost: cost.cost,
        date: cost.date,
    }));

    return (
        <Box m="20px">
            <Header title="PRODUCT COSTS" subtitle="All product costs" />
            <Button
                onClick={() => addProductCost()}
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


export default ListProdCost;