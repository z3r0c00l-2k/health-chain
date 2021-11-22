import { useContext, useMemo } from 'react';
import Router from './Router';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createCustomTheme from './theme';
import { AppContext } from './contexts/AppContext';

const App = () => {
  const { isDarkMode } = useContext(AppContext);

  const theme = useMemo(
    () => createCustomTheme(isDarkMode ? 'dark' : 'light'),
    [isDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router />
    </ThemeProvider>
  );
};

export default App;
