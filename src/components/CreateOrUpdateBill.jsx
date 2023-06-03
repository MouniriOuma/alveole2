import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../scenes/base/Header";
import BillService from '../services/BillService';

const BillForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const { id } = useParams();
    const navigate = useNavigate();

  useEffect(() => {
    if (id === '_add') {
      return;
    } else {
      BillService.getBillById(id).then((res) => {
          let bill = res.data;
          setAmount(bill.amount);
          setDate(bill.date);
          setStatus(bill.status);
          setSupplierId(bill.supplier_id);
        })
        .catch((error) => {
          console.log('Error retrieving bill:', error);
        });
    }
  }, [id]);

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [supplierId, setSupplierId] = useState('');

  const initialValues = {
    amount,
    date,
    status,
    supplierId,
  };

  const handleFormSubmit = (values) => {
    console.log(values);
    saveOrUpdateBill(values);
  };

  const saveOrUpdateBill = (values) => {
    // Get the values from the form
    const amount = values.amount;
    const date = values.date;
    const status = values.status;
    const supplierId = values.supplierId;

    // Create a new bill object
    const bill = {
      amount,
      date,
      status,
      supplier_id: supplierId,
    };

    console.log('bill =>', + JSON.stringify(bill));

    if (id === '_add') {
      BillService.createBill(bill).then((res) => {
          navigate('/bills');
        })
        .catch((error) => {
          console.log('Error creating bill:', error);
        });
    } else {
        BillService.updateBill(bill, id).then((res) => {
          navigate('/bills');
        })
        .catch((error) => {
          console.log('Error updating bill:', error);
        });
    }
  };

  const cancel = () => {
    navigate('/bills');
  };

  const getTitle = () => {
    if (id === '_add') {
      return <span className="text-center">Add Bill</span>;
    } else {
      return <span className="text-center">Update Bill</span>;
    }
  };

  const getSubTitle = () => {
    if (id === '_add') {
      return <span className="text-center">Add a new bill</span>;
    } else {
      return <span className="text-center">Update your bill</span>;
    }
  };

  const checkoutSchema = yup.object().shape({
    amount: yup.number().required('Required'),
    date: yup.date().required('Required'),
    status: yup.string().required('Required'),
    supplierId: yup.number().required('Required'),
  });

  const [formValues, setFormValues] = useState(null) 
  
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
              type="number"
              label="Amount"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.amount}
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
              value={values.date}
              name="date"
              error={touched.date && !!errors.date}
              helperText={touched.date && errors.date}
              sx={{ gridColumn: "span 2" }}
            />

            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Status"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.status}
              name="status"
              error={touched.status && !!errors.status}
              helperText={touched.status && errors.status}
              sx={{ gridColumn: "span 2" }}
            />

            <TextField
              fullWidth
              variant="filled"
              type="number"
              label="Supplier ID"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.supplierId}
              name="supplierId"
              error={touched.supplierId && !!errors.supplierId}
              helperText={touched.supplierId && errors.supplierId}
              sx={{ gridColumn: "span 2" }}
            />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="primary" variant="contained" onClick={handleFormSubmit}>
                Save
              </Button>
              <Button onClick={cancel} color="secondary" variant="contained" style={{ marginLeft: '10px' }}>
                Cancel
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
    
  );
};

export default BillForm;
