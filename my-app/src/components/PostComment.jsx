import React, { useEffect, useState } from "react";
import { Box, Avatar, Typography, IconButton, Card, CardContent, CardActions, Stack, Badge, Checkbox } from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import AvatarGroup from "@mui/material/AvatarGroup";
import { useSelector } from "react-redux";
import API_BASE_URL from "../config/config";

// Helper function to fetch comments
const fetchComments = async (postId, currentUser, setComments, setLikeStates) => {
  try {
    const res = await fetch(`${API_BASE_URL}/main/getcomments/${postId}`);
    const data = await res.json();
    
    // Initialize the like state for each comment
    const initialLikeStates = {};
    data.comments.forEach((comment) => {
      initialLikeStates[comment._id] = {
        likeCount: comment.likes.length,
        isLiked: comment.likes.some((like) => like._id === currentUser?._id) // Check if the current user has liked the comment
      };
    });
    setLikeStates(initialLikeStates);
    setComments(data.comments || []); // Ensure an empty array is returned even if there are no comments
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};

export const PostComment = ({ postId, refresh }) => {
  const [comments, setComments] = useState([]); // Initialize comments as an empty array
  const [likeStates, setLikeStates] = useState({}); // Store the like state of each comment
  const { currentUser } = useSelector((state) => state.user); // Get the current user from Redux

  // Fetch comments when the component is mounted or postId/refresh/currentUser changes
  useEffect(() => {
    fetchComments(postId, currentUser, setComments, setLikeStates);
  }, [postId, refresh, currentUser]); // Re-fetch comments when postId or refresh changes

  const handleLikeToggle = async (commentId) => {
    // Check if the user is logged in
    if (!currentUser) {
      alert("You must be logged in to like a comment.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/likeComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId, userId: currentUser._id }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle like");
      }

      const data = await response.json();

      // Re-fetch comments after updating the like state to ensure the UI reflects the latest state
      fetchComments(postId, currentUser, setComments, setLikeStates);
    } catch (error) {
      console.error("Error while liking/unliking the comment:", error);
    }
  };

  return (
    <Box>
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <Card
            key={comment._id}
            variant="outlined"
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              mb: 2,
              p: 1,  // Adjust overall padding
              boxShadow: 1,
              borderRadius: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={comment.author.profilePicture} />
              <Typography variant="body1">{comment.author.username}</Typography>
            </Stack>
            <CardContent sx={{ paddingBottom: "8px", paddingTop: "4px" }}> {/* Reduce top and bottom padding */}
              <Typography variant="body2">{comment.content}</Typography>
            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "space-between", padding: "4px 8px" }}> {/* Adjust side padding */}
              <IconButton
                aria-label="like comment"
                onClick={() => handleLikeToggle(comment._id)}
                size="small"  // Adjust button size
              >
                <Checkbox
                  icon={
                    <Badge
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      color="error"
                      badgeContent={likeStates[comment._id]?.likeCount || 0}
                    >
                      <FavoriteBorder />
                    </Badge>
                  }
                  checkedIcon={
                    <Badge
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      color="error"
                      badgeContent={likeStates[comment._id]?.likeCount || 0}
                    >
                      <Favorite sx={{ color: "red" }} />
                    </Badge>
                  }
                  checked={likeStates[comment._id]?.isLiked || false} // Ensure the like state is correctly set
                />
              </IconButton>
              <AvatarGroup max={4} spacing="small">
                {comment.likes.map((user) => (
                  <Avatar key={user._id} src={user.profilePicture} />
                ))}
              </AvatarGroup>
            </CardActions>
          </Card>
        ))
      ) : (
        <Typography>No comments available.</Typography> // Message displayed when no comments exist
      )}
    </Box>
  );
};
