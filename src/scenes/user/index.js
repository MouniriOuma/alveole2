import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../base/Header";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import UserService from '../../services/UserService'
import IconButton from "@mui/material/IconButton";

function ListUsers() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    UserService.getUsers().then((res) => {
      setUsers(res.data);
      console.log("data : ", res.data);
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
    // { field: 'id', headerName: 'ID' },
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'roles', headerName: 'User role', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: ({ row: { id } }) => (
          <Box
              width="60%"
              m="0 auto"
              p="5px"
              display="flex"
              justifyContent="center"
              borderRadius="4px"
          >
            <Box sx={{ background: colors.blueAccent[700], borderRadius: '10%', marginRight: '10px' }}>
              <IconButton aria-label="update" size="small" onClick={() => editUser(id)}>
                <BorderColorIcon fontSize="inherit" />
              </IconButton>
            </Box>

            <Box sx={{ background: colors.redAccent[700], borderRadius: '10%', marginRight: '10px' }}>
              <IconButton aria-label="delete" size="small" onClick={() => deleteUser(id)}>
                <DeleteForeverIcon fontSize="inherit" />
              </IconButton>
            </Box>

            <Box sx={{ background: colors.greenAccent[500], borderRadius: '10%', marginRight: '10px' }}>
              <IconButton aria-label="view" size="small" onClick={() => viewUser(id)}>
                <VisibilityIcon fontSize="inherit" />
              </IconButton>
            </Box>
          </Box>
      ),
    },
  ];

  const rows = users.map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles.map(role => role.name).join(" "),
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

export default ListUsers;
