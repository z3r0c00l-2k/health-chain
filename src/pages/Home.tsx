import { Button, Typography } from '@mui/material';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import MainLayout from '../layouts/MainLayout';

const Home = () => {
  const { currentUserData } = useContext(AppContext);

  return (
    <MainLayout>
      {currentUserData ? null : (
        <div className='d-flex flex-fill flex-column align-items-center justify-content-center'>
          <Typography className='mb-3'>
            You are not registered in HealthChain, Please register first
          </Typography>
          <Link to='/registration'>
            <Button variant='contained'>Register</Button>
          </Link>
        </div>
      )}
    </MainLayout>
  );
};

export default Home;
