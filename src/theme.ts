import { PaletteMode } from '@mui/material';
import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const createCustomTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#311b92',
        light: '#6746c3',
        dark: '#000063',
      },
      secondary: {
        main: '#004d40',
        light: '#39796b',
        dark: '#00251a',
      },
      error: {
        main: red.A400,
      },
    },
    typography: {
      fontFamily: ['Ubuntu'].join(','),
    },
  });

export default createCustomTheme;
