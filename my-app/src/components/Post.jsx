import React, { useState, useRef, useEffect } from "react";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Share from "@mui/icons-material/Share";
import {
  Avatar,
  Badge,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  IconButton,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";
import CropFree from "@mui/icons-material/CropFree";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { updateFollowingSuccess } from "../redux/user/userSlice.js"; // Import the action to update following status
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
}));

export const Post = ({ post, isExpanded, onExpand, onCollapse }) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // Controls card hover animation
  const [isFollowAction, setIsFollowAction] = useState(false); // New: To track if it’s a follow action
  const currentUser = useSelector((state) => state.user.currentUser); // Retrieve the current user
  const [isLiked, setIsLiked] = useState(
    currentUser && post.likes.includes(currentUser._id) // Add null check
  ); // Track like status from backend
  const [likeCount, setLikeCount] = useState(post.likes.length); // Store like count
  const dispatch = useDispatch(); // Get dispatch for updating Redux state
  const pressTimer = useRef(null); // Timer for long press
  const restoreTimer = useRef(null); // Timer for restoring animation
  const [isFollowing, setIsFollowing] = useState(false); // Store current following status
  const [isPressed, setIsPressed] = useState(false); // Track press state to trigger animation
  const navigate = useNavigate(); // Navigate to the post detail page

  useEffect(() => {
    if (currentUser && currentUser.following) {
      const following = currentUser.following.some(
        (f) => f.toString() === post.author._id.toString()
      );
      setIsFollowing(following);
    } else {
      setIsFollowing(false);
    }
  }, [currentUser, post.author._id]);

  const handleExpandClick = (event) => {
    event.stopPropagation(); // Prevent event bubbling to stop card click
    setExpanded(!expanded);
  };

  const handleMouseDown = (event) => {
    event.stopPropagation(); // Prevent event bubbling to stop card click
    setIsPressed(true); // Start animation, trigger avatar enlargement

    pressTimer.current = setTimeout(() => {
      handleFollowToggle(event); // Perform follow/unfollow action
    }, 800); // 800 milliseconds defines long press

    restoreTimer.current = setTimeout(() => {
      setIsPressed(false); // Revert to original size after 800ms
    }, 800); // Timer for restoring animation
  };

  const handleMouseUp = (event) => {
    event.stopPropagation(); // Prevent event bubbling to stop card click
    setIsPressed(false); // Stop animation, revert avatar size

    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }

    if (restoreTimer.current) {
      clearTimeout(restoreTimer.current); // Stop restore timer if mouse is released early
    }
  };

  const handleFollowToggle = async (event) => {
    event.stopPropagation(); // Prevent event bubbling to stop card click
  
    // Add check to ensure user is logged in
    if (!currentUser || currentUser._id === post.author._id) {
      console.log("You cannot follow yourself."); // Log or alert for trying to follow self
      setIsFollowAction(true); // Prevent navigation, handle like a follow action
      return;
    }
  
    try {
      const response = await fetch(
        "http://localhost:3000/api/user/toggleFollow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser._id,
            targetId: post.author._id,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to toggle follow");
      }
  
      const data = await response.json();
  
      // Update currentUser.following in Redux
      dispatch(
        updateFollowingSuccess({
          following: data.following, // Pass the updated following list to Redux
        })
      );
  
      // Update the following state of the target user (if necessary)
      setIsFollowing(
        data.following.some((f) => f.toString() === post.author._id.toString())
      );
  
      setIsFollowAction(true); // Set to true after follow action completes to prevent navigation
    } catch (error) {
      console.error("Error during follow/unfollow:", error);
    }
  };  

  const handleLikeToggle = async (event) => {
    event.stopPropagation(); // Prevent event bubbling to stop card click

    // Add check to ensure user is logged in
    if (!currentUser) {
      console.log("You must be logged in to like a post.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/main/${post._id}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: currentUser._id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle like");
      }

      const data = await response.json();

      // Update the like state and count
      if (isLiked) {
        setLikeCount(likeCount - 1);
      } else {
        setLikeCount(likeCount + 1);
      }

      // Toggle the like state
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error while liking/unliking the post:", error);
    }
  };

  const handleCardClick = () => {
    // Navigate to the detail page when the card is clicked, unless it's a follow action
    if (!isFollowAction) {
      navigate(`/post/${post._id}`);
    } else {
      setIsFollowAction(false); // Reset follow action status
    }
  };

  return (
    <Card
      onClick={handleCardClick} // Add click event
      onMouseEnter={() => setIsHovered(true)} // Enlarge on hover
      onMouseLeave={() => setIsHovered(false)} // Shrink on mouse leave
      sx={{
        margin: 5,
        cursor: "pointer", // Change cursor to pointer
        transition: "transform 0.3s ease, opacity 0.4s ease",
        transform: isHovered ? "scale(1.02)" : "scale(1)", // Control enlarge animation
        opacity: isHovered ? 1 : 0.9,
        width: isExpanded ? "80vw" : "auto",
        height: isExpanded ? "auto" : "fit-content",
        zIndex: isExpanded ? 10 : 1,
        position: isExpanded ? "fixed" : "relative",
        top: isExpanded ? "10%" : "auto",
        left: isExpanded ? "7.5%" : "auto",
        transformOrigin: "center center",
        maxHeight: isExpanded ? "80vh" : "auto",
        overflowY: isExpanded ? "auto" : "visible",
      }}
    >
      <CardHeader
        avatar={
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant={isFollowing ? "dot" : "standard"}
          >
            <Avatar
              sx={{
                bgcolor: red[500],
                transform: isPressed ? "scale(1.2)" : "scale(1)", // Avatar animation
                transition: "transform 0.3s ease-in-out", // Smooth animation
              }}
              aria-label="recipe"
              src={post.author?.profilePicture || ""}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp} // Prevent early mouse leave before long press
            >
              {post.author?.username ? post.author.username[0] : "U"}
            </Avatar>
          </StyledBadge>
        }
        action={
          isExpanded ? (
            <IconButton
              aria-label="close"
              onClick={(event) => {
                event.stopPropagation(); // Prevent event bubbling
                onCollapse();
              }}
            >
              <CloseIcon />
            </IconButton>
          ) : (
            <IconButton
              aria-label="settings"
              onClick={(event) => {
                event.stopPropagation(); // Prevent event bubbling
                onExpand();
              }}
            >
              <CropFree />
            </IconButton>
          )
        }
        title={post.author.username}
        subheader={new Date(post.createdAt).toLocaleDateString()}
      />
      {post.cover && (
        <CardMedia
          component="img"
          height="20%"
          image={post.cover}
          alt={post.title}
        />
      )}
      <CardContent>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            "& img": {
              maxWidth: "100%", // Ensure image max width is 100% without exceeding container
              height: "auto", // Maintain original aspect ratio
              display: "block", // Ensure image is in a block format
              margin: "10px 0", // Add some margin around the image
            },
          }}
          dangerouslySetInnerHTML={{
            __html: expanded ? post.content : `${post.title}...`,
          }}
        />
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="add to favorites"
          onClick={(event) => {
            event.stopPropagation(); // Prevent event bubbling to stop card click
            handleLikeToggle(event); // Pass event object
          }}
        >
          <Checkbox
            icon={
              <Badge
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                color="error"
                badgeContent={likeCount} // Show like count in real time
              >
                <FavoriteBorder />
              </Badge>
            }
            checkedIcon={
              <Badge
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                color="error"
                badgeContent={likeCount} // Show like count in real time
              >
                <Favorite sx={{ color: "red" }} />
              </Badge>
            }
            checked={isLiked} // Control whether the post is liked
          />
        </IconButton>

        <IconButton
          aria-label="share"
          onClick={(event) => {
            event.stopPropagation(); // Prevent event bubbling to stop card click
            // Handle share logic here
          }}
        >
          <Share />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
    </Card>
  );
};
