import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To get chatId from URL
import { Box, Stack, ThemeProvider, createTheme } from "@mui/material";
import { Navbar } from "../components/Navbar";
import { Chat } from "../components/Chat";
import { FriendSidebar } from "../components/FriendSidebar";
import { useSelector } from "react-redux";
import { Rightbar } from "../components/Rightbar";

export const ChatRoom = () => {
  const { chatId } = useParams(); // Get chatId from URL
  const mode = useSelector((state) => state.theme.mode);

  const darkTheme = createTheme({
    palette: {
      mode: mode,
    },
  });

  // You can add logic here to fetch messages for the chat based on chatId

  return (
    <ThemeProvider theme={darkTheme}>
      <Box bgcolor={"background.default"} color={"text.primary"}>
        <Navbar />
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <FriendSidebar />
          <Chat chatId={chatId} /> {/* Pass chatId to Chat component */}
          <Rightbar />
        </Stack>
      </Box>
    </ThemeProvider>
  );
};
