import { Box } from '@mui/material'
import { yellow } from '@mui/material/colors'
import React from 'react'

export const FriendSidebar = () => {
  return (
    <Box flex={1} p={2} sx={{ display: { xs: "none", sm: "block" } }} bgcolor="yellow">
      FriendSideBar
    </Box>
  )
}
