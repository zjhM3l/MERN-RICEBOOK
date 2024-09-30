import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';  // Import the back arrow icon
import { useNavigate } from 'react-router-dom';  // For navigation
import { useSelector } from 'react-redux';

export const FriendSidebar = () => {
  const [friends, setFriends] = useState({
    oneWayFollowings: [],
    mutualFollowings: [],
    followersNotFollowingBack: [],
  });

  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();  // Navigation hook

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

  const handleChatClick = async (friendId) => {
    try {
      const response = await fetch("http://localhost:3000/api/user/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id, targetId: friendId }),
      });

      const chat = await response.json();
      // Navigate to the chat room for this user
      navigate(`/chat/${chat._id}`);
    } catch (error) {
      console.error("Error entering chat room:", error);
    }
  };

  return (
    <Box
      flex={1}
      p={2}
      sx={{ display: { xs: "block", sm: "block" } }}
      bgcolor="background.paper"
      overflow="auto"
      maxHeight="85vh"
    >
      {/* Back button at the top */}
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate('/friend')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">Friends</Typography>
      </Box>

      {/* Friends List */}
      <List>
        {friends.mutualFollowings.length > 0 && friends.mutualFollowings.map((friend) => (
          <React.Fragment key={friend._id}>
            <ListItem button onClick={() => handleChatClick(friend._id)}> {/* Avatar click navigates to chat */}
              <ListItemAvatar>
                <Avatar src={friend.profilePicture || ''} />
              </ListItemAvatar>
              
              {/* Only show text on screens larger than xs */}
              <ListItemText 
                primary={friend.username} 
                sx={{ display: { xs: 'none', sm: 'block' } }} 
              />
            </ListItem>
            <Divider variant="fullWidth" />
          </React.Fragment>
        ))}

        {friends.oneWayFollowings.length > 0 && friends.oneWayFollowings.map((friend) => (
          <React.Fragment key={friend._id}>
            <ListItem button onClick={() => handleChatClick(friend._id)}> {/* Avatar click navigates to chat */}
              <ListItemAvatar>
                <Avatar src={friend.profilePicture || ''} />
              </ListItemAvatar>
              
              <ListItemText 
                primary={friend.username} 
                sx={{ display: { xs: 'none', sm: 'block' } }} 
              />
            </ListItem>
            <Divider variant="fullWidth" />
          </React.Fragment>
        ))}

        {friends.followersNotFollowingBack.length > 0 && friends.followersNotFollowingBack.map((follower) => (
          <React.Fragment key={follower._id}>
            <ListItem button onClick={() => handleChatClick(follower._id)}> {/* Avatar click navigates to chat */}
              <ListItemAvatar>
                <Avatar src={follower.profilePicture || ''} />
              </ListItemAvatar>
              
              <ListItemText 
                primary={follower.username} 
                sx={{ display: { xs: 'none', sm: 'block' } }} 
              />
            </ListItem>
            <Divider variant="fullWidth" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};
