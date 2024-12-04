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
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { signOutSuccess } from "../redux/user/userSlice.js";
import API_BASE_URL from "../config/config";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const Search = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#333" : "white",
  color: theme.palette.mode === "dark" ? "white" : "black", // Adjust text color
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

export const Navbar = ({ setSearchQuery }) => {
  const [open, setOpen] = useState(false);
  const [unrepliedMessagesCount, setUnrepliedMessagesCount] = useState(0); // Count of unreplied messages
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query as the user types
  };

  const handleLogout = () => {
    dispatch(signOutSuccess());
    setSearchQuery(""); // Clear search box content
    fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
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

  useEffect(() => {
    if (!currentUser && location.pathname !== "/sign-in" && location.pathname !== "/sign-up") {
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
            sx={{
              width: "100%",
              "& .MuiInputBase-root": {
                color: "inherit", // Use the parent's text color
              },
              "& .MuiInputLabel-root": {
                color: "inherit", // Use the parent's text color for placeholder
              },
              "& .MuiFilledInput-root": {
                backgroundColor: "inherit", // Match the parent's background color
              },
            }}
            id="filled-search"
            label={currentUser ? "Search..." : "Login to search"} // Dynamic placeholder
            type="search"
            variant="filled"
            onChange={handleSearchChange}
            disabled={!currentUser} // Disable if not logged in
          />
        </Search>
        <Icons>
          {currentUser && (
            <>
              <IconButton aria-label="mail" sx={{ color: "white" }}>
                <Badge badgeContent={unrepliedMessagesCount} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
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
