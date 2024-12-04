import { Box, Avatar, IconButton, Typography, Paper, Stack } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import API_BASE_URL from "../config/config";

export const Chat = ({ chatId }) => {
  const [messages, setMessages] = useState([]); // Initialize messages as an empty array
  const [newMessage, setNewMessage] = useState("");
  const currentUser = useSelector((state) => state.user.currentUser); // Get the current user from the Redux store
  const messagesEndRef = useRef(null); // Reference for auto-scrolling to the bottom

  // Fetch chat messages when chatId or currentUser changes
  useEffect(() => {
    if (!currentUser) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/chat/${chatId}/messages`);
        const data = await response.json();

        // Ensure data is an array before setting the messages
        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          setMessages([]); // Set to an empty array if the response is not an array
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setMessages([]); // Set empty array in case of an error
      }
    };

    if (chatId) {
      fetchMessages();
    }
  }, [chatId, currentUser]);

  // Automatically scroll to the bottom of the chat after new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    try {
      const response = await fetch(`${API_BASE_URL}/user/chat/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage, senderId: currentUser._id }),
      });

      const message = await response.json();

      // Manually set the sender to the current user
      message.sender = currentUser;

      // Add the new message to the message list
      setMessages([...messages, message]);
      setNewMessage(""); // Clear the message input
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle input change in ReactQuill
  const handleQuillChange = (value) => {
    setNewMessage(value);
  };

  return (
    <Box flex={4} p={2} display="flex" flexDirection="column" height="100%">
      {/* Chat messages display area */}
      <Box
        flexGrow={1}
        overflow="auto"
        p={2}
        display="flex"
        flexDirection="column"
        gap={2}
        sx={{
          maxHeight: '100%',  // Ensure chat area fills available height
          borderRadius: '10px',
        }}
      >
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <Stack
              key={idx}
              direction={msg.sender._id === currentUser._id ? "row-reverse" : "row"}
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
                    maxWidth: '50vw', // Limit the chat bubble to half of the viewport width
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                </Paper>
              </Box>
            </Stack>
          ))
        ) : (
          <Typography>No messages yet</Typography>
        )}
        <div ref={messagesEndRef} /> {/* Auto-scroll reference */}
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
                ['image', 'video'],
              ],
            }}
            formats={['image', 'video']}
            style={{
              borderRadius: '10px',
            }}
          />
        </Box>
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          sx={{
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
