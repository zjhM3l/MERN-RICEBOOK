import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import React from 'react'
import Article from '@mui/icons-material/Article';
import Settings from '@mui/icons-material/Settings';
import NightsStay from '@mui/icons-material/NightsStay';

export const SidebarGuest = ({mode,setMode}) => {
    const [open, setOpen] = React.useState(false);
  
    const handleClick = () => {
      setOpen(!open);
    };
  
    return (
      <Box flex={1} p={2} sx={{ display: {xs: "none", sm: "block"}}}>
        <Box position='fixed'>
          <List>
              <ListItem disablePadding>
                <ListItemButton component="a" href='#home'>
                  <ListItemIcon>
                    <HomeIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Homepage" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component="a" href='#pages'>
                  <ListItemIcon>
                    <Article/>
                  </ListItemIcon>
                  <ListItemText primary="Pages" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component="a" href='#settings'>
                  <ListItemIcon>
                    <Settings/>
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <NightsStay/>
                  </ListItemIcon>
                  <Switch onChange={e=>setMode(mode === "light" ? "dark" : "light")}/>
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
      </Box>
    )
  }
  