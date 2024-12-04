import { useLocation, Link } from "react-router-dom"; // Import useLocation and Link
import { ExpandLess, ExpandMore, Home } from "@mui/icons-material";
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import React from "react";
import Article from "@mui/icons-material/Article";
import People from "@mui/icons-material/People";
import Person from "@mui/icons-material/Person";
import Filter from "@mui/icons-material/Filter";
import Favorite from "@mui/icons-material/Favorite";
import Camera from "@mui/icons-material/Camera";
import Settings from "@mui/icons-material/Settings";
import AccountBox from "@mui/icons-material/AccountBox";
import NightsStay from "@mui/icons-material/NightsStay";
import { useDispatch, useSelector } from "react-redux";
import { toggleMode } from "../redux/theme/themeSlice";

export const Sidebar = ({ setFeedToLiked, setFeedToMoments, setFeedToDefault }) => {
  const [open, setOpen] = React.useState(false);
  const { currentUser } = useSelector((state) => state.user); // Get the current user state from Redux
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  // Get the current page path
  const location = useLocation();

  const handleClick = () => {
    setOpen(!open);
  };

  // Determine if we are on the Home page
  const isHomePage = location.pathname === "/";

  return (
    <Box flex={1} p={2} sx={{ display: { xs: "none", sm: "block" } }}>
      <Box position="fixed">
        <List>
          {/* Homepage button - resets the feed to show all posts if on home, else navigates to home */}
          <ListItem disablePadding>
            {isHomePage ? (
              <ListItemButton onClick={() => setFeedToDefault && setFeedToDefault()}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Homepage" />
              </ListItemButton>
            ) : (
              <ListItemButton component={Link} to="/">
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Homepage" />
              </ListItemButton>
            )}
          </ListItem>

          {currentUser && (
            <>
              {/* <ListItem disablePadding>
                <ListItemButton component={Link} to="/groups">
                  <ListItemIcon>
                    <People />
                  </ListItemIcon>
                  <ListItemText primary="Groups" />
                </ListItemButton>
              </ListItem> */}
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/friend">
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary="Friends" />
                </ListItemButton>
              </ListItem>
              {/* Conditionally render filters only if on the Home page */}
              {!location.pathname.startsWith("/post/") && isHomePage && currentUser && (
                <>
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleClick}>
                      <ListItemIcon>
                        <Filter />
                      </ListItemIcon>
                      <ListItemText primary="Filters" />
                      {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItem disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => setFeedToLiked(true)}> {/* Show liked posts */}
                          <ListItemIcon>
                            <Favorite />
                          </ListItemIcon>
                          <ListItemText primary="Liked" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => setFeedToMoments(true)}> {/* Show moments */}
                          <ListItemIcon>
                            <Camera />
                          </ListItemIcon>
                          <ListItemText primary="Moments" />
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </Collapse>
                </>
              )}
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/profile">
                  <ListItemIcon>
                    <AccountBox />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>
            </>
          )}
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <NightsStay />
              </ListItemIcon>
              <Switch
                checked={mode === "dark"}
                onChange={() => dispatch(toggleMode())} // Toggle between dark and light mode
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};
