import {Box} from '@mui/material'
import React, {useState} from 'react'
import { Post } from './Post'

export const Feed = () => {
  const [expandedPost, setExpandedPost] = useState(null);

  const handleExpand = (index) => {
    setExpandedPost(index);
  };

  const handleCollapse = () => {
    setExpandedPost(null);
  };

  const posts = Array(11).fill(null); // 假设我们有 11 个 Post


  return (
    <Box flex={4} p={2}>
       {posts.map((_, index) => (
        <Post
          key={index}
          isExpanded={expandedPost === index}
          onExpand={() => handleExpand(index)}
          onCollapse={handleCollapse}
        />
      ))}
    </Box>
  )
}
