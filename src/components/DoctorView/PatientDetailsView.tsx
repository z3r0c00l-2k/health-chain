import { Button, LinearProgress, Paper, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { getRevertMessage } from '../../utils';
import CheckIcon from '@mui/icons-material/Check';
import AddTaskIcon from '@mui/icons-material/AddTask';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PrescriptionsList from './PrescriptionsList';

type Props = { selectedPatient: Patient | null; closePatient: () => void };

const PatientDetailsView = ({ selectedPatient, closePatient }: Props) => {
  const { healthChainContract } = useContext(AppContext);

  const [patientData, setPatientData] = useState<Patient | null>(null);

  useEffect(() => {
    setPatientData(null);
    if (selectedPatient?.patientId && healthChainContract) {
      getPatientData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatient, healthChainContract]);

  const getPatientData = async () => {
    if (selectedPatient?.patientId && healthChainContract) {
      try {
        const data: Patient = await healthChainContract.methods
          .getPatientData(selectedPatient?.patientId)
          .call();
        // console.log({ data });

        if (data.fullName) {
          setPatientData({ ...data, patientId: selectedPatient?.patientId });
        } else {
          closePatient();
          alert('No Patient Found');
        }
      } catch (error) {
        console.log({ error });
        getRevertMessage(error as Error);
      }
    }
  };

  const requestForAccess = async () => {
    if (healthChainContract && patientData?.patientId) {
      try {
        const success = await healthChainContract.methods
          .requestForPatientAccess(patientData.patientId)
          .send();
        // console.log({ success });

        if (success?.status) {
          getPatientData();
          alert('Requested Successfully');
        }
      } catch (error) {
        console.log({ error });
        getRevertMessage(error as Error);
      }
    }
  };

  return (
    <Paper className='flex-fill d-flex flex-column'>
      {!selectedPatient ? (
        <Typography textAlign='center' mt={10}>
          Select A Patient From The List
        </Typography>
      ) : !patientData ? (
        <>
          <LinearProgress color='secondary' />
          <Typography textAlign='center' mt={10}>
            Getting Patient From HealthChain...
          </Typography>
        </>
      ) : (
        <div className='flex-fill d-flex flex-column px-5 pt-4'>
          <div className='d-flex align-items-center'>
            <div className='d-flex flex-column flex-fill'>
              <Typography component='div' className='d-flex'>
                Patient Name :
                <Typography className='ms-2 fw-bold'>
                  {patientData.fullName}
                </Typography>
              </Typography>
              <Typography component='div' className='d-flex'>
                Patient Age :
                <Typography className='ms-2 fw-bold'>
                  {patientData.age}
                </Typography>
              </Typography>
              <Typography component='div' className='d-flex'>
                Patient Sex :
                <Typography className='ms-2 fw-bold'>
                  {patientData.sex}
                </Typography>
              </Typography>
            </div>
            <div className='d-flex'>
              <Button
                disabled={patientData.status !== 'none'}
                variant='outlined'
                startIcon={
                  patientData.status === 'approved' ? (
                    <CheckIcon />
                  ) : patientData.status === 'requested' ? (
                    <PendingActionsIcon />
                  ) : (
                    <AddTaskIcon />
                  )
                }
                onClick={requestForAccess}
              >
                {patientData.status === 'approved'
                  ? 'Approved'
                  : patientData.status === 'requested'
                  ? 'Requested'
                  : 'Request'}
              </Button>
            </div>
          </div>
          <PrescriptionsList patientId={patientData.patientId} />
        </div>
      )}
    </Paper>
  );
};

export default PatientDetailsView;
