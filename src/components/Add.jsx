import { Avatar, Box, Button, ButtonGroup, Fab, Modal, Stack, styled, TextField, Tooltip, Typography } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import EmojiEmotions from '@mui/icons-material/EmojiEmotions';
import Image from '@mui/icons-material/Image';
import VideoCameraBack from '@mui/icons-material/VideoCameraBack';
import PersonAdd from '@mui/icons-material/PersonAdd';
import DateRange from '@mui/icons-material/DateRange';

const StyledModal = styled(Modal)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const UserBox = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
});

export const Add = () => {
    const [open, setOpen] = React.useState(false);
  return (
    <>
        <Tooltip onClick={e=>setOpen(true)}
        title='Delete' 
        sx={{
            position:'fixed', 
            bottom:20, 
            left:{xs:'calc(50% - 25px)', md:30},
            }}
        >
            <Fab color="primary" aria-label="add">
                <AddIcon />
            </Fab>
        </Tooltip>
        <StyledModal
        open={open}
        onClose={e=>setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <Box width={400} height={280} bgcolor={"background.default"} color={"text.primary"} p={3} borderRadius={5}>
                <Typography variant='h6' color='gray' textAlign='center'>Create post</Typography>
                <UserBox>
                    <Avatar 
                        src='https://cdn.pixabay.com/photo/2023/06/26/02/57/man-8088588_1280.jpg' 
                        sx={{ width: 30, height: 30 }}
                    />
                    <Typography fontWeight={500} variant='span'>
                        JiaHe
                    </Typography>
                </UserBox>
                <TextField
                    sx={{ width: '100%' }}
                    id="standard-multiline-static"
                    multiline
                    rows={3}
                    placeholder="What's on your mind?"
                    variant="standard"
                />
                <Stack direction='row' gap={1} mt={2} mb={3}>
                    <EmojiEmotions color='primary' />
                    <Image color='secondary' />
                    <VideoCameraBack color='success' />
                    <PersonAdd color='error' />
                </Stack>
                <ButtonGroup 
                    fullWidth
                    variant="contained" 
                    aria-label="Basic button group"
                >
                    <Button>Post</Button>
                    <Button sx={{width:'100px'}}>
                        <DateRange/>
                    </Button>
                </ButtonGroup>
            </Box>
        </StyledModal>
    </>
  )
}
