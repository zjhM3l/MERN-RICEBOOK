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
import { useNavigate } from "react-router-dom"; // 用于导航到帖子详情页

export const Rightbar = () => {
  const [recentPosts, setRecentPosts] = useState([]); // 存储最新带封面的帖子
  const navigate = useNavigate(); // 用于导航

  useEffect(() => {
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
    fetchRecentPosts();
  }, []);

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
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt="Remy Sharp"
                src="https://cdn.pixabay.com/photo/2023/06/26/02/57/man-8088588_1280.jpg"
              />
            </ListItemAvatar>
            <ListItemText
              primary="Finish your homework?"
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: "text.primary", display: "inline" }}
                  >
                    Ali Connors
                  </Typography>
                  {" — Do you want to go to the movies tonight?"}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="RGA BBQ"
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: "text.primary", display: "inline" }}
                  >
                    to Scott, Alex, Jennifer
                  </Typography>
                  {" — Come to the BBQ this weekend!"}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Be sure to check in!"
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: "text.primary", display: "inline" }}
                  >
                    Sandra Adams
                  </Typography>
                  {" — Are you coming to the meeting tomorrow?"}
                </React.Fragment>
              }
            />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};
