import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Post } from "./Post";

export const Feed = () => {
  const [expandedPost, setExpandedPost] = useState(null);
  const [posts, setPosts] = useState([]); // 存储从数据库获取的帖子

  // 获取帖子数据
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/main/posts");
        const data = await res.json();
        setPosts(data); // 设置帖子数据
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts(); // 页面加载时获取帖子
  }, []);

  const handleExpand = (index) => {
    setExpandedPost(index);
  };

  const handleCollapse = () => {
    setExpandedPost(null);
  };

  return (
    <Box flex={4} p={2}>
      {posts.map((post, index) => (
        <Post
          key={post._id} // 使用数据库中的帖子ID作为键
          post={post} // 传递帖子数据
          isExpanded={expandedPost === index}
          onExpand={() => handleExpand(index)}
          onCollapse={handleCollapse}
        />
      ))}
    </Box>
  );
};
