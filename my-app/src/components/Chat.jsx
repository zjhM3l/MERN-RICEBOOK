import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";  // Import useSelector from react-redux

export const Chat = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = useSelector((state) => state.user.currentUser); // Get current user from Redux

  useEffect(() => {
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
  }, [chatId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const response = await fetch(`http://localhost:3000/api/user/chat/${chatId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newMessage, senderId: currentUser._id }),
        });

        const message = await response.json();
        setMessages([...messages, message]); // Append the new message to the list
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <Box flex={4} p={2} bgcolor="pink">
      <div>
        <div>
          {messages.map((msg, idx) => (
            <div key={idx}>
              <strong>{msg.sender.username}: </strong>
              {msg.content}
            </div>
          ))}
        </div>
        <div>
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </Box>
  );
};
