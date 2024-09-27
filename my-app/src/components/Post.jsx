import React, { useState, useRef, useEffect } from 'react';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Share from '@mui/icons-material/Share';
import { Avatar, Badge, Card, CardActions, CardContent, CardHeader, CardMedia, Checkbox, IconButton, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import CropFree from '@mui/icons-material/CropFree';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';

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

export const Post = ({ post, isExpanded, onExpand, onCollapse }) => {
  const [expanded, setExpanded] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser); // 获取当前用户
  const dispatch = useDispatch(); // 获取 dispatch 用于更新 Redux 状态
  const pressTimer = useRef(null); // 长按计时器
  const restoreTimer = useRef(null); // 动画恢复计时器
  const [isFollowing, setIsFollowing] = useState(false); // 用于存储当前的关注状态
  const [isPressed, setIsPressed] = useState(false); // 用于存储按住状态以触发动画

  useEffect(() => {
    console.log('currentUser.following updated:', currentUser?.following); // 调试输出
    if (currentUser && currentUser.following) {
      const following = currentUser.following.some(f => f.toString() === post.author._id.toString());
      setIsFollowing(following);
    } else {
      setIsFollowing(false);
    }
  }, [currentUser, post.author._id]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleMouseDown = () => {
    setIsPressed(true); // 开始动画，触发头像变大

    pressTimer.current = setTimeout(() => {
      handleFollowToggle(); // 执行关注/取消关注
    }, 800); // 800毫秒定义为长按

    // 在800毫秒时触发最大化
    restoreTimer.current = setTimeout(() => {
      setIsPressed(false); // 在800毫秒后触发恢复到原始大小
    }, 800); // 动画恢复计时
  };

  const handleMouseUp = () => {
    // 停止动画，恢复头像大小
    setIsPressed(false);

    // 清除计时器
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }

    if (restoreTimer.current) {
      clearTimeout(restoreTimer.current); // 如果用户提前松开鼠标，停止动画恢复
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser || currentUser._id === post.author._id) {
      console.log('Cannot follow yourself.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/user/toggleFollow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser._id,
          targetId: post.author._id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle follow');
      }

      const data = await response.json();
      console.log('Follow/unfollow success:', data);

      const updatedFollowing = data.following;
      dispatch({
        type: 'UPDATE_FOLLOWING',
        payload: {
          ...currentUser,
          following: updatedFollowing,
        },
      });

      setIsFollowing(updatedFollowing.some(f => f.toString() === post.author._id.toString()));
    } catch (error) {
      console.error('Error during follow/unfollow:', error);
    }
  };

  return (
    <Card
      sx={{
        margin: 5,
        transition: 'transform 0.4s ease, opacity 0.4s ease',
        transform: isExpanded ? 'scale(1.05)' : 'scale(1)',
        opacity: isExpanded ? 1 : 0.9,
        width: isExpanded ? '80vw' : 'auto',
        height: isExpanded ? 'auto' : 'fit-content',
        zIndex: isExpanded ? 10 : 1,
        position: isExpanded ? 'fixed' : 'relative',
        top: isExpanded ? '10%' : 'auto',
        left: isExpanded ? '7.5%' : 'auto',
        transformOrigin: 'center center',
        maxHeight: isExpanded ? '80vh' : 'auto',
        overflowY: isExpanded ? 'auto' : 'visible',
      }}
    >
      <CardHeader
        avatar={
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant={isFollowing ? 'dot' : 'standard'}
          >
            <Avatar
              sx={{
                bgcolor: red[500],
                transform: isPressed ? 'scale(1.2)' : 'scale(1)', // 头像的动画效果
                transition: 'transform 0.3s ease-in-out', // 平滑的动画
              }}
              aria-label="recipe"
              src={post.author?.profilePicture || ''}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp} // 防止用户在长按前移开鼠标
            >
              {post.author?.username ? post.author.username[0] : 'U'}
            </Avatar>
          </StyledBadge>
        }
        action={
          isExpanded ? (
            <IconButton aria-label="close" onClick={onCollapse}>
              <CloseIcon />
            </IconButton>
          ) : (
            <IconButton aria-label="settings" onClick={onExpand}>
              <CropFree />
            </IconButton>
          )
        }
        title={post.author.username}
        subheader={new Date(post.createdAt).toLocaleDateString()}
      />
      {post.cover && <CardMedia component="img" height="20%" image={post.cover} alt={post.title} />}
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} dangerouslySetInnerHTML={{ __html: expanded ? post.content : `${post.title}...` }} />
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
                <Favorite sx={{ color: 'red' }} />
              </Badge>
            }
          />
        </IconButton>
        <IconButton aria-label="share">
          <Share />
        </IconButton>
        <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
    </Card>
  );
};
