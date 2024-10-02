import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Post } from "./Post";

export const Feed = () => {
  const [expandedPost, setExpandedPost] = useState(null);
  const [posts, setPosts] = useState([]); // Store posts fetched from the database

  // Fetch posts data from the server
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/main/posts");
        const data = await res.json();
        setPosts(data); // Set the posts data
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts(); // Fetch posts when the component loads
  }, []);

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
      {posts.map((post, index) => (
        <Post
          key={post._id} // Use the post ID from the database as a key
          post={post} // Pass the post data
          isExpanded={expandedPost === index} // Determine if the post is expanded
          onExpand={() => handleExpand(index)} // Expand the post
          onCollapse={handleCollapse} // Collapse the post
        />
      ))}
    </Box>
  );
};
