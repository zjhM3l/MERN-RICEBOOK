import express from "express";
import {
  getPosts,
  getPostById,
  toggleLikePost,
  getRecentPosts,
  getComments,
  getLikedPosts
} from "../controllers/main.controller.js";

const router = express.Router();

router.get("/recent-posts", getRecentPosts);
router.get("/posts", getPosts);
router.get("/:postId", getPostById);
router.post("/:postId/like", toggleLikePost);
router.get("/getcomments/:postId", getComments);
router.get("/posts/liked", getLikedPosts);
export default router;
