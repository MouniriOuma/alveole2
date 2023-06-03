import { Box, Button, TextField, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../scenes/base/Header";
import UserService from '../services/UserService';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UserForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
  
    const { id } = useParams();
    const navigate = useNavigate();
  
    useEffect(() => {
      if (id === '_add') {
        return;
      } else {
        UserService.getUserById(id).then((res) => {
          let user = res.data;
          setUsername(user.username);
          setPassword(user.password);
          setUserType(user.user_type);
        });
      }
    }, [id]);
  
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
  
    const initialValues = {
      username,
      password,
      user_type: userType,
    };
  
    const updateValues = {
      username,
      password,
      user_type: userType,
    };
  
    const handleFormSubmit = (values) => {
      console.log(values);
      saveOrUpdateUser(values);
    };
  
    const saveOrUpdateUser = (values) => {
      // Get the values from the form
      const username = values.username;
      const password = values.password;
      const user_type = values.user_type;
  
      // Create a new user object
      const user = {
        username,
        password,
        user_type,
      };
  
      console.log('user => ' + JSON.stringify(user));
  
      if (id === '_add') {
        UserService.createUser(user).then((res) => {
          navigate('/users');
        });
      } else {
        UserService.updateUser(user, id).then((res) => {
          navigate('/users');
        });
      }
    };
  
    const cancel = () => {
      navigate('/users');
    };
  
    const getTitle = () => {
      if (id === '_add') {
        return <span className="text-center">Add User</span>;
      } else {
        return <span className="text-center">Update User</span>;
      }
    };
  
    const getSubTitle = () => {
      if (id === '_add') {
        return <span className="text-center">Add a new user</span>;
      } else {
        return <span className="text-center">Update your User</span>;
      }
    };
  
    const [formValues, setFormValues] = useState(null);
  
    return (
      <Box m="20px">
        <Header title={getTitle()} subtitle={getSubTitle()} />
  
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={formValues || initialValues}
          validationSchema={checkoutSchema}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  name="username"
                  error={!!touched.username && !!errors.username}
                  helperText={touched.username && errors.username}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  label="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 2" }}
                />
                <FormControl
                  fullWidth
                  variant="filled"
                  error={!!touched.user_type && !!errors.user_type}
                  sx={{ gridColumn: "span 4" }}
                >
                  <InputLabel>User Type</InputLabel>
                  <Select
                    value={values.user_type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="user_type"
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                  </Select>
                  {touched.user_type && errors.user_type && (
                    <FormHelperText>{errors.user_type}</FormHelperText>
                  )}
                </FormControl>
              </Box>
  
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained" onClick={handleFormSubmit}>
                  Save
                </Button>
                <Button onClick={cancel} color="error" variant="contained" style={{ marginLeft: '10px' }}>
                  Cancel
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    );
  };
  
  const checkoutSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    user_type: yup.string().required("User type is required"),
  });
  
  export default UserForm;
  