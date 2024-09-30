import { useLocation, Link } from "react-router-dom"; // 引入 useLocation
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

export const Sidebar = () => {
  const [open, setOpen] = React.useState(false);
  const { currentUser } = useSelector((state) => state.user); // 从 Redux 获取当前用户状态
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  // 获取当前页面路径
  const location = useLocation();

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box flex={1} p={2} sx={{ display: { xs: "none", sm: "block" } }}>
      <Box position="fixed">
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/home">
              {" "}
              {/* Use Link component */}
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Homepage" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/pages">
              {" "}
              {/* Use Link component */}
              <ListItemIcon>
                <Article />
              </ListItemIcon>
              <ListItemText primary="Pages" />
            </ListItemButton>
          </ListItem>

          {/* 如果用户存在，才显示 Groups, Friends, Filters, Profile */}
          {currentUser && (
            <>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/groups">
                  {" "}
                  {/* Use Link component */}
                  <ListItemIcon>
                    <People />
                  </ListItemIcon>
                  <ListItemText primary="Groups" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/friend">
                  {" "}
                  {/* Use Link component */}
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary="Friends" />
                </ListItemButton>
              </ListItem>

              {/* 只在非 PostDetail 页面显示 Filters */}
              {!location.pathname.startsWith("/post/") && (
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
                        <ListItemButton
                          sx={{ pl: 4 }}
                          component={Link}
                          to="/liked"
                        >
                          {" "}
                          {/* Use Link component */}
                          <ListItemIcon>
                            <Favorite />
                          </ListItemIcon>
                          <ListItemText primary="Liked" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          sx={{ pl: 4 }}
                          component={Link}
                          to="/moments"
                        >
                          {" "}
                          {/* Use Link component */}
                          <ListItemIcon>
                            <Camera />
                          </ListItemIcon>
                          <ListItemText primary="Moment" />
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </Collapse>
                </>
              )}
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/profile">
                  {" "}
                  {/* Use Link component */}
                  <ListItemIcon>
                    <AccountBox />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>
            </>
          )}

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/settings">
              {" "}
              {/* Use Link component */}
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <NightsStay />
              </ListItemIcon>
              <Switch
                checked={mode === "dark"}
                onChange={() => dispatch(toggleMode())}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};
