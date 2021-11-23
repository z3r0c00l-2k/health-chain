import { Publish } from '@mui/icons-material';
import { Button, TextareaAutosize } from '@mui/material';
import { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { getRevertMessage } from '../../utils';

type Props = {
  patientId: string;
  updatePrescription: () => void;
};

const PrescriptionForm = ({ patientId, updatePrescription }: Props) => {
  const { healthChainContract } = useContext(AppContext);

  const [prescriptionText, setPrescriptionText] = useState('');

  const onPrescriptionAdd = async () => {
    const prescription = prescriptionText.trim();
    if (!prescription) {
      return alert('Please input prescription first');
    }
    if (healthChainContract) {
      try {
        const success = await healthChainContract.methods
          .addPrescription(patientId, prescription)
          .send();

        if (success) {
          updatePrescription();
          setPrescriptionText('');
          alert('Prescription added successfully');
        }
      } catch (error) {
        console.log({ error });
        getRevertMessage(error as Error);
      }
    }
  };

  return (
    <div className='d-flex mb-4 align-items-center'>
      <TextareaAutosize
        className='flex-fill me-4 px-2'
        minRows={3}
        placeholder='Input your prescription notes here...'
        style={{ maxHeight: 180 }}
        value={prescriptionText}
        onChange={(e) => setPrescriptionText(e.target.value)}
      />
      <Button
        type='submit'
        variant='contained'
        startIcon={<Publish />}
        onClick={onPrescriptionAdd}
      >
        Submit
      </Button>
    </div>
  );
};

export default PrescriptionForm;
