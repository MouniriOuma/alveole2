import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClientService from '../../services/ClientService';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../base/Header";
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';

function ListClients() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [clients, setClients] = React.useState([]);

    React.useEffect(() => {
        ClientService.getClients().then((res) => {
            setClients(res.data);
          })
          .catch((error) => {
            console.log('Error retrieving client:', error);
        });
    }, []);

    const navigate = useNavigate();

    const deleteClient = (id) => {
        ClientService.deleteClient(id)
          .then(() => {
            setClients((prevClients) =>
              prevClients.filter((client) => client.ICE !== id)
              
            );
            window.location.reload();
          })
          .catch((error) => {
            // Handle the error here
            console.log('Error deleting client:', error);
            
          });
      };
      
      
    const viewClient = (id) => {
        navigate(`/view-client/${id}`);
    };

    const editClient = (id) => {
        navigate(`/edit-client/${id}`);
    };

    const addClient = () => {
        navigate('/add-client/_add');
    };



const columns = [
  { field: 'ice', headerName: 'ICE' },
  { field: 'raisonSocial', headerName: 'Raison Sociale' ,flex: 1},
  { field: 'adresse', headerName: 'Adresse',flex: 1},
  { field: 'contact', headerName: 'Contact', type: "number"},
  { field: 'adresseEmail', headerName: 'Adresse Email',flex: 1 },
  {
  field: 'actions',
  headerName: 'Actions',
  flex: 1.5,
  renderCell: ({ row: { ice } }) => (
    <Box
      width="60%"
      m="0 auto"
      p="5px"
      display="flex"
      justifyContent="center"
      borderRadius="4px"
    >
      {/* 
      <IconButton aria-label="delete" size="small">
      <DeleteIcon fontSize="inherit" />
      </IconButton>
      */}
      <Button
        onClick={() => editClient(ice)}
        variant="contained"
        color="primary"
        startIcon={<BrowserUpdatedIcon />}
        sx={{ marginRight: '10px' }}
      >
        Update
      </Button>
      <Button
        onClick={() => deleteClient(ice)}
        variant="contained"
        color="error"
        startIcon={<DeleteForeverIcon />}
        sx={{ marginRight: '10px' }}
      >
        Delete
      </Button>
      <Button
        onClick={() => viewClient(ice)}
        variant="contained"
        color="primary"
        startIcon={<VisibilityIcon />}
        sx={{ marginRight: '10px' }}     
      >
        View
      </Button>
    </Box>
  ),
}

];

const rows = clients.map((client) => ({
    id: client.ice,
    ice: client.ice,
    raisonSocial: client.raisonSocial,
    adresse: client.adresse,
    contact: client.contact,
    adresseEmail: client.adresseEmail,
  }));

  return (
    <Box m="20px">
      <Header title="CLIENTS" subtitle="All clients" />
      <Button
        onClick={() => addClient()}
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
};


export default ListClients;