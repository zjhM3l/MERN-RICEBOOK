import React, { useEffect, useState, useRef } from 'react';
import { Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemIcon, Divider, IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import SwipeRightAltIcon from '@mui/icons-material/SwipeRightAlt';
import SwipeLeftAltIcon from '@mui/icons-material/SwipeLeftAlt';
import SendIcon from '@mui/icons-material/Send';  // 导入发送按钮
import { useNavigate } from 'react-router-dom';  // 导入 useNavigate
import { updateFollowingSuccess } from '../redux/user/userSlice.js';

// FriendListItem component
const FriendListItem = ({ friend, icon, onFollowToggle, onChatClick }) => {
  const pressTimerRef = useRef(null);
  const restoreTimerRef = useRef(null);
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
    pressTimerRef.current = setTimeout(() => {
      onFollowToggle(friend._id);
    }, 800);
    restoreTimerRef.current = setTimeout(() => {
      setIsPressed(false);
    }, 800);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    clearTimeout(pressTimerRef.current);
    clearTimeout(restoreTimerRef.current);
  };

  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <Avatar
            src={friend.profilePicture || ''}
            sx={{
              transform: isPressed ? "scale(1.2)" : "scale(1)",
              transition: "transform 0.3s ease-in-out",
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </ListItemAvatar>
        <ListItemText primary={friend.username} secondary={`${new Date(friend.dateOfBirth).toLocaleDateString()}`} />
        <ListItemIcon>{icon}</ListItemIcon>

        {/* 添加聊天按钮 */}
        <IconButton onClick={() => onChatClick(friend._id)}>
          <SendIcon color="primary" />
        </IconButton>
      </ListItem>
      <Divider variant="fullWidth" />
    </>
  );
};

export const FriendMain = () => {
  const [friends, setFriends] = useState({
    oneWayFollowings: [],
    mutualFollowings: [],
    followersNotFollowingBack: [],
  });

  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();  // 用于跳转

  useEffect(() => {
    const fetchFriends = async () => {
      if (currentUser) {
        try {
          const response = await fetch(`http://localhost:3000/api/user/${currentUser._id}/friends`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          const data = await response.json();
          setFriends(data);
        } catch (error) {
          console.error("Failed to fetch friends:", error);
        }
      }
    };
    fetchFriends();
  }, [currentUser]);

  const handleFollowToggle = async (friendId) => {
    try {
      const response = await fetch("http://localhost:3000/api/user/toggleFollow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id, targetId: friendId }),
      });
      if (!response.ok) throw new Error("Failed to toggle follow");
      const data = await response.json();
      dispatch(updateFollowingSuccess({ following: data.following }));
    } catch (error) {
      console.error("Error during follow/unfollow:", error);
    }
  };

  const handleChatClick = async (friendId) => {
    try {
      const response = await fetch("http://localhost:3000/api/user/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id, targetId: friendId }),
      });

      const chat = await response.json();
      // 跳转到聊天界面
      navigate(`/chat/${chat._id}`);
    } catch (error) {
      console.error("Error entering chat room:", error);
    }
  };

  return (
    <Box flex={4} p={2} bgcolor="background.default" color="text.primary">
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {friends.mutualFollowings.length > 0 && friends.mutualFollowings.map((friend) => (
          <FriendListItem
            key={friend._id}
            friend={friend}
            icon={<SyncAltIcon color="primary" />}
            onFollowToggle={handleFollowToggle}
            onChatClick={handleChatClick}  // 点击聊天按钮时执行
          />
        ))}
        {friends.oneWayFollowings.length > 0 && friends.oneWayFollowings.map((friend) => (
          <FriendListItem
            key={friend._id}
            friend={friend}
            icon={<SwipeRightAltIcon color="primary" />}
            onFollowToggle={handleFollowToggle}
            onChatClick={handleChatClick}
          />
        ))}
        {friends.followersNotFollowingBack.length > 0 && friends.followersNotFollowingBack.map((follower) => (
          <FriendListItem
            key={follower._id}
            friend={follower}
            icon={<SwipeLeftAltIcon color="primary" />}
            onFollowToggle={handleFollowToggle}
            onChatClick={handleChatClick}
          />
        ))}
      </List>
    </Box>
  );
};
