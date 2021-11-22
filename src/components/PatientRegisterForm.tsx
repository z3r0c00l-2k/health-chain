import { useContext } from 'react';
import {
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router';
import { getRevertMessage } from '../utils';

type Values = { fullName: string; age: number | string; sex: string };

const validationSchema = yup.object({
  fullName: yup.string().required('Patient Name is required'),
  age: yup
    .number()
    .min(1, 'Minimum value is 1')
    .required('Patient age is required'),
  sex: yup.string().required('Patient sex is required'),
});

const PatientRegisterForm = () => {
  const navigate = useNavigate();

  const { healthChainContract, getUserData } = useContext(AppContext);

  const onSubmit = async (values: Values) => {
    if (healthChainContract) {
      try {
        const success = await healthChainContract.methods
          .registerPatient(values.fullName, values.age, values.sex)
          .send();

        if (success) {
          getUserData();
          alert('Registration as Patient Successful');
          navigate('/');
        }
      } catch (error) {
        console.log({ error });
        getRevertMessage(error as Error);
      }
    }
  };

  return (
    <Formik
      initialValues={{
        fullName: '',
        age: '',
        sex: '',
      }}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({
        values,
        touched,
        errors,
        handleChange,
        setFieldValue,
        isSubmitting,
      }) => (
        <Form className='d-flex flex-column mt-5'>
          <TextField
            className='mb-3'
            name='fullName'
            id='fullName'
            label='Patient Name'
            variant='outlined'
            value={values.fullName}
            onChange={handleChange}
            error={touched.fullName && !!errors.fullName}
            helperText={touched.fullName && errors.fullName}
          />
          <TextField
            className='mb-3'
            name='age'
            id='age'
            label='Patient Age'
            variant='outlined'
            type='number'
            value={values.age}
            onChange={handleChange}
            error={touched.age && !!errors.age}
            helperText={touched.age && errors.age}
          />
          <FormLabel component='legend'>Patient's Sex</FormLabel>
          <RadioGroup className='flex-row' name='sex'>
            {sexOptions.map((option) => (
              <FormControlLabel
                value={option}
                control={
                  <Radio
                    checked={option === values.sex}
                    onChange={() => setFieldValue('sex', option)}
                  />
                }
                label={option}
              />
            ))}
          </RadioGroup>
          {touched.sex && errors.sex && (
            <Typography className='text-danger'>{errors.sex}</Typography>
          )}
          <Button
            disabled={isSubmitting}
            type='submit'
            variant='contained'
            className='mt-3'
          >
            {isSubmitting ? 'Registering' : 'Register'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default PatientRegisterForm;

const sexOptions = ['Male', 'Female'];
