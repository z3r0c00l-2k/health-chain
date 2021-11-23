import { Paper, Typography } from '@mui/material';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { getRevertMessage } from '../../utils';

type Props = {
  prescription: Prescription;
};

const PrescriptionItem = ({ prescription }: Props) => {
  const { healthChainContract } = useContext(AppContext);

  const [createdData, setCreatedData] = useState<Doctor | null>(null);

  useEffect(() => {
    if (healthChainContract) {
      (async () => {
        try {
          const data: Doctor = await healthChainContract.methods
            .doctorDataOf(prescription.createdBy)
            .call();

          setCreatedData(data);
        } catch (error) {
          console.log({ error });
          getRevertMessage(error as Error);
        }
      })();
    }
  }, [prescription, healthChainContract]);

  return (
    <Paper className='p-3 mb-3'>
      <div className='d-flex justify-content-between mb-2'>
        <Typography variant='caption'>
          {moment(prescription.timestamp * 1000).format(
            'MMM Do YYYY, h:mm:ss a'
          )}
        </Typography>
        <Typography variant='caption'>{createdData?.fullName}</Typography>
      </div>
      <Typography variant='body1'>{prescription.note}</Typography>
    </Paper>
  );
};

export default PrescriptionItem;
