import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Box, createTheme, Stack, ThemeProvider } from "@mui/material";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Rightbar } from "../components/Rightbar";
import { PostDetailMain } from "../components/PostDetailMain";

export const PostDetail = () => {
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
          <PostDetailMain />
          <Rightbar />
        </Stack>
      </Box>
    </ThemeProvider>
  );
};
