import React from 'react'
import { Box, createTheme, Stack, ThemeProvider } from '@mui/material';
import { Sidebar } from '../components/Sidebar';
import { Rightbar } from '../components/Rightbar';
import { Feed } from '../components/Feed';
import { Navbar } from '../components/Navbar';
import { Add } from '../components/Add';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export const Home = () => {
    const mode = useSelector((state) => state.theme.mode);

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
            <Sidebar />
            <Feed />
            <Rightbar />
            </Stack>
            <Add />
        </Box>
        </ThemeProvider>
    )
}
