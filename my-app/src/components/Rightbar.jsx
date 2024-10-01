import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarGroup,
  Box,
  ImageList,
  ImageListItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";

export const Rightbar = () => {
  const [latestConversations, setLatestConversations] = useState([]); // Store latest messages
  const [recentPosts, setRecentPosts] = useState([]); // Store latest posts
  const [unrepliedMessagesCount, setUnrepliedMessagesCount] = useState(0); // Store unreplied messages count
  const currentUser = useSelector((state) => state.user.currentUser); // Get current user from Redux
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestConversations = async () => {
      if (currentUser) {
        try {
          const response = await fetch(`http://localhost:3000/api/user/latest-conversations/${currentUser._id}`);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setLatestConversations(data.latestMessages);  // Save latest messages
          setUnrepliedMessagesCount(data.unrepliedMessagesCount);  // Save unreplied messages count
        } catch (error) {
          console.error("Error fetching latest conversations:", error);
          setLatestConversations([]);  // Set empty array on error
        }
      }
    };

    const fetchRecentPosts = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/main/recent-posts"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setRecentPosts(data); // Ensure data is an array
        } else {
          setRecentPosts([]); // Set empty array if not
        }
      } catch (error) {
        console.error("Error fetching recent posts:", error);
        setRecentPosts([]);
      }
    };

    fetchLatestConversations();
    fetchRecentPosts();
  }, [currentUser]);

  return (
    <Box flex={2} p={2} sx={{ display: { xs: "none", sm: "block" } }}>
      <Box position="fixed" width={300}>
        <Typography variant="h6" fontWeight={100}>
          Online Friends
        </Typography>
        <AvatarGroup max={7}>
          {/* Your Avatar components here */}
        </AvatarGroup>

        <Typography variant="h6" fontWeight={100} mt={2} mb={2}>
          Latest Posts
        </Typography>
        <ImageList cols={3} rowHeight={100} gap={5}>
          {Array.isArray(recentPosts) && recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <ImageListItem
                key={post._id}
                onClick={() => navigate(`/post/${post._id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={post.cover}
                  alt={`Post cover ${post._id}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </ImageListItem>
            ))
          ) : (
            <Typography variant="body2">No recent posts available</Typography>
          )}
        </ImageList>

        <Typography variant="h6" fontWeight={100} mt={2}>
          Latest Conversations
        </Typography>
        <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
          {latestConversations.length > 0 ? (
            latestConversations.map((message, index) => (
              <React.Fragment key={index}>
                <ListItem
                  alignItems="flex-start"
                  button
                  onClick={() => navigate(`/chat/${message.chatId}`)}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={message.sender.username}
                      src={message.sender.profilePicture || ""}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <div
                        dangerouslySetInnerHTML={{ __html: message.content }}
                        style={{
                          maxWidth: "240px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      />
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: "text.primary", display: "inline" }}
                        >
                          {message.sender.username}
                        </Typography>
                        {" — "}
                        <div
                          dangerouslySetInnerHTML={{ __html: message.content }}
                          style={{
                            maxWidth: "240px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        />
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))
          ) : (
            <Typography variant="body2">No recent conversations</Typography>
          )}
        </List>
        <Typography variant="h6" fontWeight={100} mt={2}>
          Unreplied Messages: {unrepliedMessagesCount} {/* Display unreplied messages count */}
        </Typography>
      </Box>
    </Box>
  );
};
