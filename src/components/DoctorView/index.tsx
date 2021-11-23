import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { getRevertMessage } from '../../utils';
import PatientDetailsView from './PatientDetailsView';
import PatientList from './PatientList';
import SearchBar from './SearchBar';

const DoctorView = () => {
  const { healthChainContract } = useContext(AppContext);

  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    getDoctorData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [healthChainContract]);

  const getDoctorData = async () => {
    if (healthChainContract) {
      try {
        const data: Doctor = await healthChainContract.methods
          .getDoctorDataByOwner()
          .call();
        // console.log({ data });
        setDoctorData(data);
      } catch (error) {
        console.log({ error });
        getRevertMessage(error as Error);
      }
    }
  };

  const onSearchSubmit = (patientId: string) => {
    setSelectedPatient({ patientId: patientId });
  };

  return (
    <div className='row h-100'>
      <div className='col-md-6 d-flex flex-column'>
        <SearchBar onSearchSubmit={onSearchSubmit} />
        <PatientList
          patientList={doctorData?.patients}
          onItemSelect={setSelectedPatient}
        />
      </div>
      <div className='col-md-6 d-flex flex-column'>
        <PatientDetailsView
          selectedPatient={selectedPatient}
          closePatient={() => setSelectedPatient(null)}
        />
      </div>
    </div>
  );
};

export default DoctorView;
