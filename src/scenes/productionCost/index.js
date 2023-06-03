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

function ProdFees() {
    const navigate = useNavigate();
    const addData = () => {
        navigate('/add-prod-cost/_add');
    };
    return (
        <Box m="20px">
          <Header title="prod cost" subtitle="All " />
          <Button
            onClick={() => addData()}
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<AddIcon />}
            sx={{ marginRight: '10px' }}  
          >
            enter data
          </Button>
          </Box>
  );
};


export default ProdFees;