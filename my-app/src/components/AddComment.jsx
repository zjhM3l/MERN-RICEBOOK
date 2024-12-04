import React, { useState } from 'react';
import { Box, Button, TextareaAutosize, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { FormatBold, FormatItalic, KeyboardArrowDown, Check } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import API_BASE_URL from "../config/config";

export const AddComment = ({ postId, onCommentSuccess }) => {
  const [comment, setComment] = useState("");
  const [italic, setItalic] = useState(false);
  const [fontWeight, setFontWeight] = useState('normal');
  const [anchorEl, setAnchorEl] = useState(null);

  const { currentUser } = useSelector((state) => state.user); // Get the current user from the Redux store

  // Handle the change in comment input
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  // Handle the submission of the comment
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
      const res = await fetch(`${API_BASE_URL}/user/createcomment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,  // Use the postId passed from the parent component
          content: comment,
          author: currentUser._id // Pass the current user ID as the comment author
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Comment added successfully");
        setComment(""); // Clear the comment input field
        if (onCommentSuccess) onCommentSuccess(); // Call the success callback to refresh the comment section
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
