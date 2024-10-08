import React from "react";
import { useParams } from "react-router-dom";
import { Box, Stack, ThemeProvider, createTheme } from "@mui/material";
import { Navbar } from "../components/Navbar";
import { Chat } from "../components/Chat";
import { FriendSidebar } from "../components/FriendSidebar";
import { useSelector } from "react-redux";

export const ChatRoom = () => {
  const { chatId } = useParams(); // Get chatId from URL
  const mode = useSelector((state) => state.theme.mode);

  const darkTheme = createTheme({
    palette: {
      mode: mode,
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      {/* Ensure the whole page fills the viewport height */}
      <Box bgcolor={"background.default"} color={"text.primary"} height="100vh">
        <Navbar />
        <Stack direction="row" spacing={2} justifyContent="space-between" height="calc(100vh - 64px)">
          <FriendSidebar />
          <Chat chatId={chatId} /> {/* Pass chatId to Chat component */}
        </Stack>
      </Box>
    </ThemeProvider>
  );
};
