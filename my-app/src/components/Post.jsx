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
import { updateFollowingSuccess } from "../redux/user/userSlice.js"; // 导入新的 action
import { useNavigate } from "react-router-dom"; // 导入 useNavigate 进行导航

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
  const [isHovered, setIsHovered] = useState(false); // 控制卡片放大动画
  const [isFollowAction, setIsFollowAction] = useState(false); // 新增：用于标记是否是关注操作
  const currentUser = useSelector((state) => state.user.currentUser); // 获取当前用户
  const [isLiked, setIsLiked] = useState(
    currentUser && post.likes.includes(currentUser._id) // 添加 null 检查
  ); // 通过后端获取的点赞状态
  const [likeCount, setLikeCount] = useState(post.likes.length); // 用于存储点赞次数
  const dispatch = useDispatch(); // 获取 dispatch 用于更新 Redux 状态
  const pressTimer = useRef(null); // 长按计时器
  const restoreTimer = useRef(null); // 动画恢复计时器
  const [isFollowing, setIsFollowing] = useState(false); // 用于存储当前的关注状态
  const [isPressed, setIsPressed] = useState(false); // 用于存储按住状态以触发动画
  const navigate = useNavigate(); // 导航到详情页面

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
    event.stopPropagation(); // 阻止事件冒泡，防止触发卡片点击
    setExpanded(!expanded);
  };

  const handleMouseDown = (event) => {
    event.stopPropagation(); // 阻止事件冒泡，防止触发卡片点击
    setIsPressed(true); // 开始动画，触发头像变大

    pressTimer.current = setTimeout(() => {
      handleFollowToggle(event); // 执行关注/取消关注
    }, 800); // 800毫秒定义为长按

    restoreTimer.current = setTimeout(() => {
      setIsPressed(false); // 在800毫秒后触发恢复到原始大小
    }, 800); // 动画恢复计时
  };

  const handleMouseUp = (event) => {
    event.stopPropagation(); // 阻止事件冒泡，防止触发卡片点击
    setIsPressed(false); // 停止动画，恢复头像大小

    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }

    if (restoreTimer.current) {
      clearTimeout(restoreTimer.current); // 如果用户提前松开鼠标，停止动画恢复
    }
  };

  const handleFollowToggle = async (event) => {
    event.stopPropagation(); // 阻止事件冒泡，防止触发卡片点击
  
    // 添加检查，确保用户已登录
    if (!currentUser || currentUser._id === post.author._id) {
      console.log("You cannot follow yourself."); // Log or alert for trying to follow self
      setIsFollowAction(true); // 防止跳转，和关注别人一样
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
  
      // 更新 Redux 中的 currentUser.following
      dispatch(
        updateFollowingSuccess({
          following: data.following, // 将新的 following 列表传递给 Redux
        })
      );
  
      // 更新目标用户的粉丝数或状态（如果需要）
      setIsFollowing(
        data.following.some((f) => f.toString() === post.author._id.toString())
      );
  
      setIsFollowAction(true); // 关注操作完成后设置为true，防止跳转
    } catch (error) {
      console.error("Error during follow/unfollow:", error);
    }
  };  

  const handleLikeToggle = async (event) => {
    event.stopPropagation(); // 阻止事件冒泡，防止触发卡片点击

    // 添加检查，确保用户已登录
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
    // 点击卡片时导航到详情页，只有当 isFollowAction 为 false 时才跳转
    if (!isFollowAction) {
      navigate(`/post/${post._id}`);
    } else {
      setIsFollowAction(false); // 重置关注操作状态
    }
  };

  return (
    <Card
      onClick={handleCardClick} // 添加点击事件
      onMouseEnter={() => setIsHovered(true)} // 鼠标悬停时放大
      onMouseLeave={() => setIsHovered(false)} // 鼠标离开时缩小
      sx={{
        margin: 5,
        cursor: "pointer", // 鼠标变成手型
        transition: "transform 0.3s ease, opacity 0.4s ease",
        transform: isHovered ? "scale(1.02)" : "scale(1)", // 控制放大动画
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
                transform: isPressed ? "scale(1.2)" : "scale(1)", // 头像的动画效果
                transition: "transform 0.3s ease-in-out", // 平滑的动画
              }}
              aria-label="recipe"
              src={post.author?.profilePicture || ""}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp} // 防止用户在长按前移开鼠标
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
                event.stopPropagation(); // 阻止事件冒泡
                onCollapse();
              }}
            >
              <CloseIcon />
            </IconButton>
          ) : (
            <IconButton
              aria-label="settings"
              onClick={(event) => {
                event.stopPropagation(); // 阻止事件冒泡
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
              maxWidth: "100%", // 设置图片最大宽度为100%，不会超出容器
              height: "auto", // 保持图片的原始比例
              display: "block", // 确保图片占据单独一行
              margin: "10px 0", // 给图片加一点上下边距
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
            event.stopPropagation(); // 阻止事件冒泡，防止触发卡片点击
            handleLikeToggle(event); // 传递事件对象
          }}
        >
          <Checkbox
            icon={
              <Badge
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                color="error"
                badgeContent={likeCount} // 实时显示点赞数量
              >
                <FavoriteBorder />
              </Badge>
            }
            checkedIcon={
              <Badge
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                color="error"
                badgeContent={likeCount} // 实时显示点赞数量
              >
                <Favorite sx={{ color: "red" }} />
              </Badge>
            }
            checked={isLiked} // 控制是否已点赞
          />
        </IconButton>

        <IconButton
          aria-label="share"
          onClick={(event) => {
            event.stopPropagation(); // 阻止事件冒泡，防止触发卡片点击
            // 处理分享功能的逻辑
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
