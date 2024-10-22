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
  const [showMoments, setShowMoments] = useState(false); // Track whether to show moments
  const [searchQuery, setSearchQuery] = useState(""); // State for managing search input

  // Define a function to refresh the Feed
  const refreshFeed = () => {
    setFeedKey((prevKey) => prevKey + 1); // Increment key to force Feed to reload
  };

  const handleShowLikedPosts = (showLiked) => {
    setShowLikedPosts(showLiked);
    setShowMoments(false); // Ensure Moments are not shown if Liked is clicked
  };

  const handleShowMoments = (showMoments) => {
    setShowMoments(showMoments);
    setShowLikedPosts(false); // Ensure Liked is not shown if Moments is clicked
  };

  const handleShowDefaultFeed = () => {
    setShowLikedPosts(false); // Reset both flags
    setShowMoments(false);
  };

  const darkTheme = createTheme({
    palette: {
      mode: mode,
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Box bgcolor={"background.default"} color={"text.primary"}>
        <Navbar setSearchQuery={setSearchQuery} />
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Sidebar
            setFeedToLiked={handleShowLikedPosts}
            setFeedToMoments={handleShowMoments}
            setFeedToDefault={handleShowDefaultFeed} // Reset feed to default on homepage click
          />
          <Feed key={feedKey} searchQuery={searchQuery} showLikedPosts={showLikedPosts} showMoments={showMoments} /> {/* Feed will refresh based on the key */}
          <Rightbar />
        </Stack>
        <Add onPostSuccess={refreshFeed} /> {/* Pass refresh function to Add */}
      </Box>
    </ThemeProvider>
  );
};
