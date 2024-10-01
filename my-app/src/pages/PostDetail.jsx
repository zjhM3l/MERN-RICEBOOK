import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Box, createTheme, Stack, ThemeProvider } from "@mui/material";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Rightbar } from "../components/Rightbar";
import { PostDetailMain } from "../components/PostDetailMain";
import { PostComment } from "../components/PostComment";
import { AddComment } from "../components/AddComment";
import { useParams } from "react-router-dom"; // 用于获取路由中的 postId

export const PostDetail = () => {
  const mode = useSelector((state) => state.theme.mode);
  const darkTheme = createTheme({
    palette: {
      mode: mode,
    },
  });

  const { postId } = useParams(); // 从路由中获取 postId
  const [refreshComments, setRefreshComments] = useState(false);

  // 评论成功后的回调函数，用于刷新评论区
  const handleCommentSuccess = () => {
    setRefreshComments(!refreshComments); // 触发刷新
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box bgcolor={"background.default"} color={"text.primary"}>
        <Navbar />
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Sidebar />
          <Stack
            direction="column"
            spacing={2}
            bgcolor="background.default"
            color="text.primary"
            minHeight="100vh"
            display="flex"
            flex={4}
            p={2}
          >
            <PostDetailMain postId={postId} /> {/* 传递 postId */}
            <AddComment postId={postId} onCommentSuccess={handleCommentSuccess} /> {/* 传递 postId 和回调函数 */}
            <PostComment postId={postId} refresh={refreshComments} /> {/* 传递 postId 和刷新状态 */}
          </Stack>
          <Rightbar />
        </Stack>
      </Box>
    </ThemeProvider>
  );
};
