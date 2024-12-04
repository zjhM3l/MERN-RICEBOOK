import React from "react";
import { Box, createTheme, Stack, ThemeProvider } from "@mui/material";
import { Navbar } from "../components/Navbar";
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
      {/* Make the entire Box fill the viewport */}
      <Box
        bgcolor={"background.default"}
        color={"text.primary"}
        sx={{
          minHeight: "100vh", // Ensure it fills the entire height
          display: "flex", // Make it a flex container
          flexDirection: "column", // Stack elements vertically
        }}
      >
        <Navbar />
        <Stack direction="row" spacing={2} justifyContent="space-between" flex={1}>
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
