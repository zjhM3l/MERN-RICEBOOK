import { Box, Stack } from '@mui/material'
import React from 'react'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'
import { UpdateProfile } from '../components/UpdateProfile'

export const Profile = () => {
  return (
    <Box>
      <Navbar />
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Sidebar />
        <UpdateProfile />
      </Stack>
    </Box>
  )
}
