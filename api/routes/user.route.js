import express from 'express';
import { profile, createPost, updateAvatar } from '../controllers/user.controller.js';

const router = express.Router();

// 使用 multer 中间件处理文件上传
router.post('/posts', createPost); 
router.post('/profile', profile)
router.post('/updateAvatar', updateAvatar)


export default router;