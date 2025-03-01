import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    padding: theme.spacing(2),
  },
}));

const AppLayout: React.FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <CssBaseline />
      <Header 
        drawerWidth={drawerWidth} 
        onDrawerToggle={handleDrawerToggle} 
      />
      <Sidebar 
        drawerWidth={drawerWidth} 
        mobileOpen={mobileOpen} 
        onClose={() => setMobileOpen(false)}
        variant={isDesktop ? 'permanent' : 'temporary'}
      />
      <Main open={isDesktop}>
        <Box 
          component="div" 
          sx={{ 
            flexGrow: 1,
            p: { xs: 2, md: 3 },
            pt: { xs: 8, sm: 9, md: 10 },
            pb: { xs: 7, sm: 8 },
          }}
        >
          <Outlet />
        </Box>
        <Footer />
      </Main>
    </Box>
  );
};

export default AppLayout;
