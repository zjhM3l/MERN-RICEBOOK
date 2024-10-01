import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Stack,
} from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import AvatarGroup from "@mui/material/AvatarGroup";

export const PostComment = ({ postId }) => {
  const [comments, setComments] = useState([]); // 初始化为空数组
  const [loading, setLoading] = useState(true); // 增加loading状态以避免过早渲染

  // Fetch comments from the backend
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/main/getcomments?postId=${postId}`
        );
        const data = await res.json();
        setComments(data.comments || []); // 确保设置为数组，避免 undefined
        setLoading(false);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  if (loading) {
    return <Typography>Loading comments...</Typography>; // 提供加载状态
  }

  if (!comments.length) {
    return <Typography>No comments yet.</Typography>; // 如果没有评论，显示提示
  }

  return (
    <Box>
      {comments.map((comment) => (
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
              {comment.likes?.map((user) => (
                <Avatar key={user._id} src={user.profilePicture} />
              ))}
            </AvatarGroup>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};
