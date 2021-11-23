import { Button, TextField } from '@mui/material';
import { Formik, Form } from 'formik';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import { AppContext } from '../contexts/AppContext';
import { getRevertMessage } from '../utils';

type Values = {
  fullName: string;
  hospitalName: string;
  specialization: string;
};

const validationSchema = yup.object({
  fullName: yup.string().required('Doctor Name is required'),
  hospitalName: yup.string().required('Hospital Name is required'),
  specialization: yup.string().required('Specialization is required'),
});

const DoctorRegisterForm = () => {
  const navigate = useNavigate();

  const { healthChainContract, getUserData } = useContext(AppContext);

  const onSubmit = async (values: Values) => {
    if (healthChainContract) {
      try {
        const success = await healthChainContract.methods
          .registerDoctor(
            values.fullName,
            values.hospitalName,
            values.specialization
          )
          .send();

        if (success) {
          getUserData();
          alert('Registration as Doctor Successful');
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
        hospitalName: '',
        specialization: '',
      }}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ values, touched, errors, handleChange, isSubmitting }) => (
        <Form className='d-flex flex-column mt-5'>
          <TextField
            className='mb-3'
            name='fullName'
            id='fullName'
            label='Doctor Name'
            variant='outlined'
            value={values.fullName}
            onChange={handleChange}
            error={touched.fullName && !!errors.fullName}
            helperText={touched.fullName && errors.fullName}
          />
          <TextField
            className='mb-3'
            name='hospitalName'
            id='hospitalName'
            label='Hospital Name'
            variant='outlined'
            value={values.hospitalName}
            onChange={handleChange}
            error={touched.hospitalName && !!errors.hospitalName}
            helperText={touched.hospitalName && errors.hospitalName}
          />
          <TextField
            className='mb-3'
            name='specialization'
            id='specialization'
            label='Specialization'
            variant='outlined'
            value={values.specialization}
            onChange={handleChange}
            error={touched.specialization && !!errors.specialization}
            helperText={touched.specialization && errors.specialization}
          />
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

export default DoctorRegisterForm;
