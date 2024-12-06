import { Box, Pagination, Alert } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Post } from "./Post";
import { useSelector } from "react-redux";
import API_BASE_URL from "../config/config";

export const Feed = ({ showLikedPosts, showMoments, searchQuery }) => {
  const [expandedPost, setExpandedPost] = useState(null);
  const [posts, setPosts] = useState([]); // Store posts fetched from the database
  const [currentPage, setCurrentPage] = useState(1); // Track current page for pagination
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [errorMessage, setErrorMessage] = useState(null); // Track error messages
  const currentUser = useSelector((state) => state.user.currentUser); // Retrieve the current user

  const POSTS_PER_PAGE = 5; // Define the number of posts per page

  // Fetch posts data from the server
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!currentUser) {
          setErrorMessage("Please log in to view posts.");
          setPosts([]); // Clear posts if user is logged out
          setTotalPages(1); // Reset pagination
          return;
        }

        setErrorMessage(null); // Clear any existing error messages
        let endpoint;

        if (showLikedPosts) {
          endpoint = `${API_BASE_URL}/main/posts/liked`;
        } else if (showMoments) {
          endpoint = `${API_BASE_URL}/main/posts/followed`;
        } else {
          endpoint = `${API_BASE_URL}/main/posts`;
        }

        // Append query parameters
        const params = new URLSearchParams({
          userId: currentUser._id, // Ensure userId is passed as a separate parameter
          page: currentPage,
          limit: POSTS_PER_PAGE,
        });
        if (searchQuery) {
          params.append("search", searchQuery);
        }

        const res = await fetch(`${endpoint}?${params.toString()}`);
        const data = await res.json();

        setPosts(data.posts || []); // Default to empty array if `data.posts` is undefined
        const totalItems = data.totalCount || 0;
        setTotalPages(Math.ceil(totalItems / POSTS_PER_PAGE));
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
        setTotalPages(1);
        setErrorMessage("An error occurred while fetching posts.");
      }
    };

    fetchPosts(); // Always call fetchPosts
  }, [showLikedPosts, showMoments, searchQuery, currentUser, currentPage]);

  // Handle expanding a post
  const handleExpand = (index) => {
    setExpandedPost(index);
  };

  // Handle collapsing an expanded post
  const handleCollapse = () => {
    setExpandedPost(null);
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update the current page
  };

  return (
    <Box flex={4} p={2}>
      {errorMessage ? ( // Display error message if present
        <Alert severity="warning" sx={{ mt: 2, textAlign: "center" }}>
          {errorMessage}
        </Alert>
      ) : posts && posts.length > 0 ? (
        <>
          {posts.map((post, index) => (
            <Post
              key={post._id} // Use the post ID from the database as a key
              post={post} // Pass the post data
              isExpanded={expandedPost === index} // Determine if the post is expanded
              onExpand={() => currentUser && handleExpand(index)} // Expand only if logged in
              onCollapse={handleCollapse} // Collapse the post
              disabled={!currentUser} // Pass disabled status to Post
            />
          ))}
          <Pagination
            count={totalPages} // Total number of pages
            page={currentPage} // Current page
            onChange={handlePageChange} // Handle page change
            color="primary"
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
        </>
      ) : (
        <p>No posts available</p> // Show a message when there are no posts
      )}
    </Box>
  );
};
