import { useState } from 'react';
import PatientDetailsView from './PatientDetailsView';
import PatientList from './PatientList';
import SearchBar from './SearchBar';

const DoctorView = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const onSearchSubmit = (patientId: string) => {
    setSelectedPatient({ address: patientId });
  };

  return (
    <div className='row h-100'>
      <div className='col-md-6 d-flex flex-column'>
        <SearchBar onSearchSubmit={onSearchSubmit} />
        <PatientList />
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
