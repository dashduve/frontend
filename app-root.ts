import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';

import AppRoutes from './routes';
import { AuthProvider } from './context/AuthContext';
import { AlertsProvider } from './context/AlertsContext';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import theme from './assets/styles/theme';

const App: React.FC = () => {
  return (
    <CustomThemeProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <AuthProvider>
            <AlertsProvider>
              <Router>
                <AppRoutes />
              </Router>
            </AlertsProvider>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </CustomThemeProvider>
  );
};

export default App;
