import {
  AppBar,
  Avatar,
  IconButton,
  Link,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const NavBar = () => {
  const theme = useTheme();

  const { toggleDarkMode, web3, currentUserData } = useContext(AppContext);

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1, ml: 4 }}>
          HealthChain
          {currentUserData?.fullName &&
            ` : ${currentUserData?.isDoctor ? 'Doctor' : 'Patient'}`}
        </Typography>
        {currentUserData?.fullName && (
          <Typography variant='body2' sx={{ mr: 2 }}>
            Name : <span className='fw-bold'>{currentUserData?.fullName}</span>
          </Typography>
        )}
        <Tooltip title={web3.currentAddress}>
          <Link
            href={`${web3.explorerUrl}/address/${web3.currentAddress}`}
            target='_blank'
            color='inherit'
          >
            {`${web3.currentAddress?.substring(
              0,
              6
            )}...${web3.currentAddress?.substring(38, 42)}`}
          </Link>
        </Tooltip>
        <Avatar sx={{ ml: 2 }} />
        <IconButton sx={{ ml: 4 }} onClick={toggleDarkMode} color='inherit'>
          {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
