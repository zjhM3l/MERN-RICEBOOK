import { Box, Pagination } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Post } from "./Post";
import { useSelector } from "react-redux";
import API_BASE_URL from "../config/config";

export const Feed = ({ showLikedPosts, showMoments, searchQuery }) => {
  const [expandedPost, setExpandedPost] = useState(null);
  const [posts, setPosts] = useState([]); // Store posts fetched from the database
  const [currentPage, setCurrentPage] = useState(1); // Track current page for pagination
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const currentUser = useSelector((state) => state.user.currentUser); // Retrieve the current user

  const POSTS_PER_PAGE = 5; // Define the number of posts per page

  // Fetch posts data from the server
useEffect(() => {
  const fetchPosts = async () => {
    try {
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
    }
  };

  if (currentUser) {
    fetchPosts(); // Fetch posts only if user is logged in
  }
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
      {posts && posts.length > 0 ? ( // Check if posts is defined and has items
        <>
          {posts.map((post, index) => (
            <Post
              key={post._id} // Use the post ID from the database as a key
              post={post} // Pass the post data
              isExpanded={expandedPost === index} // Determine if the post is expanded
              onExpand={() => handleExpand(index)} // Expand the post
              onCollapse={handleCollapse} // Collapse the post
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