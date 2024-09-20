import { Avatar, AvatarGroup, Box, Divider, ImageList, ImageListItem, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import React from 'react'

export const Rightbar = () => {
  return (
    <Box 
    flex={2} 
    p={2} 
    sx={{ display: {xs: "none", sm: "block"}}}>
      <Box position='fixed' width={300}>
        <Typography variant='h6' fontWeight={100}>Online Friends</Typography>
        <AvatarGroup max={7}>
          <Avatar alt="Remy Sharp" src="https://cdn.pixabay.com/photo/2023/06/26/02/57/man-8088588_1280.jpg" />
          <Avatar alt="Travis Howard" src="https://cdn.pixabay.com/photo/2019/09/10/01/31/fisherman-4465032_1280.jpg" />
          <Avatar alt="Cindy Baker" src="https://cdn.pixabay.com/photo/2024/08/24/18/49/spurred-turtle-8994997_1280.jpg" />
          <Avatar alt="Agnes Walker" src="https://cdn.pixabay.com/photo/2024/09/03/08/56/dairy-cattle-9018750_1280.jpg" />
          <Avatar alt="Trevor Henderson" src="https://cdn.pixabay.com/photo/2022/11/02/14/47/bird-7565103_1280.jpg" />
          <Avatar alt="Remy Sharp" src="https://cdn.pixabay.com/photo/2023/06/26/02/57/man-8088588_1280.jpg" />
          <Avatar alt="Travis Howard" src="https://cdn.pixabay.com/photo/2019/09/10/01/31/fisherman-4465032_1280.jpg" />
          <Avatar alt="Cindy Baker" src="https://cdn.pixabay.com/photo/2024/08/24/18/49/spurred-turtle-8994997_1280.jpg" />
          <Avatar alt="Agnes Walker" src="https://cdn.pixabay.com/photo/2024/09/03/08/56/dairy-cattle-9018750_1280.jpg" />
          <Avatar alt="Trevor Henderson" src="https://cdn.pixabay.com/photo/2022/11/02/14/47/bird-7565103_1280.jpg" />
        </AvatarGroup>
        
        <Typography variant='h6' fontWeight={100} mt={2} mb={2}>Latest Photos</Typography>
        <ImageList cols={3} rowHeight={100} gap={5}>
          <ImageListItem>
            <img
              src='https://cdn.pixabay.com/photo/2024/09/03/18/03/desert-9019840_1280.jpg'
              alt=''
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src='https://cdn.pixabay.com/photo/2023/10/24/05/08/dog-8337394_640.jpg'
              alt=''
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src='https://cdn.pixabay.com/photo/2024/04/09/22/28/trees-8686902_640.jpg'
              alt=''
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src='https://cdn.pixabay.com/photo/2024/02/20/05/16/hummingbird-8584603_640.jpg'
              alt=''
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src='https://cdn.pixabay.com/photo/2022/12/19/18/01/gingerbread-7666269_640.jpg'
              alt=''
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src='https://cdn.pixabay.com/photo/2024/03/19/19/08/book-8643905_640.jpg'
              alt=''
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src='https://cdn.pixabay.com/photo/2024/05/05/07/41/lizard-8740424_640.jpg'
              alt=''
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src='https://cdn.pixabay.com/photo/2024/08/19/15/01/sunflowers-8980921_640.jpg'
              alt=''
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src='https://cdn.pixabay.com/photo/2024/07/15/21/46/daylily-8897976_640.jpg'
              alt=''
            />
          </ImageListItem>
        </ImageList>

        <Typography variant='h6' fontWeight={100} mt={2}>Latest Conversations</Typography>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="https://cdn.pixabay.com/photo/2023/06/26/02/57/man-8088588_1280.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Brunch this weekend?"
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: 'text.primary', display: 'inline' }}
                  >
                    Ali Connors
                  </Typography>
                  {" — I'll be in your neighborhood doing errands this…"}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Summer BBQ"
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: 'text.primary', display: 'inline' }}
                  >
                    to Scott, Alex, Jennifer
                  </Typography>
                  {" — Wish I could come, but I'm out of town this…"}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Oui Oui"
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: 'text.primary', display: 'inline' }}
                  >
                    Sandra Adams
                  </Typography>
                  {' — Do you have Paris recommendations? Have you ever…'}
                </React.Fragment>
              }
            />
          </ListItem>
        </List>
      </Box>
    </Box>
  )
}
