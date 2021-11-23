import { Check, Close } from '@mui/icons-material';
import {
  ListItem,
  ListItemText,
  Typography,
  Divider,
  IconButton,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { getRevertMessage } from '../../utils';

type Props = {
  address: string;
  isPending?: boolean;
  updateData: () => void;
};

const DoctorItem = ({ address, updateData, isPending }: Props) => {
  const { healthChainContract } = useContext(AppContext);

  const [doctorData, setDoctorData] = useState<Doctor | null>(null);

  useEffect(() => {
    if (healthChainContract) {
      (async () => {
        try {
          const data: Doctor = await healthChainContract.methods
            .doctorDataOf(address)
            .call();

          setDoctorData(data);
        } catch (error) {
          console.log({ error });
          getRevertMessage(error as Error);
        }
      })();
    }
  }, [address, healthChainContract]);

  const reviewDoctorRequest = async (reviewStatus: boolean) => {
    if (healthChainContract) {
      try {
        const success = await healthChainContract.methods
          .reviewDoctorRequest(address, reviewStatus)
          .send();
        // console.log({ success });
        if (success) {
          updateData();
          alert(
            `Doctor Request ${
              reviewStatus ? 'Accepted' : 'Rejected'
            } Successfully`
          );
        }
      } catch (error) {
        console.log({ error });
        getRevertMessage(error as Error);
      }
    }
  };

  const revokeDoctorPermission = async () => {
    if (healthChainContract) {
      try {
        const success = await healthChainContract.methods
          .revokePermission(address)
          .send();
        // console.log({ success });
        if (success) {
          updateData();
          alert('Doctors Permission Removed Successfully');
        }
      } catch (error) {
        console.log({ error });
        getRevertMessage(error as Error);
      }
    }
  };

  return (
    <>
      <ListItem alignItems='flex-start'>
        <ListItemText
          primary={doctorData?.fullName}
          secondary={
            <>
              <Typography
                sx={{ display: 'inline' }}
                component='span'
                variant='body2'
                color='text.primary'
              >
                {doctorData?.hospitalName}
              </Typography>
              {' — '}
              {doctorData?.specialization}
            </>
          }
        />
        <div className=''>
          {isPending && (
            <>
              <IconButton
                color='primary'
                component='span'
                onClick={() => reviewDoctorRequest(true)}
              >
                <Check />
              </IconButton>
            </>
          )}
          <IconButton
            color='error'
            component='span'
            className='ms-3'
            onClick={
              isPending
                ? () => reviewDoctorRequest(false)
                : revokeDoctorPermission
            }
          >
            <Close />
          </IconButton>
        </div>
      </ListItem>
      <Divider component='li' />
    </>
  );
};

export default DoctorItem;
