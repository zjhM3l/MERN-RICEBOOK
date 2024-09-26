import express from 'express';
import { getPosts } from '../controllers/main.controller.js';

const router = express.Router();

// 获取所有帖子
router.get('/posts', getPosts);

export default router;
