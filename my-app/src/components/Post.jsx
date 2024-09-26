import React, { useState } from 'react';
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

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
          dangerouslySetInnerHTML={{ __html: expanded ? post.content : truncateHtml(post.content, 3) }} 
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