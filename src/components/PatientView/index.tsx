import { CircularProgress, Paper, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { getRevertMessage } from '../../utils';
import PrescriptionItem from '../DoctorView/PrescriptionItem';
import DoctorsList from './DoctorsList';

const PatientView = () => {
  const { healthChainContract } = useContext(AppContext);

  const [patientData, setPatientData] = useState<Patient | null>(null);

  useEffect(() => {
    getPatientData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [healthChainContract]);

  const getPatientData = async () => {
    if (healthChainContract) {
      try {
        const data: Patient = await healthChainContract.methods
          .getPatientDataByOwner()
          .call();
        console.log({ data });
        setPatientData(data);
      } catch (error) {
        console.log({ error });
        getRevertMessage(error as Error);
      }
    }
  };

  return (
    <div className='row h-100'>
      {!patientData ? (
        <CircularProgress />
      ) : (
        <>
          <div className='col-md-6 d-flex flex-column h-100'>
            <DoctorsList
              list={patientData?.requestedDoctors}
              updateData={getPatientData}
              title='Doctor Requests'
              isPending
            />
            <DoctorsList
              list={patientData?.allowedDoctors}
              updateData={getPatientData}
              title='Approved Doctor'
            />
          </div>
          <div className='col-md-6 d-flex flex-column'>
            <Paper className='flex-fill d-flex flex-column px-5 pt-4'>
              <Typography textAlign='center' variant='h6'>
                Prescriptions
              </Typography>
              <div
                className='d-flex flex-column flex-grow-1 mt-3 overflow-auto mb-3'
                style={{
                  height: 0,
                }}
              >
                {patientData.prescriptionNotes?.map((item) => (
                  <PrescriptionItem key={item.timestamp} prescription={item} />
                ))}
              </div>
            </Paper>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientView;
