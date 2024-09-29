import React, { useState } from "react";
import { Box, createTheme, Stack, ThemeProvider } from "@mui/material";
import { Sidebar } from "../components/Sidebar";
import { Rightbar } from "../components/Rightbar";
import { Feed } from "../components/Feed";
import { Navbar } from "../components/Navbar";
import { Add } from "../components/Add";
import { useSelector } from "react-redux";

export const Home = () => {
  const mode = useSelector((state) => state.theme.mode);
  const [feedKey, setFeedKey] = useState(0); // 用于强制刷新 Feed

  // 定义刷新 Feed 的函数
  const refreshFeed = () => {
    setFeedKey((prevKey) => prevKey + 1); // 通过更新 key 强制 Feed 重新加载
  };

  const darkTheme = createTheme({
    palette: {
      mode: mode,
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Box bgcolor={"background.default"} color={"text.primary"}>
        <Navbar />
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Sidebar />
          <Feed key={feedKey} /> {/* 根据 key 刷新 Feed */}
          <Rightbar />
        </Stack>
        <Add onPostSuccess={refreshFeed} /> {/* 将刷新函数传递给 Add */}
      </Box>
    </ThemeProvider>
  );
};
