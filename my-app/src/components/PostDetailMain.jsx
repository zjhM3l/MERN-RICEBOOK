import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Used to retrieve the postId parameter from the route
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
  CircularProgress,
  IconButton,
  Stack,
  Badge,
  Checkbox,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { red } from "@mui/material/colors";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import API_BASE_URL from "../config/config";

// Custom styled Badge with ripple animation effect
const StyledBadge = styled(Badge)(({ theme, triggerAnimation }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#fff",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    animation: triggerAnimation ? "ripple 0.8s ease-in-out" : "none", // Animation triggered when needed
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(1)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export const PostDetailMain = () => {
  const { postId } = useParams(); // Retrieve postId from the URL parameters
  const [post, setPost] = useState(null); // Store post data
  const [loading, setLoading] = useState(true); // Control loading state
  const [error, setError] = useState(null); // Store error messages
  const [isLiked, setIsLiked] = useState(false); // Track like status
  const [triggerAnimation, setTriggerAnimation] = useState(false); // Control like animation state
  const currentUser = useSelector((state) => state.user.currentUser); // Get the current user

  useEffect(() => {
    if (currentUser) {
      const fetchPost = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/main/${postId}`
          );
          const data = await response.json();
          setPost(data);
          setIsLiked(data.likes.includes(currentUser._id)); // Check if the current user has liked the post
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchPost();
    } else {
      setIsLiked(false); // Set like status to false if the user is not logged in
      setLoading(false); // Stop loading
    }
  }, [postId, currentUser]);  

  const handleLike = async () => {
    try {
      await fetch(`${API_BASE_URL}/main/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser._id }),
      });

      setIsLiked(!isLiked); // Toggle like status
      setTriggerAnimation(true); // Trigger the ripple animation

      // Stop the animation after a short delay
      setTimeout(() => {
        setTriggerAnimation(false);
      }, 800);

      // Update the post's likes in the UI
      setPost((prev) => ({
        ...prev,
        likes: isLiked
          ? prev.likes.filter((id) => id !== currentUser._id)
          : [...prev.likes, currentUser._id],
      }));
    } catch (error) {
      console.error("Failed to like the post:", error);
    }
  };

  if (loading)
    return <CircularProgress sx={{ display: "block", margin: "auto" }} />; // Display loading spinner
  if (error) return <Typography color="error">Error: {error}</Typography>; // Display error message

  return (
    <Box
      bgcolor="background.default"
      color="text.primary"
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flex={4}
      p={2}
    >
      <Card sx={{ maxWidth: 800, width: "100%" }}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: red[500] }}
              src={post.author?.profilePicture || ""}
            >
              {post.author.username[0].toUpperCase()}
            </Avatar>
          }
          title={post.author.username}
          subheader={new Date(post.createdAt).toLocaleDateString()} // Display the post creation date
        />
        {/* Display cover image if available */}
        {post.cover && (
          <CardMedia
            component="img"
            height="auto"
            image={post.cover}
            alt={post.title}
            sx={{
              width: "100%",
              maxWidth: "100%", // Ensure the image doesn't exceed the page width
              objectFit: "contain", // Maintain the image's aspect ratio
              marginBottom: 2,
            }}
          />
        )}
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            {post.title}
          </Typography>
          {/* Post content */}
          <Typography
            variant="body1"
            color="text.secondary"
            dangerouslySetInnerHTML={{ __html: post.content }}
            sx={{
              mb: 2,
              "& img": {
                maxWidth: "100%", // Ensure images in the Quill content don't exceed the page width
                height: "auto", // Maintain original image aspect ratio
                display: "block", // Ensure the image takes up its own line
                margin: "10px 0", // Add margin around images
              },
            }}
          />
          {/* Additional info: views and likes */}
          <Stack
            direction="row"
            spacing={4}
            justifyContent="space-between"
            alignItems="center"
          >
            {/* View count */}
            <IconButton>
              <StyledBadge
                badgeContent={post.views || 0} // Display view count
                color="primary"
              >
                <RemoveRedEyeIcon />
              </StyledBadge>
            </IconButton>

            {/* Like count */}
            <IconButton onClick={handleLike}>
              <StyledBadge
                badgeContent={post.likes.length} // Display like count
                color="secondary"
                triggerAnimation={triggerAnimation} // Control like animation
              >
                {isLiked ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </StyledBadge>
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
