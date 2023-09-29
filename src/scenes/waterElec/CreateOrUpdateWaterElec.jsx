import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../base/Header";
import WaterElecService from '../../services/WaterElecService';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import { formatISO, parseISO } from "date-fns";

const WaterElecForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const { id } = useParams();
  const navigate = useNavigate();

  const [bill_Num, setBill_Num] = useState('');
  const [cost, setCost] = useState(0);
  const [water_elec, setWater_elec] = useState('');
  const [date, setDate] = useState('2023-01-01');

  useEffect(() => {
    if (id === '_add') {
      return;
    } else {
      WaterElecService.getWaterElecById(id).then((res) => {
        let bill = res.data;
        setBill_Num(bill.bill_Num);
        setCost(bill.cost);
        setWater_elec(bill.water_elec);
        setDate(bill.date);
      });
    }
  }, [id]);

  const initialValues = {
    bill_Num,
    cost,
    water_elec,
    date,
  };

  const handleFormSubmit = (values) => {

    if (
        values.bill_Num === "" &&
        values.cost === 0 &&
        values.date === "2023-01-01" &&
        values.water_elec === ""
    ) {
      // Skip sending to the database if all values are empty
      navigate("/waterElecs");
    } else {
      saveOrUpdateWaterElec(values);
    }
  };

  const saveOrUpdateWaterElec = (values) => {
    const { bill_Num, cost, water_elec, date } = values;

    const bill = {
      bill_Num,
      cost,
      water_elec: water_elec,
      date,
    };



    const allValuesEmpty = Object.values(bill).every((value) => !value);

    if (allValuesEmpty) {
      // All values are empty, skip saving or updating
      console.log("All values are empty, skipping saveOrUpdateProduct");
      return;
    }
    if (id === '_add') {
      WaterElecService.createWaterElec(bill).then((res) => {
        navigate('/waterElecs');
      });
    } else {
      WaterElecService.updateWaterElec(bill, bill_Num).then((res) => {
        navigate('/waterElecs');
      });
    }
  };

  const cancel = () => {
    navigate('/waterElecs');
  };

  const getTitle = () => {
    return id === '_add' ? <span className="text-center">Ajouter facture eau/électricité</span> : <span className="text-center">Update Bill</span>;
  };

  const getSubTitle = () => {
    return id === '_add' ? <span className="text-center">Ajouter les détails du facture</span> : <span className="text-center">Update Bill</span>;
  };

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
                      label="N facture"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.bill_Num}
                      name="bill_Num"
                      error={!!touched.bill_Num && !!errors.bill_Num}
                      helperText={touched.bill_Num && errors.bill_Num}
                      sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                      fullWidth
                      variant="filled"
                      type="number"
                      label="Coùt"
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
                      label="Eau/Electricité"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.water_elec}
                      name="water_elec"
                      error={!!touched.water_elec && !!errors.water_elec}
                      helperText={touched.water_elec && errors.water_elec}
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
                      value={values.date ? formatISO(parseISO(values.date), { representation: 'date' }) : ''}
                      name="date"
                      error={touched.date && !!errors.date}
                      helperText={touched.date && errors.date}
                      sx={{ gridColumn: 'span 4' }}
                      inputProps={{
                        max: formatISO(new Date(), { representation: 'date' }),
                      }}
                  />
                </Box>

                <Box mt="20px" display="flex" justifyContent="flex-end">
                  <Button type="submit" variant="contained" color="secondary" onClick={handleFormSubmit}>
                    Sauvegarder
                  </Button>
                  <Button
                      variant="contained"
                      color="error"
                      onClick={cancel}
                      sx={{ ml: '10px' }}
                  >
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
  bill_Num: yup.number().typeError('Bill Number must be a number').required('Bill Number is required'),
  cost: yup.number().required('Cost is required'),
  water_elec: yup.string().required('Water/Electricity is required').oneOf(['WATER', 'ELECTRICITY'], 'Invalid choice'),
  date: yup.date().required('Date is required'),
});

export default WaterElecForm;
