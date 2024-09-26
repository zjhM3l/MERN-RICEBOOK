import React, { useState, useRef } from 'react';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Share from '@mui/icons-material/Share';
import { Avatar, Badge, Card, CardActions, CardContent, CardHeader, CardMedia, Checkbox, IconButton, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import CropFree from '@mui/icons-material/CropFree';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import parse, { domToReact } from 'html-react-parser';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';  // 引入 dispatch

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
}));

const truncateHtml = (html, maxLines) => {
  const lines = [];
  let currentLine = '';
  let lineCount = 0;

  const options = {
    replace: ({ name, children }) => {
      if (lineCount >= maxLines) return null;

      if (name === 'br' || name === 'p') {
        lines.push(currentLine);
        currentLine = '';
        lineCount++;
        if (lineCount >= maxLines) return null;
      }

      if (children) {
        const text = domToReact(children, options);
        currentLine += text;
      }

      return null;
    },
  };

  parse(html, options);
  if (currentLine) lines.push(currentLine);

  return lines.join('\n') + (lineCount >= maxLines ? '...' : '');
};

export const Post = ({ post, isExpanded, onExpand, onCollapse }) => {
  const [expanded, setExpanded] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser); // 获取当前用户
  const dispatch = useDispatch();  // 获取 dispatch 用于更新 Redux 状态
  const [isLongPressed, setIsLongPressed] = useState(false);
  const pressTimer = useRef(null);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleMouseDown = () => {
    // 当鼠标按下时，开始长按计时器
    pressTimer.current = setTimeout(() => {
      setIsLongPressed(true);
      handleFollowToggle(); // 执行关注/取消关注
    }, 800); // 800毫秒定义为长按
  };

  const handleMouseUp = () => {
    // 当鼠标松开时，清除长按计时器
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  // 处理关注/取消关注的请求
  const handleFollowToggle = async () => {
    if (!currentUser || currentUser._id === post.author._id) {
        console.log("Cannot follow yourself.");
        return;  // 如果是自己或者未登录，不执行关注/取消关注
    }

    try {
      // 使用fetch发送请求到后端路由
      const response = await fetch('http://localhost:3000/api/user/toggleFollow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser._id,   // 当前用户ID
          targetId: post.author._id, // 帖子作者ID
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle follow');
      }

      const data = await response.json();
      console.log('Follow/unfollow success:', data);

      // 更新 Redux 状态中的 currentUser.following
      const updatedFollowing = data.following;  // 假设返回的数据包含更新后的 following 列表
      dispatch({
        type: 'UPDATE_FOLLOWING',
        payload: updatedFollowing,  // 更新当前用户的 following 列表
      });

    } catch (error) {
      console.error('Error during follow/unfollow:', error);
    }
};

  const isFollowing = currentUser?.following?.some(f => f.email === post.author.email);

  console.log('isFollowing:', isFollowing);


  return (
    <Card
      sx={{
        margin: 5,
        transition: "transform 0.4s ease, opacity 0.4s ease",
        transform: isExpanded ? "scale(1.05)" : "scale(1)", 
        opacity: isExpanded ? 1 : 0.9,
        width: isExpanded ? "80vw" : "auto",
        height: isExpanded ? "auto" : "fit-content",
        zIndex: isExpanded ? 10 : 1,
        position: isExpanded ? 'fixed' : 'relative',
        top: isExpanded ? '10%' : 'auto',
        left: isExpanded ? '7.5%' : 'auto',
        transformOrigin: 'center center',
        maxHeight: isExpanded ? "80vh" : "auto",
        overflowY: isExpanded ? 'auto' : 'visible',
      }}
    >
      <CardHeader
        avatar={
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant={isFollowing ? "dot" : "standard"} // 如果关注了作者，显示绿色光点
          >
            <Avatar
              sx={{ bgcolor: red[500] }}
              aria-label="recipe"
              src={post.author?.profilePicture || ''}
              onMouseDown={handleMouseDown} // 鼠标按下事件
              onMouseUp={handleMouseUp} // 鼠标松开事件
            >
              {post.author?.username ? post.author.username[0] : 'U'}
            </Avatar>
          </StyledBadge>
        }
        action={isExpanded ? (
          <IconButton aria-label="close" onClick={onCollapse}>
            <CloseIcon />
          </IconButton>
        ) : (
          <IconButton aria-label="settings" onClick={onExpand}>
            <CropFree />
          </IconButton>
        )}
        title={post.author.username}
        subheader={new Date(post.createdAt).toLocaleDateString()}
      />
      {post.cover && (
        <CardMedia
          component="img"
          height="20%"
          image={post.cover} // 动态展示封面图片
          alt={post.title}
        />
      )}
      <CardContent>
        <Typography 
          variant="body2" 
          sx={{ color: 'text.secondary' }} 
          dangerouslySetInnerHTML={{ __html: expanded ? post.content : `${post.title}...` }} 
        />
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <Checkbox
            icon={
              <Badge anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} color="red" badgeContent={99}>
                <FavoriteBorder />
              </Badge>
            }
            checkedIcon={
              <Badge anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} color="red" badgeContent={100}>
                <Favorite sx={{ color: "red" }} />
              </Badge>
            }
          />
        </IconButton>
        <IconButton aria-label="share">
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