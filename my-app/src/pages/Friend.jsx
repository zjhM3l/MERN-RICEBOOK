import React, { useState } from "react";
import { Box, createTheme, Stack, ThemeProvider } from "@mui/material";
import { Sidebar } from "../components/Sidebar";
import { Rightbar } from "../components/Rightbar";
import { Navbar } from "../components/Navbar";
import { useSelector } from "react-redux";
import { FriendMain } from "../components/FriendMain";

export const Friend = () => {
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
          <FriendMain />
          <Rightbar />
        </Stack>
      </Box>
    </ThemeProvider>
  )
}
