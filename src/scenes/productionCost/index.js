import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductionCostService from '../../services/ProductionCostService';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../base/Header";
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';

function ListProdCost() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [productionCosts, setProductionCosts] = React.useState([]);

    React.useEffect(() => {
        ProductionCostService.getProductionCosts().then((res) => {
            setProductionCosts(res.data);
        });
    }, []);

    const navigate = useNavigate();

    const deleteProductionCost = (id) => {
        ProductionCostService.deleteProductionCost(id)
            .then(() => {
                setProductionCosts((prevCosts) =>
                    prevCosts.filter((cost) => cost.id !== id)
                );
                window.location.reload();
            })
            .catch((error) => {
                // Handle the error here
                console.log('Error deleting production cost:', error);
            });
    };

    const viewProductionCost = (id) => {
        navigate(`/view-production-cost/${id}`);
    };

    const editProductionCost = (id) => {
        navigate(`/edit-production-cost/${id}`);
    };

    const addProductionCost = () => {
        navigate('/add-production-cost');
    };

    const columns = [
        { field: 'id', headerName: 'ID' },
        { field: 'cost', headerName: 'Cost', flex: 1 },
        { field: 'date', headerName: 'Date', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1.5,
            renderCell: ({ row: { id } }) => (
                <Box
                    width="60%"
                    m="0 auto"
                    p="5px"
                    display="flex"
                    justifyContent="center"
                    borderRadius="4px"
                >
                    <Button
                        onClick={() => editProductionCost(id)}
                        variant="contained"
                        color="primary"
                        startIcon={<BrowserUpdatedIcon />}
                        sx={{ marginRight: '10px' }}
                    >
                        Update
                    </Button>
                    <Button
                        onClick={() => deleteProductionCost(id)}
                        variant="contained"
                        color="error"
                        startIcon={<DeleteForeverIcon />}
                        sx={{ marginRight: '10px' }}
                    >
                        Delete
                    </Button>
                    <Button
                        onClick={() => viewProductionCost(id)}
                        variant="contained"
                        color="primary"
                        startIcon={<VisibilityIcon />}
                        sx={{ marginRight: '10px' }}
                    >
                        View
                    </Button>
                </Box>
            ),
        },
    ];

    const rows = productionCosts.map((cost) => ({
        id: cost.id,
        cost: cost.cost,
        date: cost.date,
    }));

    return (
        <Box m="20px">
            <Header title="PRODUCTION COSTS" subtitle="All production costs" />
            <Button
                onClick={() => addProductionCost()}
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