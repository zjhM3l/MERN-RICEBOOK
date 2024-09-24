import express from 'express';
import { profile } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/profile', profile)

export default router;