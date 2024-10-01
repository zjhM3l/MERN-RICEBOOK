import React, { useState } from 'react';
import { Box, Button, TextareaAutosize, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { FormatBold, FormatItalic, KeyboardArrowDown, Check } from '@mui/icons-material';
import { useSelector } from 'react-redux';

export const AddComment = ({ postId, onCommentSuccess }) => {
  const [comment, setComment] = useState("");
  const [italic, setItalic] = useState(false);
  const [fontWeight, setFontWeight] = useState('normal');
  const [anchorEl, setAnchorEl] = useState(null);

  const { currentUser } = useSelector((state) => state.user); // 获取当前用户信息

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSendComment = async () => {
    if (!comment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    if (!currentUser) {
      alert("You must be logged in to add a comment.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/user/createcomment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,  // 使用从父组件传递的 postId
          content: comment,
          author: currentUser._id // 传递当前用户ID作为评论作者
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Comment added successfully");
        setComment(""); // 清空评论输入框
        if (onCommentSuccess) onCommentSuccess(); // 成功后的回调函数，刷新评论区
      } else {
        console.error("Error adding comment:", data.message);
      }
    } catch (error) {
      console.error("Error during comment submission:", error);
    }
  };

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Typography variant="h6">Add your comment</Typography>
      <TextareaAutosize
        value={comment}
        onChange={handleCommentChange}
        placeholder="Type your comment..."
        minRows={4}
        style={{
          width: '100%',
          fontWeight: fontWeight,
          fontStyle: italic ? 'italic' : 'normal',
          padding: '10px',
        }}
      />
      <Box display="flex" justifyContent="space-between" mt={2}>
        <IconButton
          variant="plain"
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <FormatBold />
          <KeyboardArrowDown fontSize="md" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {['200', 'normal', 'bold'].map((weight) => (
            <MenuItem
              key={weight}
              selected={fontWeight === weight}
              onClick={() => {
                setFontWeight(weight);
                setAnchorEl(null);
              }}
            >
              {fontWeight === weight && <Check fontSize="small" />}
              {weight}
            </MenuItem>
          ))}
        </Menu>
        <IconButton
          variant={italic ? 'soft' : 'plain'}
          color={italic ? 'primary' : 'neutral'}
          onClick={() => setItalic((bool) => !bool)}
        >
          <FormatItalic />
        </IconButton>
        <Button variant="contained" onClick={handleSendComment}>
          Send
        </Button>
      </Box>
    </Box>
  );
};
