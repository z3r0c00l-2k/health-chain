import { Link, Typography } from '@mui/material';
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const Footer = () => {
  const { web3, contractAddress, availableNetworks } = useContext(AppContext);

  return (
    <div className='d-flex flex-column align-items-center justify-center py-3'>
      <Link
        target='_blank'
        color='inherit'
        href={`${web3.explorerUrl}/address/${contractAddress}`}
      >
        <Typography variant='body2' component='div'>
          HealthChain Contract Address: {contractAddress}
        </Typography>
      </Link>
      <Typography variant='body2' sx={{ mr: 2 }}>
        Connected Network : <span className='fw-bold'>{web3.network}</span>
      </Typography>
      <Typography variant='caption' component='div'>
        Available Networks :{' '}
        <span className='fw-bold'>{availableNetworks.join(', ')}</span>
      </Typography>
    </div>
  );
};

export default Footer;
