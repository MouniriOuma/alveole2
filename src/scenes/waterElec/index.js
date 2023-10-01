import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WaterElecService from '../../services/WaterElecService';
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

function ListWaterElec() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [waterElec, setWaterElec] = React.useState([]);

  React.useEffect(() => {
    WaterElecService.getWaterElec()
      .then((res) => {
        setWaterElec(res.data);

      })
      .catch((error) => {
        console.log('Error retrieving water/electricity bills:', error);
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

  const deleteWaterElec = (id) => {
    WaterElecService.deleteWaterElec(id)
      .then(() => {
        setWaterElec((prevWaterElec) =>
          prevWaterElec.filter((bill) => bill.bill_Num !== id)
        );
        window.location.reload();
      })
      .catch((error) => {
        console.log('Error deleting water/electricity bill:', error);
      });
  };

  const viewWaterElec = (id) => {
    navigate(`/view-waterElecs/${id}`);
  };

  const editWaterElec = (id) => {
    navigate(`/edit-waterElecs/${id}`);
  };

  const addWaterElec = () => {
    navigate('/add-waterElecs/_add');
  };

  const columns = [
    { field: 'bill_Num', headerName: 'N facture', flex: 1 },
    { field: 'cost', headerName: 'Coùt', type: 'number', flex: 1 },
    { field: 'water_elec', headerName: 'Eau/Electricité', flex: 1 },
    { field: 'date', headerName: 'Date', type: 'date', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.5,
      renderCell: ({ row: { bill_Num } }) => (
          <Box
              width="60%"
              m="0 auto"
              p="5px"
              display="flex"
              justifyContent="center"
              borderRadius="4px"
          > {!isUser && (
              <Box sx={{ background: colors.blueAccent[700], borderRadius: '10%', marginRight: '10px' }}>
                  <IconButton aria-label="update" size="small" onClick={() => editWaterElec(bill_Num)}>
                      <BorderColorIcon fontSize="inherit" />
                  </IconButton>
              </Box>)}

              {!isUser && (
              <Box sx={{ background: colors.redAccent[700], borderRadius: '10%', marginRight: '10px' }}>
                  <IconButton aria-label="delete" size="small" onClick={() => deleteWaterElec(bill_Num)}>
                      <DeleteForeverIcon fontSize="inherit" />
                  </IconButton>
              </Box>)}

              <Box sx={{ background: colors.greenAccent[500], borderRadius: '10%', marginRight: '10px' }}>
                  <IconButton aria-label="view" size="small" onClick={() => viewWaterElec(bill_Num)}>
                      <VisibilityIcon fontSize="inherit" />
                  </IconButton>
              </Box>
          </Box>

      ),
    },
  ];

  const rows = waterElec.map((bill, index) => ({
      id: index + 1,
    bill_Num: bill.bill_Num,
    cost: bill.cost,
    water_elec: bill.water_elec,
    date: new Date(bill.date),
  }));

  return (
    <Box m="20px">
      <Header title="FACTURE D'EAU/ELECTRICITE" subtitle="Toutes les factures" />
      <Button
        onClick={() => addWaterElec()}
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

export default ListWaterElec;
