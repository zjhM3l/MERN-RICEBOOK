import React from 'react';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Share from '@mui/icons-material/Share';
import { Avatar, Badge, Card, CardActions, CardContent, CardHeader, CardMedia, Checkbox, Icon, IconButton, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import CropFree from '@mui/icons-material/CropFree';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const Post = ({ post, isExpanded, onExpand, onCollapse }) => {
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
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={post.author?.profilePicture || ''}>
            {post.author?.username ? post.author.username[0] : 'U'}
          </Avatar>
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
        title={post.title}
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
        {/* 使用 dangerouslySetInnerHTML 渲染 HTML 内容 */}
        <Typography 
          variant="body2" 
          sx={{ color: 'text.secondary' }} 
          dangerouslySetInnerHTML={{ __html: post.content }} 
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
        <IconButton aria-label="mnore">
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
