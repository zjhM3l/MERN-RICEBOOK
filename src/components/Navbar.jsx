import { AppBar, Box, styled, Toolbar, Typography } from '@mui/material'
import React from 'react'
import FacebookIcon from '@mui/icons-material/Facebook';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between'
})

const Search = styled("div")(({ theme }) => ({
  backgroundColor: 'white',
  padding: '0 10px',
  borderRadius: theme.shape.borderRadius,
  width: '40%',
}));

const Icons = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
}));

export const Navbar = () => {
  return (
    <AppBar position='sticky'>
      <StyledToolbar>
        <Typography variant='h6' sx={{display:{xs:"none", sm:"block"}}}>Rice Book</Typography>
        <FacebookIcon sx={{display:{xs:"block", sm:"none"}}}/>
        <Search>search</Search>
        <Icons>Icons</Icons>
      </StyledToolbar>
    </AppBar>
  )
}
