import React from 'react'
import { Box, createTheme, Stack, ThemeProvider} from '@mui/material';
import { Navbar } from '../components/Navbar';
import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
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
              <Sidebar setMode={setMode} mode={mode} />
              <Stack 
                spacing={2} 
                flex={4} 
                p={2} 
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
                justifyContent="center"
                alignItems="center" // 确保竖直方向居中
              >
                <Logo />
                <SignupForm />
              </Stack>
            </Stack>
        </Box>
    </ThemeProvider>
  )
}
