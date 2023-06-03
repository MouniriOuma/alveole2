import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../base/Header";
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import UserService from '../../services/UserService'

function ListUsers() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    UserService.getUsers().then((res) => {
      setUsers(res.data);
    });
  }, []);

  const navigate = useNavigate();

  const deleteUser = (id) => {
    UserService.deleteUser(id)
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        window.location.reload();
      })
      .catch((error) => {
        // Handle the error here
        console.log('Error deleting user:', error);
      });
  };

  const viewUser = (id) => {
    navigate(`/view-user/${id}`);
  };

  const editUser = (id) => {
    navigate(`/edit-user/${id}`);
  };

  const addUser = () => {
    navigate('/add-user/_add');
  };

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'password', headerName: 'Password', flex: 1 },
    { field: 'user_type', headerName: 'User Type', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.5,
      renderCell: ({ row: { id } }) => (
        <Box
          width="60%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          borderRadius="4px"
        >
          <Button
            onClick={() => editUser(id)}
            variant="contained"
            color="primary"
            startIcon={<BrowserUpdatedIcon />}
            sx={{ marginRight: '10px' }}
          >
            Update
          </Button>
          <Button
            onClick={() => deleteUser(id)}
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            sx={{ marginRight: '10px' }}
          >
            Delete
          </Button>
          <Button
            onClick={() => viewUser(id)}
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

  const rows = users.map((user) => ({
    id: user.id,
    username: user.username,
    password: user.password,
    user_type: user.user_type,
  }));

  return (
    <Box m="20px">
    <Header title="USERS" subtitle="All users" />
    <Button
      onClick={() => addUser()}
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

export default ListUsers;
