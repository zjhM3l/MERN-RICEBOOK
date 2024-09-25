import express from 'express';
import { profile, createPost } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/profile', profile)
router.post('/posts', createPost); 

export default router;