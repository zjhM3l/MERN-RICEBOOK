import React, { useState } from "react";
import { Box, createTheme, Stack, ThemeProvider } from "@mui/material";
import { Sidebar } from "../components/Sidebar";
import { Rightbar } from "../components/Rightbar";
import { Feed } from "../components/Feed";
import { Navbar } from "../components/Navbar";
import { Add } from "../components/Add";
import { useSelector } from "react-redux";

export const Home = () => {
  const mode = useSelector((state) => state.theme.mode);
  const [feedKey, setFeedKey] = useState(0); // Used to force Feed to refresh
  const [showLikedPosts, setShowLikedPosts] = useState(false); // Track whether to show liked posts
  const [showMoments, setShowMoments] = useState(false); // Track whether to show moments posts

  // Define a function to refresh the Feed
  const refreshFeed = () => {
    setFeedKey((prevKey) => prevKey + 1); // Increment key to force Feed to reload
  };

  const handleShowLikedPosts = (showLiked) => {
    setShowLikedPosts(showLiked); // Update the state to show liked posts
  };

  const handleShowMoments = (showMoments) => {
    setShowMoments(showMoments);
    setShowLikedPosts(false); // Ensure liked posts are not shown when moments is selected
  };

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
          <Sidebar setFeedToLiked={handleShowLikedPosts} setFeedToMoments={handleShowMoments} />
          <Feed key={feedKey} showLikedPosts={showLikedPosts} showMoments={showMoments} />
          <Rightbar />
        </Stack>
        <Add onPostSuccess={refreshFeed} /> {/* Pass refresh function to Add */}
      </Box>
    </ThemeProvider>
  );
};
