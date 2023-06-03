import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IngredientService from '../../services/IngredientService';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../base/Header";
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';

function ListIngredients() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [ingredients, setIngredients] = React.useState([]);
    const navigate = useNavigate();

  React.useEffect(() => {
    IngredientService.getIngredients().then((res) => {
      setIngredients(res.data);
    });
  }, []);

  const deleteIngredient = (id) => {
    IngredientService.deleteIngredient(id)
      .then(() => {
        setIngredients((prevIngredients) =>
          prevIngredients.filter((ingredient) => ingredient.ingredient_id !== id)
        );
        window.location.reload();
      })
      .catch((error) => {
        console.log('Error deleting ingredient:', error);
      });
  };

  const editIngredient = (id) => {
    navigate(`/edit-ingredient/${id}`);
  };

  const viewIngredient = (id) => {
    navigate(`/view-ingredient/${id}`);
  };

  const addIngredient = () => {
    navigate('/add-ingredient/_add');
  };

  const columns = [
    { field: 'ingredient_id', headerName: 'ID'},
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'unit_of_measurement', headerName: 'Unit of Measurement' },
    { field: 'stock_quantity', headerName: 'Stock Quantity', type: 'number', flex: 1 },
    { field: 'unit_price', headerName: 'Unit Price', type: 'number'},
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.5,
      renderCell: ({ row: { ingredient_id } }) => (
        <Box
          width="60%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          borderRadius="4px"
        >
          <Button
            onClick={() => editIngredient(ingredient_id)}
            variant="contained"
            color="primary"
            startIcon={<BrowserUpdatedIcon />}
            sx={{ marginRight: '10px' }}
          >
            Update
          </Button>
          <Button
            onClick={() => deleteIngredient(ingredient_id)}
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            sx={{ marginRight: '10px' }}
          >
            Delete
          </Button>
          <Button
            onClick={() => viewIngredient(ingredient_id)}
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

  const rows = ingredients.map((ingredient) => ({
    id: ingredient.ingredient_id,
    ingredient_id: ingredient.ingredient_id,
    name: ingredient.name,
    description: ingredient.description,
    unit_of_measurement: ingredient.unit_of_measurement,
    stock_quantity: ingredient.stock_quantity,
    unit_price: ingredient.unit_price,
  }));

  return (
    <Box m="20px">
      <Header title="INGREDIENTS" subtitle="All ingredients" />
      <Button 
        onClick={() => addIngredient()} 
        variant="contained" 
        color="secondary" 
        size="large" 
        startIcon={<AddIcon />} 
        sx={{ marginBottom: '10px' }}
        >
        Add Ingredient
      </Button>
      <Box
        m="40px 0 0 0"
        height="75vh"
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
      <DataGrid rows={rows} columns={columns} checkboxSelection />
    </Box>
    </Box>
  );
}

export default ListIngredients;
