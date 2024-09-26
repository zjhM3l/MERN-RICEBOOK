import express from 'express';
import { profile, createPost } from '../controllers/user.controller.js';
import multer from 'multer';

const router = express.Router();

// 配置 multer 中间件
const upload = multer({ dest: 'uploads/' }); // 配置上传目录

// 使用 multer 中间件处理文件上传
router.post('/posts', upload.single('cover'), createPost); 
router.post('/profile', profile)


export default router;