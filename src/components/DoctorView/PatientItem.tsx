import { Divider, ListItem, ListItemText, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { getRevertMessage } from '../../utils';

type Props = {
  address: string;
  onItemSelect: (patient: Patient) => void;
};

const PatientItem = ({ address, onItemSelect }: Props) => {
  const { healthChainContract } = useContext(AppContext);

  const [patentData, setPatentData] = useState<Patient | null>(null);

  useEffect(() => {
    if (healthChainContract) {
      (async () => {
        try {
          const data: Patient = await healthChainContract.methods
            .getPatientData(address)
            .call();
          // console.log({ data });
          setPatentData({ ...data, patientId: address });
        } catch (error) {
          console.log({ error });
          getRevertMessage(error as Error);
        }
      })();
    }
  }, [address, healthChainContract]);

  return (
    <>
      <ListItem
        role='button'
        alignItems='flex-start'
        onClick={patentData ? () => onItemSelect(patentData) : () => null}
      >
        <ListItemText
          primary={patentData?.fullName}
          secondary={
            <>
              <Typography
                sx={{ display: 'inline' }}
                component='span'
                variant='body2'
                color='text.primary'
              >
                {patentData?.sex}
              </Typography>
              {' — '}
              {patentData?.age}
            </>
          }
        />
      </ListItem>
      <Divider component='li' />
    </>
  );
};

export default PatientItem;
