import { Card, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { getRevertMessage } from '../../utils';
import PrescriptionForm from './PrescriptionForm';
import moment from 'moment';
import PrescriptionItem from './PrescriptionItem';

type Props = {
  patientId: string;
};

const PrescriptionsList = ({ patientId }: Props) => {
  const { healthChainContract } = useContext(AppContext);

  const [prescriptionsList, setPrescriptionsList] = useState<
    Prescription[] | null
  >(null);

  useEffect(() => {
    getPrescriptionsList();
  }, [patientId]);

  const getPrescriptionsList = async () => {
    if (healthChainContract) {
      try {
        const data: Patient = await healthChainContract.methods
          .getPatientHealth(patientId)
          .call();
        // console.log({ data });

        setPrescriptionsList(data.prescriptionNotes || []);
      } catch (error) {
        console.log({ error });
        getRevertMessage(error as Error);
      }
    }
  };

  return (
    <div className='d-flex flex-column flex-fill mt-3'>
      <div
        className='d-flex flex-column flex-grow-1 mt-3 overflow-auto mb-3'
        style={{
          height: 0,
        }}
      >
        {prescriptionsList?.map((item) => (
          <PrescriptionItem key={item.timestamp} prescription={item} />
        ))}
      </div>
      <PrescriptionForm
        patientId={patientId}
        updatePrescription={getPrescriptionsList}
      />
    </div>
  );
};

export default PrescriptionsList;
