import express from "express";
import {
  getPosts,
  getPostById,
  toggleLikePost,
} from "../controllers/main.controller.js";

const router = express.Router();

// 获取所有帖子
router.get("/posts", getPosts);
router.get("/:postId", getPostById);
router.post("/:postId/like", toggleLikePost);

export default router;
