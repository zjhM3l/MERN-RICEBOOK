import express from "express";
import {
  getPosts,
  getPostById,
  toggleLikePost,
  getRecentPosts,
} from "../controllers/main.controller.js";

const router = express.Router();

router.get("/recent-posts", getRecentPosts);
router.get("/posts", getPosts);
router.get("/:postId", getPostById);
router.post("/:postId/like", toggleLikePost);

export default router;
