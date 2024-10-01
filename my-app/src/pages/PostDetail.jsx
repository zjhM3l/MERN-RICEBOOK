import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Box, createTheme, Stack, ThemeProvider } from "@mui/material";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Rightbar } from "../components/Rightbar";
import { PostDetailMain } from "../components/PostDetailMain";
import { PostComment } from "../components/PostComment";
import { AddComment } from "../components/AddComment";

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
          <Stack
            direction="column"
            spacing={2}
            bgcolor="background.default"
            color="text.primary"
            minHeight="100vh"
            display="flex"
            flex={4}
            p={2}
          >
            <PostDetailMain />
            <AddComment />
            <PostComment />
          </Stack>
          <Rightbar />
        </Stack>
      </Box>
    </ThemeProvider>
  );
};
