import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { Radio, Typography } from '@mui/material';
import DoctorRegisterForm from '../components/DoctorRegisterForm';
import PatientRegisterForm from '../components/PatientRegisterForm';

const Registration = () => {
  const navigate = useNavigate();

  const { currentUserData } = useContext(AppContext);

  const [isPatientReg, setIsPatientReg] = useState(true);

  useEffect(() => {
    if (currentUserData?.fullName) {
      alert('Your are already registered');
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserData]);

  return (
    <MainLayout>
      <div className='d-flex flex-column align-items-center'>
        <Typography variant='h6'>Registration Type</Typography>
        <div className='d-flex'>
          <div className='d-flex align-items-center me-3'>
            <Radio
              checked={isPatientReg}
              onChange={() => setIsPatientReg(true)}
              name='radio-buttons'
            />
            <Typography variant='body1'>Patient Registration</Typography>
          </div>
          <div className='d-flex align-items-center'>
            <Radio
              checked={!isPatientReg}
              onChange={() => setIsPatientReg(false)}
              name='radio-buttons'
            />
            <Typography variant='body1'>Doctor Registration</Typography>
          </div>
        </div>
      </div>
      {isPatientReg ? <PatientRegisterForm /> : <DoctorRegisterForm />}
    </MainLayout>
  );
};

export default Registration;
