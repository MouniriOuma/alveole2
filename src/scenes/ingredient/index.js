import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IngredientService from '../../services/IngredientService';
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


    const deleteIngredient = (id) => {
    IngredientService.deleteIngredient(id)
      .then(() => {
        setIngredients((prevIngredients) =>
          prevIngredients.filter((ingredient) => ingredient.ingredientId !== id)
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
   // { field: 'ingredientId', headerName: 'ID'},
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'stockQuantity', headerName: 'Stock Quantity', type: 'number', flex: 1 },
    { field: 'unitOfMeasurement', headerName: 'Unit of Measurement', flex: 1  },
    { field: 'unitPrice', headerName: 'Unit Price', type: 'number', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'supplier', headerName: 'Supplier', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: ({ row: {ingredientId } }) => (
          <Box
              width="60%"
              m="0 auto"
              p="5px"
              display="flex"
              justifyContent="center"
              borderRadius="4px"
          > {!isUser && (
              <Box sx={{ background: colors.blueAccent[700], borderRadius: '10%', marginRight: '10px' }}>
                  <IconButton aria-label="update" size="small" onClick={() => editIngredient(ingredientId)}>
                      <BorderColorIcon fontSize="inherit" />
                  </IconButton>
              </Box>)}

              {!isUser && (
              <Box sx={{ background: colors.redAccent[700], borderRadius: '10%', marginRight: '10px' }}>
                  <IconButton aria-label="delete" size="small" onClick={() => deleteIngredient(ingredientId)}>
                      <DeleteForeverIcon fontSize="inherit" />
                  </IconButton>
              </Box>)}

              <Box sx={{ background: colors.greenAccent[500], borderRadius: '10%', marginRight: '10px' }}>
                  <IconButton aria-label="view" size="small" onClick={() => viewIngredient(ingredientId)}>
                      <VisibilityIcon fontSize="inherit" />
                  </IconButton>
              </Box>
          </Box>

      ),
    },
  ];

    const rows = ingredients.map((ingredient) => ({
        id: ingredient.ingredientId,
        ingredientId: ingredient.ingredientId,
        name: ingredient.name,
        description: ingredient.description,
        unitOfMeasurement: ingredient.unitOfMeasurement,
        stockQuantity: ingredient.stockQuantity,
        unitPrice: ingredient.unitPrice,
        supplier: ingredient.supplier.businessName || `${ingredient.supplier.firstName} ${ingredient.supplier.lastName}`,
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
      <DataGrid rows={rows} columns={columns} checkboxSelection />
    </Box>
    </Box>
  );
}

export default ListIngredients;
