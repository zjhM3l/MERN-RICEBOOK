import { AppBar, Avatar, Badge, Box, IconButton, Menu, MenuItem, styled, TextField, Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import MailIcon from '@mui/icons-material/Mail';
import Notifications from '@mui/icons-material/Notifications';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const Search = styled('div')(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: theme.shape.borderRadius,
  width: '40%',
}));

const Icons = styled(Box)(({ theme }) => ({
  display: 'none',
  gap: '20px',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
  },
}));

const UserBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    display: 'none',
  },
}));

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' } }}>
          RICE BOOK
        </Typography>
        <FacebookIcon sx={{ display: { xs: 'block', sm: 'none' } }} />
        <Search>
          <TextField
            sx={{ color: 'black', width: '100%' }}
            id="filled-search"
            label="Search..."
            type="search"
            variant="filled"
            disabled={!currentUser} // 禁用输入框
          />
        </Search>
        <Icons>
          {currentUser && (
            <>
              <IconButton aria-label="mail" sx={{ color: 'white' }}>
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton aria-label="note" sx={{ color: 'white' }}>
                <Badge badgeContent={4} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </>
          )}
          {/* 头像部分，如果用户存在则显示用户的profilePicture，否则显示默认头像 */}
          <Avatar
            sx={{ width: 30, height: 30 }}
            src={currentUser?.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
            onClick={(e) => setOpen(true)}
          />
        </Icons>
        {!currentUser && ( // 如果没有用户，显示头像和 Guest 文本
          <UserBox onClick={(e) => setOpen(true)}>
            <Avatar
              sx={{ width: 30, height: 30 }}
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            />
            <Typography variant="span">Guest</Typography>
          </UserBox>
        )}
        {currentUser && ( // 如果用户存在，显示用户名
          <UserBox onClick={(e) => setOpen(true)}>
            <Avatar
              sx={{ width: 30, height: 30 }}
              src={currentUser.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
            />
            <Typography variant="span">{currentUser.username}</Typography>
          </UserBox>
        )}
      </StyledToolbar>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        open={open}
        onClose={(e) => setOpen(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {!currentUser ? ( // 如果没有用户，显示 Sign in 和 Sign up
          <>
            <MenuItem component={RouterLink} to="/sign-in">
              Sign in
            </MenuItem>
            <MenuItem component={RouterLink} to="/sign-up">
              Sign up
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem>Profile</MenuItem>
            <MenuItem>My account</MenuItem>
            <MenuItem>Logout</MenuItem>
          </>
        )}
      </Menu>
    </AppBar>
  );
};
