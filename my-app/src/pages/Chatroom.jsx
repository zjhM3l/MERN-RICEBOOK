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
      <Box
        bgcolor={"background.default"}
        color={"text.primary"}
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // Prevent outer scrollbars
        }}
      >
        {/* Navbar stays fixed */}
        <Navbar />

        {/* Main Chat Room layout */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          sx={{
            flex: 1,
            overflow: "hidden", // No outer scrolling
          }}
        >
          {/* Sidebar for Friends */}
          <Box sx={{ width: "20%", minWidth: "200px", height: "calc(100vh - 64px)" }}>
            <FriendSidebar />
          </Box>

          {/* Chat Section */}
          <Box sx={{ flex: 1, height: "calc(100vh - 64px)", overflow: "hidden" }}>
            <Chat chatId={chatId} />
          </Box>
        </Stack>
      </Box>
    </ThemeProvider>
  );
};
