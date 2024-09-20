import React from 'react'
import Favorite from '@mui/icons-material/Favorite'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import MoreVert from '@mui/icons-material/MoreVert'
import Share from '@mui/icons-material/Share'
import { Avatar, Badge, Card, CardActions, CardContent, CardHeader, CardMedia, Checkbox, IconButton, Typography } from '@mui/material'
import { red } from '@mui/material/colors'

export const Post = () => {
  return (
    <Card sx={{margin:5}}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              J.Z.
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVert />
            </IconButton>
          }
          title="COMP531 Test of Frontend"
          subheader="September 19, 2024"
        />
        <CardMedia
          component="img"
          height="20%"
          image="https://cdn.pixabay.com/photo/2024/09/05/15/13/vietnam-9025183_1280.jpg"
          alt="test img"
        />
        <CardContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            This is a test post for COMP531 Frontend Development. This is a test post for COMP531 Frontend Development. This is a test post for COMP531 Frontend Development.
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <Checkbox icon={
              <Badge anchorOrigin={{vertical:'bottom',horizontal:'right'}} color="red" badgeContent={99}>
                <FavoriteBorder />
              </Badge>
              } checkedIcon={
                <Badge anchorOrigin={{vertical:'bottom',horizontal:'right'}} color="red" badgeContent={100}>
                  <Favorite sx={{color:"red"}}/>
                </Badge>
              } />
          </IconButton>
          <IconButton aria-label="share">
            <Share />
          </IconButton>
        </CardActions>
    </Card>
  )
}
