import { List, Typography } from '@mui/material';
import DoctorItem from './DoctorItem';

type Props = {
  title: string;
  list?: string[];
  updateData: () => void;
  isPending?: boolean;
};

const DoctorsList = ({ title, list, updateData, isPending }: Props) => {
  return (
    <div className='flex-fill d-flex flex-column'>
      <Typography variant='h6' className='mb-3'>
        {title}
      </Typography>
      <List
        className='d-flex flex-column flex-grow-1'
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          height: 0,
          overflow: 'auto',
        }}
      >
        {list?.map((item) => (
          <DoctorItem
            key={item}
            address={item}
            updateData={updateData}
            isPending={isPending}
          />
        ))}
      </List>
    </div>
  );
};

export default DoctorsList;
