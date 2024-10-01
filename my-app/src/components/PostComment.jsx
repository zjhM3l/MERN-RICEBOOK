import React, { useEffect, useState } from "react";
import { Box, Avatar, Typography, IconButton, Card, CardContent, CardActions, Stack, Badge, Checkbox } from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import AvatarGroup from "@mui/material/AvatarGroup";
import { useSelector } from "react-redux";

// 提取 fetchComments 方法
const fetchComments = async (postId, currentUser, setComments, setLikeStates) => {
  try {
    const res = await fetch(`http://localhost:3000/api/main/getcomments/${postId}`);
    const data = await res.json();
    
    // 初始化每个评论的点赞状态
    const initialLikeStates = {};
    data.comments.forEach((comment) => {
      initialLikeStates[comment._id] = {
        likeCount: comment.likes.length,
        isLiked: comment.likes.some((like) => like._id === currentUser?._id) // 检查点赞者是否是当前用户
      };
    });
    setLikeStates(initialLikeStates);
    setComments(data.comments || []); // 确保即使没有评论，也返回空数组
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};

export const PostComment = ({ postId, refresh }) => {
  const [comments, setComments] = useState([]); // 初始化为空数组
  const [likeStates, setLikeStates] = useState({}); // 保存每个评论的点赞状态
  const { currentUser } = useSelector((state) => state.user); // 获取当前用户

  // 初始化时获取评论
  useEffect(() => {
    fetchComments(postId, currentUser, setComments, setLikeStates);
  }, [postId, refresh, currentUser]); // 当 postId 或 refresh 变化时重新获取评论

  const handleLikeToggle = async (commentId) => {
    // Check if the user is logged in
    if (!currentUser) {
      alert("You must be logged in to like a comment.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/user/likeComment`, {
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

      // 更新点赞状态后重新获取评论以确保显示最新状态
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
              p: 1,  // 调整整体 padding
              boxShadow: 1,
              borderRadius: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={comment.author.profilePicture} />
              <Typography variant="body1">{comment.author.username}</Typography>
            </Stack>
            <CardContent sx={{ paddingBottom: "8px", paddingTop: "4px" }}> {/* 减少上下 padding */}
              <Typography variant="body2">{comment.content}</Typography>
            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "space-between", padding: "4px 8px" }}> {/* 调整左右 padding */}
              <IconButton
                aria-label="like comment"
                onClick={() => handleLikeToggle(comment._id)}
                size="small"  // 调整按钮大小
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
                  checked={likeStates[comment._id]?.isLiked || false} // 确保点赞状态被正确设置
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
        <Typography>No comments available.</Typography> // 没有评论时显示消息
      )}
    </Box>
  );
};
