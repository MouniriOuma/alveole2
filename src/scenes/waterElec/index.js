import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WaterElecService from '../../services/WaterElecService';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../base/Header";
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';

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
    { field: 'bill_Num', headerName: 'Bill Number', flex: 1 },
    { field: 'cost', headerName: 'Cost', type: 'number', flex: 1 },
    { field: 'water_elec', headerName: 'Water/Electricity', flex: 1 },
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
        >
          <Button
            onClick={() => editWaterElec(bill_Num)}
            variant="contained"
            color="primary"
            startIcon={<BrowserUpdatedIcon />}
            sx={{ marginRight: '10px' }}
          >
            Update
          </Button>
          <Button
            onClick={() => deleteWaterElec(bill_Num)}
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            sx={{ marginRight: '10px' }}
          >
            Delete
          </Button>
          <Button
            onClick={() => viewWaterElec(bill_Num)}
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

  const rows = waterElec.map((bill, index) => ({
      id: index + 1,
    bill_Num: bill.bill_Num,
    cost: bill.cost,
    water_elec: bill.water_elec,
    date: new Date(bill.date),
  }));

  return (
    <Box m="20px">
      <Header title="WATER/ELECTRICITY BILLS" subtitle="All bills" />
      <Button
        onClick={() => addWaterElec()}
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

export default ListWaterElec;
