import React from "react";
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
      <Box
        bgcolor={"background.default"}
        color={"text.primary"}
        sx={{
          minHeight: "100vh", // Ensure it spans the full viewport height
          display: "flex",
          flexDirection: "column", // Stack children vertically
        }}
      >
        <Navbar />
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          flex={1} // Ensures the Stack stretches to fill the remaining space
        >
          <Sidebar />
          <FriendMain />
          <Rightbar />
        </Stack>
      </Box>
    </ThemeProvider>
  );
};
