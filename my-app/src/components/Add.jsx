import React, { useState } from 'react';
import { Avatar, Box, Button, ButtonGroup, Fab, Modal, Stack, styled, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EmojiEmotions from '@mui/icons-material/EmojiEmotions';
import Image from '@mui/icons-material/Image';
import VideoCameraBack from '@mui/icons-material/VideoCameraBack';
import PersonAdd from '@mui/icons-material/PersonAdd';
import CropFree from '@mui/icons-material/CropFree';
import { useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
  const [open, setOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const { currentUser } = useSelector((state) => state.user);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handlePost = async () => {
    if (!currentUser) return;

    try {
      const res = await fetch('http://localhost:3000/api/user/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, author: currentUser._id }),
      });

      if (!res.ok) {
        throw new Error('Failed to create post');
      }

      const data = await res.json();
      console.log('Post created:', data);
      setOpen(false);
      setContent('');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };
  
  return (
    <>
      <Tooltip
        onClick={() => setOpen(true)}
        title="Add"
        sx={{
          position: 'fixed',
          bottom: 20,
          left: { xs: 'calc(50% - 25px)', md: 30 },
        }}
      >
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Tooltip>
      <StyledModal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          width={isExpanded ? '80vw' : 400}
          height={isExpanded ? '80vh' : 280}
          bgcolor={"background.default"}
          color={"text.primary"}
          p={3}
          borderRadius={5}
          sx={{
            transition: 'transform 0.4s ease, opacity 0.4s ease',
            transform: isExpanded ? 'scale(1.05)' : 'scale(1)',
            opacity: isExpanded ? 1 : 0.9,
            position: isExpanded ? 'fixed' : 'relative',
            top: isExpanded ? '10%' : 'auto',
            left: isExpanded ? '10%' : 'auto',
            overflowY: isExpanded ? 'auto' : 'visible',
          }}
        >
          <Typography variant="h6" color="gray" textAlign="center">
            Create post
          </Typography>
          <UserBox>
            <Avatar src={currentUser?.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} sx={{ width: 30, height: 30 }} />
            <Typography fontWeight={500} variant="span">
              {currentUser?.username || 'Guest'}
            </Typography>
          </UserBox>
          <ReactQuill
            value={content}
            onChange={handleContentChange}
            modules={{
              toolbar: [
                [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                [{size: []}],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, 
                 {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image', 'video'],
                ['clean']
              ],
            }}
            formats={[
              'header', 'font', 'size',
              'bold', 'italic', 'underline', 'strike', 'blockquote',
              'list', 'bullet', 'indent',
              'link', 'image', 'video'
            ]}
            placeholder="What's on your mind?"
          />
          <Stack direction="row" gap={1} mt={2} mb={0}>
          </Stack>
          <ButtonGroup fullWidth variant="contained" aria-label="Basic button group">
            <Button disabled={!currentUser} onClick={handlePost}>Post</Button>
            <Button sx={{ width: '100px' }} onClick={handleExpand}>
              <CropFree />
            </Button>
          </ButtonGroup>
        </Box>
      </StyledModal>
    </>
  );
};