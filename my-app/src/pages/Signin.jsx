import React from "react";
import { Box, createTheme, Stack, ThemeProvider } from "@mui/material";
import { Navbar } from "../components/Navbar";
import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { SigninForm } from "../components/SigninForm";
import { Logo } from "../components/Logo";
import { useSelector } from "react-redux";

export const Signin = () => {
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
          <Stack
            spacing={2}
            flex={4}
            p={2}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
            justifyContent="center"
            alignItems="center"
          >
            <Logo />
            <SigninForm />
          </Stack>
        </Stack>
      </Box>
    </ThemeProvider>
  );
};
