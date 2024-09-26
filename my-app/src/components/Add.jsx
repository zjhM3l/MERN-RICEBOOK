import React, { useState } from 'react';
import { Avatar, Box, Button, Fab, Modal, Stack, styled, Tooltip, Typography, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CropFree from '@mui/icons-material/CropFree';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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

const VisuallyHiddenInput = styled('input')({
  display: 'none',
});

export const Add = () => {
  const [open, setOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cover, setCover] = useState(null); // 用于保存封面图片文件
  const { currentUser } = useSelector((state) => state.user); // 获取当前用户

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleFileChange = (e) => {
    setCover(e.target.files[0]); // 获取文件
  };

  const handlePost = async () => {
    if (!currentUser || !title || !content) return; // 检查 title 和 content 是否有值

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('author', currentUser._id); // 从 Redux 获取当前用户的 ID

    if (cover) {
      formData.append('cover', cover); // 如果上传了封面，添加到 formData
    }

    try {
      const res = await fetch('http://localhost:3000/api/user/posts', {
        method: 'POST',
        body: formData, // 发送 FormData
      });

      if (!res.ok) {
        throw new Error('Failed to create post');
      }

      const data = await res.json();
      console.log('Post created:', data);
      setOpen(false);
      setTitle(''); // 清空标题
      setContent(''); // 清空内容
      setCover(null); // 清空封面
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
          height={isExpanded ? '80vh' : 400} // Adjusted height for collapsed state
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
          {/* 新增标题输入框 */}
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
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
          {/* 按钮组 */}
          <Stack direction="row" gap={0} mt={2} mb={0} justifyContent="space-between">
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{ flex: 1 }}
            >
              Cover
              {/* 隐藏的 input 用于上传图片 */}
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            <Button
              disabled={!currentUser || !title || !content}
              onClick={handlePost}
              variant="contained"
              sx={{ flex: 2 }}
            >
              Post
            </Button>
            <Button
              onClick={handleExpand}
              variant="contained"
              sx={{ width: '50px' }}
            >
              <CropFree />
            </Button>
          </Stack>
        </Box>
      </StyledModal>
    </>
  );
};