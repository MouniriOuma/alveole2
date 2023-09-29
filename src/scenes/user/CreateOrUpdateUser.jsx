import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from '../base/Header';
import UserService from '../../services/UserService';
import { useNavigate, useParams } from 'react-router-dom';

const UserForm = () => {
    const isNonMobile = useMediaQuery('(min-width:600px)');

    const { id } = useParams();

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        if (id !== '_add') {
            // Fetch user details if not adding a new user
            UserService.getUserById(id)
                .then((response) => {
                    const user = response.data;
                    setUsername(user.username);
                    setPassword('');
                    setEmail(user.email);
                    setRoles(user.roles.map(role => {
                        if (role.name === 'ROLE_ADMIN') {
                            return 'admin';
                        } else if (role.name === 'ROLE_USER') {
                            return 'user';
                        } else {
                            return role.name;
                        }
                    }));
                })
                .catch((error) => {
                    console.error('Error fetching user:', error);
                });
        }
    }, [id]);

    const handleFormSubmit = (values) => {
        if (!values.roles || values.roles.length === 0) {
            return; // Prevent submitting if roles array is empty or undefined
        }

        if (id === '_add') {
            createUser(values);
        } else {
            updateUser(values);
        }
    };

    const createUser = (values) => {
        const { username, password, email, roles } = values;

        const user = {
            username,
            password,
            email,
            role: roles,
        };



        UserService.registerUser(user)
            .then(() => {
                navigate('/users');
            })
            .catch((error) => {
                console.error('Error creating user:', error);
            });
    };

    const updateUser = (values) => {
        const { username, password, email, roles } = values;

        const user = {
            username,
            email,
            password,
            role: roles,
        };



        UserService.updateUser(id, user)
            .then(() => {
                navigate('/users');
            })
            .catch((error) => {
                console.error('Error updating user:', error);
            });
    };


    const cancel = () => {
        navigate('/users');
    };

    const getTitle = () => {
        if (id === '_add') {
            return <span className="text-center">Ajouter un utilisateur</span>;
        } else {
            return <span className="text-center">Metter à jour un utilisateur</span>;
        }
    };

    const getSubTitle = () => {
        if (id === '_add') {
            return <span className="text-center">Ajouter un nouveau utilisateur</span>;
        } else {
            return <span className="text-center">Metter à jour / changer le mot de pass pour ce utilisateur</span>;
        }
    };

    return (
        <Box m="20px">
            <Header title={getTitle()} subtitle={getSubTitle()} />

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={{
                    username,
                    password,
                    email,
                    roles,
                }}
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
                                '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
                            }}
                        >
                            <FormControl
                                fullWidth
                                variant="filled"
                                error={!!touched.roles && !!errors.roles}
                                sx={{ gridColumn: 'span 4' }}
                            >
                                <InputLabel>Roles d'utilisateur</InputLabel>
                                <Select
                                    multiple
                                    value={roles}
                                    onChange={(event) => setRoles(event.target.value)}
                                    onBlur={handleBlur}
                                    name="roles"
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    <MenuItem value="admin">Admin</MenuItem>
                                    <MenuItem value="user">User</MenuItem>
                                </Select>
                                {touched.roles && errors.roles && (
                                    <FormHelperText>{errors.roles}</FormHelperText>
                                )}
                            </FormControl>
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
                                sx={{ gridColumn: 'span 2' }}
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
                                sx={{ gridColumn: 'span 2' }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="email"
                                label="Email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                name="email"
                                error={!!touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                                sx={{ gridColumn: 'span 4' }}
                            />
                        </Box>

                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                Sauvegarder
                            </Button>
                            <Button onClick={cancel} color="error" variant="contained" style={{ marginLeft: '10px' }}>
                                Annuler
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

const checkoutSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    roles: yup.array().min(1, 'User roles are required').required('User roles are required'),
});

export default UserForm;


