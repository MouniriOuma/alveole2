import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../scenes/base/Header";
import WaterElecService from '../services/WaterElecService';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';



const WaterElecForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id === '_add') {
      return;
    } else {
      WaterElecService.getWaterElecById(id).then((res) => {
        let bill = res.data;
        setBillNum(bill.bill_num);
        setCost(bill.cost);
        setWaterElec(bill.water_elec);
        setDate(bill.date);
      });
    }
  }, [id]);

  const [billNum, setBillNum] = useState('');
  const [cost, setCost] = useState('');
  const [waterElec, setWaterElec] = useState('');
  const [date, setDate] = useState('');

  const initialValues = {
    billNum,
    cost,
    waterElec,
    date,
  };

  const handleFormSubmit = (values) => {
    console.log(values);
    saveOrUpdateWaterElec(values);
  };

  const saveOrUpdateWaterElec = (values) => {
    const billNum = values.billNum;
    const cost = values.cost;
    const waterElec = values.waterElec;
    const date = values.date;

    const bill = {
      bill_num: billNum,
      cost,
      water_elec: waterElec,
      date,
    };

    console.log('waterElec => ' + JSON.stringify(bill));

    if (id === '_add') {
      WaterElecService.createWaterElec(bill).then((res) => {
        navigate('/waterElecs');
      });
    } else {
      WaterElecService.updateWaterElec(bill, billNum).then((res) => {
        navigate('/waterElecs');
      });
    }
  };

  const cancel = () => {
    navigate('/waterElecs');
  };

  const getTitle = () => {
    if (billNum === '_add') {
      return <span className="text-center">Add Bill</span>;
    } else {
      return <span className="text-center">Update Bill</span>;
    }
  };

  const getSubTitle = () => {
    if (billNum === '_add') {
      return <span className="text-center">Add a new bill</span>;
    } else {
      return <span className="text-center">Update Bill</span>;
    }
  };

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
              gridTemplateColumns="repeat(2, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Bill Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.billNum}
                name="billNum"
                error={!!touched.billNum && !!errors.billNum}
                helperText={touched.billNum && errors.billNum}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Cost"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cost}
                name="cost"
                error={!!touched.cost && !!errors.cost}
                helperText={touched.cost && errors.cost}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                select
                label="Water/Electricity"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.waterElec}
                name="waterElec"
                error={!!touched.waterElec && !!errors.waterElec}
                helperText={touched.waterElec && errors.waterElec}
                sx={{ gridColumn: "span 4" }}
                >
                <MenuItem value="WATER">WATER</MenuItem>
                <MenuItem value="ELECTRICITY">ELECTRICITY</MenuItem>
                </TextField>
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.date}
                name="date"
                error={!!touched.date && !!errors.date}
                helperText={touched.date && errors.date}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            <Box mt="20px" display="flex" justifyContent="flex-end">
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={cancel}
                sx={{ ml: '10px' }}
              >
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
    billNum: yup.number().typeError('Bill Number must be a number').required('Bill Number is required'),
    cost: yup.number().required('Cost is required'),
    waterElec: yup.string().required('Water/Electricity is required').oneOf(['WATER', 'ELECTRICITY'], 'Invalid choice'),
    date: yup.date().required('Date is required'),
});

export default WaterElecForm;
