import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BillService from '../../services/BillService';
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


function ListBills() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [bills, setBills] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    BillService.getBills()
      .then((res) => {
        setBills(res.data);
      })
      .catch((error) => {
        console.log('Error retrieving bills:', error);
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



    const deleteBill = (billNumber) => {
    BillService.deleteBill(billNumber)
      .then(() => {
        setBills((prevBills) =>
          prevBills.filter((bill) => bill.billNumber !== billNumber)
        );
        window.location.reload();
      })
      .catch((error) => {
        console.log('Error deleting bill:', error);
      });
  };

  const viewBill = (id) => {
    navigate(`/view-bill/${id}`);
  };

  const editBill = (id) => {
    navigate(`/edit-bill/${id}`);
  };

  const addBill = () => {
    navigate('/add-bill/_add');
  };

  const columns = [
    { field: 'billNumber', headerName: 'Bill Number', flex: 1 },
    { field: 'amount', headerName: 'Amount', type: 'number', flex: 1 },
    { field: 'date', headerName: 'Date', type: 'date', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'supplier', headerName: 'Supplier', type: 'number', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: ({ row: { billNumber } }) => (
          <Box
              width="60%"
              m="0 auto"
              p="5px"
              display="flex"
              justifyContent="center"
              borderRadius="4px"
          > {!isUser && (
              <Box sx={{ background: colors.blueAccent[700], borderRadius: '10%', marginRight: '10px' }}>
                  <IconButton aria-label="update" size="small" onClick={() => editBill(billNumber)}>
                      <BorderColorIcon fontSize="inherit" />
                  </IconButton>
              </Box>)}

              {!isUser && (
              <Box sx={{ background: colors.redAccent[700], borderRadius: '10%', marginRight: '10px' }}>
                  <IconButton aria-label="delete" size="small" onClick={() => deleteBill(billNumber)}>
                      <DeleteForeverIcon fontSize="inherit" />
                  </IconButton>
              </Box> )}

              <Box sx={{ background: colors.greenAccent[500], borderRadius: '10%', marginRight: '10px' }}>
                  <IconButton aria-label="view" size="small" onClick={() => viewBill(billNumber)}>
                      <VisibilityIcon fontSize="inherit" />
                  </IconButton>
              </Box>
          </Box>

      ),
    },
  ];

  const rows = bills.map((bill) => ({
    id: bill.billNumber,
    billNumber: bill.billNumber,
    amount: bill.amount,
    date: new Date(bill.date),
    status: bill.status,
    supplier: bill.supplier.businessName || `${bill.supplier.firstName} ${bill.supplier.lastName}`,
  }));

  return (
    <Box m="20px">
      <Header title="BILLS" subtitle="All bills" />
      <Button
        onClick={addBill}
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

export default ListBills;
