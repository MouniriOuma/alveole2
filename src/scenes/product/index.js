import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductService from '../../services/ProductService';
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
import {useState} from "react";
import UserService from "../../services/UserService";

function ListProducts() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    ProductService.getProducts().then((res) => {
      setProducts(res.data);
    })
        .catch((error) => {
            console.error('Error fetching suppliers:', error);
    });
  }, []);

  const navigate = useNavigate();


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


    const deleteProduct = (id) => {
    ProductService.deleteProduct(id)
      .then(() => {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.productId !== id)
        );
        window.location.reload();
      })
      .catch((error) => {
        // Handle the error here
        console.log('Error deleting product:', error);
      });
  };

  const viewProduct = (id) => {
    navigate(`/view-product/${id}`);
  };

  const editProduct = (id) => {
    navigate(`/edit-product/${id}`);
  };

  const addProduct = () => {
    navigate('/add-product/_add');
  };

  const columns = [
  // { field: 'productId', headerName: 'Product ID' },
    { field: 'productName', headerName: 'Nom Produit', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'quantity', headerName: 'Quantité' },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: ({ row: { productId } }) => (
          <Box
              width="60%"
              m="0 auto"
              p="5px"
              display="flex"
              justifyContent="center"
              borderRadius="4px"
          >
              {!isUser && (
              <Box sx={{ background: colors.blueAccent[700], borderRadius: '10%', marginRight: '10px' }}>
                  <IconButton aria-label="update" size="small" onClick={() => editProduct(productId)}>
                      <BorderColorIcon fontSize="inherit" />
                  </IconButton>
              </Box>)}
              {!isUser && (

              <Box sx={{ background: colors.redAccent[700], borderRadius: '10%', marginRight: '10px' }}>
                  <IconButton aria-label="delete" size="small" onClick={() => deleteProduct(productId)}>
                      <DeleteForeverIcon fontSize="inherit" />
                  </IconButton>
              </Box>)}

              <Box sx={{ background: colors.greenAccent[500], borderRadius: '10%', marginRight: '10px' }}>
                  <IconButton aria-label="view" size="small" onClick={() => viewProduct(productId)}>
                      <VisibilityIcon fontSize="inherit" />
                  </IconButton>
              </Box>
          </Box>

      ),
    },
  ];

  const rows = products.map((product) => ({
    id: product.productId,
    productId: product.productId,
    productName: product.productName,
    description: product.description,
    quantity: product.quantity,
  }));

  return (
    <Box m="20px">
      <Header title="PRODUCTS" subtitle="All products" />
      <Button
        onClick={() => addProduct()}
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

export default ListProducts;
