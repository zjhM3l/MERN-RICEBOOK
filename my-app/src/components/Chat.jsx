import { Box, Avatar, IconButton, Typography, Paper, Stack } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";  // Import useSelector from react-redux
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';  // Quill styles

export const Chat = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = useSelector((state) => state.user.currentUser); // Get current user from Redux

  useEffect(() => {
    if (!currentUser) return;  // If no user is logged in, don't fetch messages

    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/user/chat/${chatId}/messages`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    if (chatId) {
      fetchMessages();
    }
  }, [chatId, currentUser]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;  // Check if message is not empty and user is logged in

    try {
      const response = await fetch(`http://localhost:3000/api/user/chat/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage, senderId: currentUser._id }),
      });

      const message = await response.json();

      // Manually set the sender to the current user
      message.sender = currentUser;  // Ensure sender is set to current user
      
      // Append the new message to the list
      setMessages([...messages, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleQuillChange = (value) => {
    setNewMessage(value);
  };

  if (!currentUser) {
    return (
      <Box flex={4} p={2} display="flex" flexDirection="column" height="100vh" bgcolor="background.default">
        <Typography variant="h6" color="textSecondary">
          Please log in to view the chat.
        </Typography>
      </Box>
    );
  }

  return (
    <Box flex={4} p={2} display="flex" flexDirection="column" height="100vh" bgcolor="background.default">
      {/* Chat messages display area */}
      <Box flexGrow={1} overflow="auto" p={2} display="flex" flexDirection="column" gap={2} sx={{ maxHeight: '80vh', bgcolor: '#f5f5f5', borderRadius: '10px' }}>
        {messages.map((msg, idx) => (
          <Stack
            key={idx}
            direction={msg.sender._id === currentUser._id ? "row-reverse" : "row"} // Align right for current user, left for others
            alignItems="center"
            spacing={2}
          >
            <Avatar alt={msg.sender.username} src={msg.sender.profilePicture || ''} />
            <Box>
              <Typography variant="body2" color="textSecondary">
                {msg.sender.username}
              </Typography>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  bgcolor: msg.sender._id === currentUser._id ? "primary.main" : "grey.200",
                  color: msg.sender._id === currentUser._id ? "white" : "black",
                  borderRadius: '10px',
                  maxWidth: '300px',
                }}
              >
                {/* Display the HTML content from Quill */}
                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
              </Paper>
            </Box>
          </Stack>
        ))}
      </Box>

      {/* Input and send button area with ReactQuill */}
      <Box mt={2} display="flex" alignItems="center" gap={2}>
        <Box flexGrow={1}>
          <ReactQuill
            theme="snow"
            value={newMessage}
            onChange={handleQuillChange}
            placeholder="Type your message..."
            modules={{
              toolbar: [
                ['image', 'video'],                        // links, images and videos
              ],
            }}
            formats={[
              'image', 'video',
            ]}
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
            }}
          />
        </Box>
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
