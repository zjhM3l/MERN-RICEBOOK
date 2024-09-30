import React, { useState } from "react";
import { Box, createTheme, Stack, ThemeProvider } from "@mui/material";
import { Rightbar } from "../components/Rightbar";
import { Navbar } from "../components/Navbar";
import { Add } from "../components/Add";
import { useSelector } from "react-redux";
import { Chat } from "../components/Chat";
import { FriendSidebar } from "../components/FriendSidebar";

export const ChatRoom = () => {
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
          <FriendSidebar />
          <Chat />
          <Rightbar />
        </Stack>
        <Add onPostSuccess={refreshFeed} /> {/* 将刷新函数传递给 Add */}
      </Box>
    </ThemeProvider>
  );
};
