import React, { useEffect, useState } from 'react';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Share from '@mui/icons-material/Share';
import { Avatar, Badge, Card, CardActions, CardContent, CardHeader, CardMedia, Checkbox, IconButton, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import CropFree from '@mui/icons-material/CropFree';

export const Post = ({ isExpanded, onExpand, onCollapse }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (isExpanded) {
      // 获取当前的滚动位置并记录
      setScrollPosition(window.scrollY);
    }
  }, [isExpanded]);

  return (
    <Card
      sx={{
        margin: 5,
        transition: "transform 0.4s ease, opacity 0.4s ease",
        transform: isExpanded ? "scale(1.05)" : "scale(1)", // 放大缩小
        opacity: isExpanded ? 1 : 0.9, // 提升视觉效果
        width: isExpanded ? "80vw" : "auto",  // 限制最大宽度为视口的80%
        height: isExpanded ? "auto" : "fit-content", // 自动调整高度
        zIndex: isExpanded ? 10 : 1,
        position: isExpanded ? 'fixed' : 'relative',  // 使用 fixed 以确保在视口中居中
        top: isExpanded ? '10%' : 'auto',
        left: isExpanded ? '7.5%' : 'auto',
        transformOrigin: 'center center', // 确保从中心缩放
        maxHeight: isExpanded ? "80vh" : "auto",  // 限制最大高度为视口高度的80%
        overflowY: isExpanded ? 'auto' : 'visible', // 如果内容过长，可以滚动
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            J.Z.
          </Avatar>
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
        title="COMP531 Test of Frontend"
        subheader="September 19, 2024"
      />
      <CardMedia
        component="img"
        height="20%"
        image="https://cdn.pixabay.com/photo/2024/09/05/15/13/vietnam-9025183_1280.jpg"
        alt="test img"
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          This is a test post for COMP531 Frontend Development. This is a test post for COMP531 Frontend Development.
        </Typography>
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
      </CardActions>
    </Card>
  );
};
