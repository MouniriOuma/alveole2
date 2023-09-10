import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SupplierService from '../../services/SupplierService';
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
import {useEffect, useState} from "react";
import UserService from "../../services/UserService";



function ListSuppliers() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  const [suppliers, setSuppliers] = React.useState([]);


    React.useEffect(() => {
        SupplierService.getSuppliers()
            .then((res) => {
                setSuppliers(res.data);
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


  const deleteSupplier = (id) => {
    SupplierService.deleteSupplier(id)
      .then(() => {
        setSuppliers((prevSuppliers) =>
          prevSuppliers.filter((supplier) => supplier.supplierId !== id)
        );
        window.location.reload();
      })
      .catch((error) => {
        // Handle the error here
        console.log('Error deleting supplier:', error);
      });
  };

  const viewSupplier = (id) => {
    navigate(`/view-supplier/${id}`);
  };

  const editSupplier = (id) => {
    navigate(`/edit-supplier/${id}`);
  };

  const addSupplier = () => {
    navigate('/add-supplier/_add');
  };

  const columns = [
    //{ field: 'supplierId', headerName: 'Supplier ID' },
    { field: 'businessName', headerName: 'Business Name', flex: 1 },
    { field: 'ice', headerName: 'ICE' },
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'cin', headerName: 'CIN', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'contact', headerName: 'Contact', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'suppliedProduct', headerName: 'Supplied Product', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: ({ row: {supplierId} }) => (
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
                  <IconButton aria-label="update" size="small" onClick={() => editSupplier(supplierId)}>
                      <BorderColorIcon fontSize="inherit" />
                  </IconButton>
              </Box>)}
              {!isUser && (
              <Box sx={{ background: colors.redAccent[700], borderRadius: '10%', marginRight: '10px' }}>
                  <IconButton aria-label="delete" size="small" onClick={() => deleteSupplier(supplierId)}>
                      <DeleteForeverIcon fontSize="inherit" />
                  </IconButton>
              </Box>)}

              <Box sx={{ background: colors.greenAccent[500], borderRadius: '10%', marginRight: '10px' }}>
                  <IconButton aria-label="view" size="small" onClick={() => viewSupplier(supplierId)}>
                      <VisibilityIcon fontSize="inherit" />
                  </IconButton>
              </Box>
          </Box>
      ),
    },
  ];

    const rows = suppliers.map((supplier) => ({
        id: supplier.supplierId,
        supplierId: supplier.supplierId,
        address: supplier.address,
        contact: supplier.contact,
        email: supplier.email,
        suppliedProduct: supplier.suppliedProduct,
        cin: supplier.cin !== 0 ? supplier.cin : ' ',
        firstName: supplier.firstName,
        lastName: supplier.lastName,
        ice: supplier.ice !== 0 ? supplier.ice : ' ',
        businessName: supplier.businessName,
    }));

    return (
    <Box m="20px">
      <Header title="SUPPLIERS" subtitle="All suppliers" />
      <Button
        onClick={() => addSupplier()}
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

export default ListSuppliers;
