import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Post } from "./Post";
import { useSelector } from "react-redux"; // Import useSelector to get the current user

export const Feed = ({ showLikedPosts }) => {
  const [expandedPost, setExpandedPost] = useState(null);
  const [posts, setPosts] = useState([]); // Store posts fetched from the database
  const currentUser = useSelector((state) => state.user.currentUser); // Retrieve the current user

  // Fetch posts data from the server
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const endpoint = showLikedPosts
          ? `http://localhost:3000/api/main/posts/liked?userId=${currentUser._id}` // Pass userId as a query parameter
          : "http://localhost:3000/api/main/posts";
    
        // No request body needed for GET requests
        const res = await fetch(endpoint);
        const data = await res.json();
        setPosts(data); // Set the posts data
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    if (currentUser) {
      fetchPosts(); // Fetch posts when the component loads or when showLikedPosts changes
    }
  }, [showLikedPosts, currentUser]);

  // Handle expanding a post
  const handleExpand = (index) => {
    setExpandedPost(index);
  };

  // Handle collapsing an expanded post
  const handleCollapse = () => {
    setExpandedPost(null);
  };

  return (
    <Box flex={4} p={2}>
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <Post
            key={post._id} // Use the post ID from the database as a key
            post={post} // Pass the post data
            isExpanded={expandedPost === index} // Determine if the post is expanded
            onExpand={() => handleExpand(index)} // Expand the post
            onCollapse={handleCollapse} // Collapse the post
          />
        ))
      ) : (
        <p>No posts available</p> // Show a message when there are no posts
      )}
    </Box>
  );
};
