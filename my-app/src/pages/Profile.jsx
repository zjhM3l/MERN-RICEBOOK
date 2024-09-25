import { Box, createTheme, Stack, ThemeProvider } from '@mui/material';
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { UpdateProfile } from '../components/UpdateProfile';

export const Profile = () => {
  const [mode, setMode] = useState('light');

  const darkTheme = createTheme({
    palette: {
      mode: mode,
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Box bgcolor={"background.default"} color={"text.primary"} minHeight="100vh">
        <Navbar />
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Sidebar setMode={setMode} mode={mode} />
          <Box
            flex={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box width="100%" maxWidth="600px">
              <UpdateProfile />
            </Box>
          </Box>
        </Stack>
      </Box>
    </ThemeProvider>
  );
};