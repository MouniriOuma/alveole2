import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BillService from '../../services/BillService';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../base/Header";
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';


function ListBills() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [bills, setBills] = React.useState([]);

  React.useEffect(() => {
    BillService.getBills()
      .then((res) => {
        setBills(res.data);
      })
      .catch((error) => {
        console.log('Error retrieving bills:', error);
      });
  }, []);

  const navigate = useNavigate();

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

  const viewBill = (billNumber) => {
    navigate(`/view-bill/${billNumber}`);
  };

  const editBill = (billNumber) => {
    navigate(`/edit-bill/${billNumber}`);
  };

  const addBill = () => {
    navigate('/add-bill/_add');
  };

  const columns = [
    { field: 'billNumber', headerName: 'Bill Number', flex: 1 },
    { field: 'amount', headerName: 'Amount', type: 'number', flex: 1 },
    { field: 'date', headerName: 'Date', type: 'date', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'supplierId', headerName: 'Supplier ID', type: 'number', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.5,
      renderCell: ({ row: { billNumber } }) => (
        <Box
          width="60%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          borderRadius="4px"
        >
          <Button
            onClick={() => editBill(billNumber)}
            variant="contained"
            color="primary"
            startIcon={<BrowserUpdatedIcon />}
            sx={{ marginRight: '10px' }}
          >
            Update
          </Button>
          <Button
            onClick={() => deleteBill(billNumber)}
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            sx={{ marginRight: '10px' }}
          >
            Delete
          </Button>
          <Button
            onClick={() => viewBill(billNumber)}
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

  const rows = bills.map((bill) => ({
    id: bill.billNumber,
    billNumber: bill.billNumber,
    amount: bill.amount,
    date: new Date(bill.date),
    status: bill.status,
    supplierId: bill.supplier.supplierId,
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
        <DataGrid checkboxSelection rows={rows} columns={columns} />
      </Box>
    </Box>
  );
}

export default ListBills;
