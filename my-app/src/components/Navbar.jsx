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
import { signOutSuccess } from "../redux/user/userSlice.js";
import { useLocation } from "react-router-dom";

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
  const [unrepliedMessagesCount, setUnrepliedMessagesCount] = useState(0); // 未回复消息的数量
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(signOutSuccess());

    fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      credentials: "include", // 以便清除session
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to log out");
        }
        console.log("Logout successful, redirecting...");
        navigate("/home");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  // Fetch unreplied messages count from the backend
  useEffect(() => {
    const fetchUnrepliedMessagesCount = async () => {
      if (currentUser) {
        try {
          const response = await fetch(`http://localhost:3000/api/user/latest-conversations/${currentUser._id}`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setUnrepliedMessagesCount(data.unrepliedMessagesCount); // 更新未回复消息的数量
        } catch (error) {
          console.error("Error fetching unreplied messages count:", error);
        }
      }
    };

    fetchUnrepliedMessagesCount();
  }, [currentUser]); // 当 currentUser 改变时重新获取消息数量

  useEffect(() => {
    if (
      !currentUser &&
      location.pathname !== "/sign-in" &&
      location.pathname !== "/sign-up"
    ) {
      navigate("/home");
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
            disabled={!currentUser}
          />
        </Search>
        <Icons>
          {currentUser && (
            <>
              <IconButton aria-label="mail" sx={{ color: "white" }}>
                <Badge badgeContent={unrepliedMessagesCount} color="error"> {/* 使用未读消息数量 */}
                  <MailIcon />
                </Badge>
              </IconButton>
              {/* <IconButton aria-label="note" sx={{ color: "white" }}>
                <Badge badgeContent={unrepliedMessagesCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton> */}
            </>
          )}
          <Avatar
            sx={{ width: 30, height: 30 }}
            src={
              currentUser?.profilePicture ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            onClick={(e) => setOpen(true)}
          />
        </Icons>
        {!currentUser && (
          <UserBox onClick={(e) => setOpen(true)}>
            <Avatar
              sx={{ width: 30, height: 30 }}
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            />
            <Typography variant="span">Guest</Typography>
          </UserBox>
        )}
        {currentUser && (
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
        {!currentUser ? (
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
