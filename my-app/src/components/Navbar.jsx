import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  styled,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import MailIcon from "@mui/icons-material/Mail";
import Notifications from "@mui/icons-material/Notifications";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { signOutSuccess } from "../redux/user/userSlice.js"; // 导入 signOutSuccess action
import { useLocation } from "react-router-dom"; // 导入 useLocation

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const Search = styled("div")(({ theme }) => ({
  backgroundColor: "white",
  borderRadius: theme.shape.borderRadius,
  width: "40%",
}));

const Icons = styled(Box)(({ theme }) => ({
  display: "none",
  gap: "20px",
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    display: "flex",
  },
}));

const UserBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "10px",
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 使用 navigate 进行页面跳转
  const location = useLocation(); // 获取当前页面 URL

  const handleLogout = () => {
    // 触发 Redux 中的 signOutSuccess
    dispatch(signOutSuccess());

    // 可选择调用后端的登出API，假设有需要
    fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      credentials: "include", // 以便清除session
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to log out");
        }
        console.log("Logout successful, redirecting...");
        // 成功登出后，重定向到首页
        navigate("/home");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  // 当用户登出时自动导航到首页，但排除 Sign in 和 Sign up 页面
  useEffect(() => {
    // 如果用户已经登出并且当前不在登录或注册页面，则重定向到首页
    if (
      !currentUser &&
      location.pathname !== "/sign-in" &&
      location.pathname !== "/sign-up"
    ) {
      navigate("/home"); // 或 navigate('/');
    }
  }, [currentUser, location.pathname, navigate]);

  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <Typography variant="h6" sx={{ display: { xs: "none", sm: "block" } }}>
          RICE BOOK
        </Typography>
        <FacebookIcon sx={{ display: { xs: "block", sm: "none" } }} />
        <Search>
          <TextField
            sx={{ color: "black", width: "100%" }}
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
              <IconButton aria-label="mail" sx={{ color: "white" }}>
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton aria-label="note" sx={{ color: "white" }}>
                <Badge badgeContent={4} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </>
          )}
          {/* 头像部分，如果用户存在则显示用户的profilePicture，否则显示默认头像 */}
          <Avatar
            sx={{ width: 30, height: 30 }}
            src={
              currentUser?.profilePicture ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
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
              src={
                currentUser.profilePicture ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
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
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
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
            <MenuItem component={RouterLink} to="/profile">
              Profile
            </MenuItem>
            <MenuItem>My account</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        )}
      </Menu>
    </AppBar>
  );
};
