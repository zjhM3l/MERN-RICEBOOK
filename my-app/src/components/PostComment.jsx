import React, { useEffect, useState } from "react";
import { Box, Avatar, Typography, IconButton, Card, CardContent, CardActions, Stack } from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import AvatarGroup from "@mui/material/AvatarGroup";

export const PostComment = ({ postId, refresh }) => {
  const [comments, setComments] = useState([]); // 初始化为空数组

  // Fetch comments from the backend
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/main/getcomments/${postId}`);
        const data = await res.json();
        setComments(data.comments || []); // 确保即使没有评论，也返回空数组
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId, refresh]); // 当 postId 或 refresh 变化时重新获取评论

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
              p: 2,
              boxShadow: 1,
              borderRadius: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={comment.author.profilePicture} />
              <Typography variant="body1">{comment.author.username}</Typography>
            </Stack>
            <CardContent>
              <Typography variant="body2">{comment.content}</Typography>
            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
              <IconButton>
                <FavoriteBorder />
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
