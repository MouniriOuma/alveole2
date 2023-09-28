import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, MenuItem, InputAdornment } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../base/Header";
import BillService from '../../services/BillService';
import SupplierService from '../../services/SupplierService';
import { parseISO, formatISO } from 'date-fns';

const BillForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const { id } = useParams();
    const navigate = useNavigate();

    const [supplierList, setSupplierList] = useState([]);

    useEffect(() => {
        SupplierService.getSuppliers()
            .then((res) => {
                setSupplierList(res.data);
            })
            .catch((error) => {

            });

        if (id === '_add') {
            return;
        } else {
            BillService.getBillById(id).then((res) => {
                let bill = res.data;
                setBillNumber(bill.billNumber);
                setSupplierId(bill.supplier.supplierId);
                setDate(bill.date);
                setAmount(bill.amount);
                setStatus(bill.status);
            });
        }
    }, [id]);

    const [billNumber, setBillNumber] = useState('');
    const [supplierId, setSupplierId] = useState(0);
    const [date, setDate] = useState('2023-01-01');
    const [amount, setAmount] = useState(0);
    const [status, setStatus] = useState('');

    const initialValues = {
        billNumber,
        supplierId,
        date,
        amount,
        status,
    };

    const handleFormSubmit = (values) => {

        saveOrUpdateBill(values);
    };

    const saveOrUpdateBill = (values) => {
        const { billNumber, supplierId, date, amount, status } = values;

        if (
            billNumber === '' &&
            supplierId === 0 &&
            date === '2023-01-01' &&
            amount === 0 &&
            status === ''
        ) {
            console.log('All values are empty, skipping saveOrUpdateBill');
            return;
        }

        SupplierService.getSupplierById(supplierId)
            .then((supplierResponse) => {
                const supplier = supplierResponse.data;

                const bill = {
                    billNumber,
                    supplier: {
                        supplierId,
                        address: supplier.address || '',
                        contact: supplier.contact || '',
                        email: supplier.email || '',
                        suppliedProduct: supplier.suppliedProduct || null,
                        cin: supplier.cin || '',
                        firstName: supplier.firstName || '',
                        lastName: supplier.lastName || '',
                        ice: supplier.ice || 0,
                        businessName: supplier.businessName || ''
                    },
                    date,
                    amount,
                    status
                };

                if (id === '_add') {
                    BillService.createBill(bill)
                        .then(() => {
                            navigate('/bills');
                        })
                        .catch((error) => {
                            console.log('Error creating bill:', error);
                        });
                } else {
                    BillService.updateBill(bill, id)
                        .then(() => {
                            navigate('/bills');
                        })
                        .catch((error) => {
                            console.log('Error updating bill:', error);
                        });
                }
            })
            .catch((error) => {
                console.log('Error fetching supplier:', error);
            });
    };

    const cancel = () => {
        navigate('/bills');
    };

    const getTitle = () => {
        if (id === '_add') {
            return <span className="text-center">Ajouter une facture </span>;
        } else {
            return <span className="text-center">Metter à jour une facture</span>;
        }
    };

    const getSubTitle = () => {
        if (id === '_add') {
            return <span className="text-center">Ajouter une nouvelle facture</span>;
        } else {
            return <span className="text-center">Metter à jour une facture</span>;
        }
    };

    const checkoutSchema = yup.object().shape({
        amount: yup.number().required('Required'),
        date: yup.date().required('Required'),
        status: yup.string().required('Required'),
        supplierId: yup.number().required('Required'),
    });

    const supplierOptions = supplierList.map((supplier) => (
        <MenuItem key={supplier.supplierId} value={supplier.supplierId}>
            {supplier.businessName ? supplier.businessName : `${supplier.firstName} ${supplier.lastName}`}
        </MenuItem>
    ));

    return (
        <Box m="20px">
            <Header title={getTitle()} subtitle={getSubTitle()} />

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
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
                      setFieldValue,
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
                                label="N facture"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.billNumber}
                                name="billNumber"
                                error={touched.billNumber && !!errors.billNumber}
                                helperText={touched.billNumber && errors.billNumber}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="number"
                                label="Montant"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.amount || ""}
                                name="amount"
                                error={touched.amount && !!errors.amount}
                                helperText={touched.amount && errors.amount}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="date"
                                label="Date"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.date ? formatISO(parseISO(values.date), { representation: 'date' }) : ''}
                                name="date"
                                error={touched.date && !!errors.date}
                                helperText={touched.date && errors.date}
                                sx={{ gridColumn: 'span 2' }}
                                inputProps={{
                                    max: formatISO(new Date(), { representation: 'date' }),
                                }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                select
                                label="Status"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.status || ""}
                                name="status"
                                error={touched.status && !!errors.status}
                                helperText={touched.status && errors.status}
                                sx={{ gridColumn: "span 2" }}
                            >
                                <MenuItem value="PENDING">PENDING</MenuItem>
                                <MenuItem value="PAID">PAID</MenuItem>
                            </TextField>

                            {/* here the supplier text field */}

                            <TextField
                                fullWidth
                                variant="filled"
                                type="number"
                                label="Fournisseur"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue('supplierId', e.target.value);
                                }}
                                value={values.supplierId}
                                name="supplierId"
                                error={touched.supplierId && !!errors.supplierId}
                                helperText={touched.supplierId && errors.supplierId}
                                select
                            >
                                {supplierList.map((supplier) => (
                                    <MenuItem
                                        key={supplier.supplierId}
                                        value={supplier.supplierId}
                                        selected={supplier.supplierId === values.supplierId}
                                    >
                                        {supplier.businessName
                                            ? supplier.businessName
                                            : `${supplier.firstName} ${supplier.lastName}`}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                Sauvegarder
                            </Button>
                            <Button
                                onClick={cancel}
                                color="error"
                                variant="contained"
                                style={{ marginLeft: "10px" }}
                            >
                                Annuler
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
}

export default BillForm;
