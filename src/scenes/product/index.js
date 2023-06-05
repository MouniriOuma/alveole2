import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../base/Header";
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';

function ListProducts() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    ProductService.getProducts().then((res) => {
      setProducts(res.data);
    });
  }, []);

  const navigate = useNavigate();

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
    { field: 'productId', headerName: 'Product ID' },
    { field: 'productName', headerName: 'Product Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'quantity', headerName: 'Quantity' },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.5,
      renderCell: ({ row: { productId } }) => (
        <Box
          width="60%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          borderRadius="4px"
        >
          <Button
            onClick={() => editProduct(productId)}
            variant="contained"
            color="primary"
            startIcon={<BrowserUpdatedIcon />}
            sx={{ marginRight: '10px' }}
          >
            Update
          </Button>
          <Button
            onClick={() => deleteProduct(productId)}
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            sx={{ marginRight: '10px' }}
          >
            Delete
          </Button>
          <Button
            onClick={() => viewProduct(productId)}
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

export default ListProducts;
