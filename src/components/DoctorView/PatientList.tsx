import { List } from '@mui/material';
import PatientItem from './PatientItem';

type Props = {
  patientList?: string[];
  onItemSelect: (patient: Patient) => void;
};

const PatientList = ({ patientList, onItemSelect }: Props) => {
  return (
    <List
      className='d-flex flex-column flex-grow-1 mt-3'
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        height: 0,
        overflow: 'auto',
      }}
    >
      {patientList?.map((item) => (
        <PatientItem key={item} address={item} onItemSelect={onItemSelect} />
      ))}
    </List>
  );
};

export default PatientList;
