import React from 'react'
import { Box, createTheme, Stack, ThemeProvider} from '@mui/material';
import { Navbar } from '../components/Navbar';
import { useState } from 'react';
import { SidebarGuest } from '../components/SidebarGuest';
import { SignupForm } from '../components/SignupForm';
import { Logo } from '../components/Logo';

export const Signup = () => {
  const [mode, setMode] = useState('light');

    const darkTheme = createTheme({
        palette: {
        mode: mode,
        },
    });

  return (
    <ThemeProvider theme={darkTheme}>
        <Box bgcolor={"background.default"} color={"text.primary"}>
            <Navbar />
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <SidebarGuest setMode={setMode} mode={mode} />
              <Stack 
                spacing={2} 
                flex={4} 
                p={2} 
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
                justifyContent="center"
              >
                <Logo />
                <SignupForm />
              </Stack>
            </Stack>
        </Box>
    </ThemeProvider>
  )
}
