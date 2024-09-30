import {
  Avatar,
  AvatarGroup,
  Box,
  Divider,
  ImageList,
  ImageListItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // 用于导航到帖子详情页

export const Rightbar = () => {
  const [latestConversations, setLatestConversations] = useState([]);  // Store latest messages
  const currentUser = useSelector((state) => state.user.currentUser);  // Get current user from Redux
  const [recentPosts, setRecentPosts] = useState([]); // 存储最新带封面的帖子
  const navigate = useNavigate(); // 用于导航

  useEffect(() => {
    const fetchLatestConversations = async () => {
      if (currentUser) {
        try {
          const response = await fetch(`http://localhost:3000/api/user/latest-conversations/${currentUser._id}`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setLatestConversations(data);  // Store the latest messages
        } catch (error) {
          console.error("Error fetching latest conversations:", error);
          setLatestConversations([]);  // Set to empty array in case of error
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
        console.log("Recent posts:", data);

        if (Array.isArray(data)) {
          setRecentPosts(data); // 确保 data 是数组后进行设置
        } else {
          setRecentPosts([]); // 如果 data 不是数组，设置为空数组
        }
      } catch (error) {
        console.error("Error fetching recent posts:", error);
        setRecentPosts([]); // 出现错误时，设置为空数组
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
          <Avatar
            alt="Remy Sharp"
            src="https://cdn.pixabay.com/photo/2023/06/26/02/57/man-8088588_1280.jpg"
          />
          <Avatar
            alt="Travis Howard"
            src="https://cdn.pixabay.com/photo/2019/09/10/01/31/fisherman-4465032_1280.jpg"
          />
          <Avatar
            alt="Cindy Baker"
            src="https://cdn.pixabay.com/photo/2024/08/24/18/49/spurred-turtle-8994997_1280.jpg"
          />
          <Avatar
            alt="Agnes Walker"
            src="https://cdn.pixabay.com/photo/2024/09/03/08/56/dairy-cattle-9018750_1280.jpg"
          />
          <Avatar
            alt="Trevor Henderson"
            src="https://cdn.pixabay.com/photo/2022/11/02/14/47/bird-7565103_1280.jpg"
          />
          <Avatar
            alt="Remy Sharp"
            src="https://cdn.pixabay.com/photo/2023/06/26/02/57/man-8088588_1280.jpg"
          />
          <Avatar
            alt="Travis Howard"
            src="https://cdn.pixabay.com/photo/2019/09/10/01/31/fisherman-4465032_1280.jpg"
          />
          <Avatar
            alt="Cindy Baker"
            src="https://cdn.pixabay.com/photo/2024/08/24/18/49/spurred-turtle-8994997_1280.jpg"
          />
          <Avatar
            alt="Agnes Walker"
            src="https://cdn.pixabay.com/photo/2024/09/03/08/56/dairy-cattle-9018750_1280.jpg"
          />
          <Avatar
            alt="Trevor Henderson"
            src="https://cdn.pixabay.com/photo/2022/11/02/14/47/bird-7565103_1280.jpg"
          />
        </AvatarGroup>

        <Typography variant="h6" fontWeight={100} mt={2} mb={2}>
          Latest Posts
        </Typography>

        {/* 显示最近的封面图片，没有标题和滚动条，一行最多显示三个 */}
        <ImageList cols={3} rowHeight={100} gap={5}>
          {Array.isArray(recentPosts) && recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <ImageListItem
                key={post._id}
                onClick={() => navigate(`/post/${post._id}`)} // 点击帖子后跳转详情页
                style={{ cursor: "pointer" }}
              >
                <img
                  src={post.cover}
                  alt={`Post cover ${post._id}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} // 图片等比例填充
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
                <ListItem alignItems="flex-start" button onClick={() => navigate(`/chat/${message.chatId}`)}>
                  <ListItemAvatar>
                    <Avatar alt={message.sender.username} src={message.sender.profilePicture || ''} />
                  </ListItemAvatar>
                  <ListItemText
                    // Render the Quill content using dangerouslySetInnerHTML
                    primary={
                      <div
                        dangerouslySetInnerHTML={{ __html: message.content }}
                        style={{ maxWidth: "240px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
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
                          style={{ maxWidth: "240px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
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
      </Box>
    </Box>
  );
};
