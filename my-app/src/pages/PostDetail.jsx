import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Box, createTheme, Stack, ThemeProvider } from "@mui/material";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Rightbar } from "../components/Rightbar";
import { PostDetailMain } from "../components/PostDetailMain";
import { PostComment } from "../components/PostComment";
import { AddComment } from "../components/AddComment";
import { useParams } from "react-router-dom"; // Used to retrieve postId from the route

export const PostDetail = () => {
  const mode = useSelector((state) => state.theme.mode);
  const darkTheme = createTheme({
    palette: {
      mode: mode,
    },
  });

  const { postId } = useParams(); // Retrieve postId from the route
  const [refreshComments, setRefreshComments] = useState(false);

  // Callback function after a successful comment, used to refresh the comment section
  const handleCommentSuccess = () => {
    setRefreshComments(!refreshComments); // Trigger refresh
  };

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
            <PostDetailMain postId={postId} /> {/* Pass postId */}
            <AddComment postId={postId} onCommentSuccess={handleCommentSuccess} /> {/* Pass postId and callback function */}
            <PostComment postId={postId} refresh={refreshComments} /> {/* Pass postId and refresh state */}
          </Stack>
          <Rightbar />
        </Stack>
      </Box>
    </ThemeProvider>
  );
};
