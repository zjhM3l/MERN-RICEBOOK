import { Box, createTheme, Grid, ThemeProvider } from '@mui/material';
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { UpdateProfile } from '../components/UpdateProfile';
import { useSelector } from 'react-redux';

export const Profile = () => {
  const mode = useSelector((state) => state.theme.mode);

  const darkTheme = createTheme({
    palette: {
      mode: mode,
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Box bgcolor={"background.default"} color={"text.primary"} minHeight="100vh">
        <Navbar />
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={3} md={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Sidebar />
          </Grid>
          <Grid item xs={12} sm={9} md={10} display="flex" justifyContent="center" alignItems="center">
            <Box width="100%" maxWidth="600px">
              <UpdateProfile />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};