import React, { useState, useEffect, useRef } from "react";
import { Box, Avatar, IconButton, Typography, Paper, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import API_BASE_URL from "../config/config";

export const Chat = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = useSelector((state) => state.user.currentUser);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser) return;

      try {
        const response = await fetch(`${API_BASE_URL}/user/chat/${chatId}/messages`);
        const data = await response.json();

        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [chatId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    try {
      const response = await fetch(`${API_BASE_URL}/user/chat/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage, senderId: currentUser._id }),
      });

      const message = await response.json();
      setMessages((prev) => [...prev, { ...message, sender: currentUser }]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      sx={{
        overflow: "hidden", // Prevent unnecessary scrolling outside chat messages area
      }}
    >
      {/* Chat Messages Area */}
      <Box
        flexGrow={1}
        p={2}
        display="flex"
        flexDirection="column"
        gap={2}
        sx={{
          overflowY: "auto", // Allow scrolling only for the messages area
          maxHeight: "calc(100vh - 180px)", // Adjust height based on input area and navbar
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "10px",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: "4px",
          },
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
              <Avatar alt={msg.sender.username} src={msg.sender.profilePicture || ""} />
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
                    borderRadius: "10px",
                    maxWidth: "50vw",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
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
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        mt={2}
        display="flex"
        alignItems="center"
        gap={2}
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          pt: 2,
          pb: 2,
          backgroundColor: "background.default",
        }}
      >
        <Box flexGrow={1}>
          <ReactQuill
            theme="snow"
            value={newMessage}
            onChange={(value) => setNewMessage(value)}
            placeholder="Type your message..."
            modules={{
              toolbar: [["bold", "italic", "underline", "image"]],
            }}
            formats={["bold", "italic", "underline", "image"]}
            style={{
              borderRadius: "10px",
            }}
          />
        </Box>
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          sx={{
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
