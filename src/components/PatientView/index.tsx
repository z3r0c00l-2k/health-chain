import { CircularProgress } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { getRevertMessage } from '../../utils';
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
          <div className='col-md-6 d-flex flex-column'></div>
        </>
      )}
    </div>
  );
};

export default PatientView;
