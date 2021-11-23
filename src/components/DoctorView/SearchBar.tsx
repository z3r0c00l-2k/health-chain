import { IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';

type Props = {
  onSearchSubmit: (patientId: string) => void;
};

const SearchBar = ({ onSearchSubmit }: Props) => {
  const { web3 } = useContext(AppContext);

  const [searchInput, setSearchInput] = useState(
    '0xb2D08dd08B465a59f075656DF23D0eB0Ab77Aa98'
  );

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const address = searchInput.trim();
    if (web3.web3?.utils.isAddress(address)) {
      onSearchSubmit(address);
    } else {
      alert('Invalid Patient ID');
    }
  };

  return (
    <Paper
      component='form'
      sx={{
        p: '2px 8px',
        display: 'flex',
        alignItems: 'center',
      }}
      onSubmit={onSubmit}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder='Input Patient ID'
        inputProps={{ 'aria-label': 'Input Patient ID' }}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <IconButton type='submit' sx={{ p: '10px' }} aria-label='search'>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
