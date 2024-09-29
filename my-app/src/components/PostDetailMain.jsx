import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // 用于获取路由中的 postId 参数
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

// 自定义样式的 Badge，带有瞬间动画的 ripple 效果
const StyledBadge = styled(Badge)(({ theme, triggerAnimation }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#fff",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    animation: triggerAnimation ? "ripple 0.8s ease-in-out" : "none", // 只在触发时播放动画
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      // border: '1px solid currentColor',
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
  const { postId } = useParams(); // 获取 postId 参数
  const [post, setPost] = useState(null); // 保存帖子数据
  const [loading, setLoading] = useState(true); // 控制加载状态
  const [error, setError] = useState(null); // 保存错误信息
  const [isLiked, setIsLiked] = useState(false); // 控制点赞状态
  const [triggerAnimation, setTriggerAnimation] = useState(false); // 控制动画的状态
  const currentUser = useSelector((state) => state.user.currentUser); // 当前用户

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/main/${postId}`
        );
        const data = await response.json();
        setPost(data);
        setIsLiked(data.likes.includes(currentUser._id)); // 检查用户是否已经点赞
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, currentUser._id]);

  const handleLike = async () => {
    try {
      await fetch(`http://localhost:3000/api/main/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser._id }),
      });

      setIsLiked(!isLiked); // 切换点赞状态
      setTriggerAnimation(true); // 触发动画

      // 短暂显示动画后停止
      setTimeout(() => {
        setTriggerAnimation(false);
      }, 800);

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
    return <CircularProgress sx={{ display: "block", margin: "auto" }} />; // 显示加载中状态
  if (error) return <Typography color="error">Error: {error}</Typography>; // 显示错误信息

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
          subheader={new Date(post.createdAt).toLocaleDateString()} // 显示发布日期
        />
        {/* 如果有封面图片则显示 */}
        {post.cover && (
          <CardMedia
            component="img"
            height="auto"
            image={post.cover}
            alt={post.title}
            sx={{
              width: "100%",
              maxWidth: "100%", // 控制封面图片宽度不超出页面
              objectFit: "contain", // 保持图片比例
              marginBottom: 2,
            }}
          />
        )}
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            {post.title}
          </Typography>
          {/* 帖子内容 */}
          <Typography
            variant="body1"
            color="text.secondary"
            dangerouslySetInnerHTML={{ __html: post.content }}
            sx={{
              mb: 2,
              "& img": {
                maxWidth: "100%", // 确保 Quill 内容中的图片不会超出页面宽度
                height: "auto", // 保持图片原始比例
                display: "block", // 确保图片独占一行
                margin: "10px 0", // 给图片增加上下间距
              },
            }}
          />
          {/* 其他信息：浏览次数、点赞次数 */}
          <Stack
            direction="row"
            spacing={4}
            justifyContent="space-between"
            alignItems="center"
          >
            {/* 浏览次数 */}
            <IconButton>
              <StyledBadge
                badgeContent={post.views || 0} // 显示浏览次数
                color="primary"
              >
                <RemoveRedEyeIcon />
              </StyledBadge>
            </IconButton>

            {/* 点赞次数 */}
            <IconButton onClick={handleLike}>
              <StyledBadge
                badgeContent={post.likes.length} // 显示点赞次数
                color="secondary"
                triggerAnimation={triggerAnimation} // 动画触发状态
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
