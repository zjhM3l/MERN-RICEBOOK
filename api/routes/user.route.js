import express from "express";
import {
  profile,
  createPost,
  updateAvatar,
  toggleFollow,
  getFriends,
  getOrCreateChat,
  getChatMessages,      // Import the new controller
  postMessageToChat,     // Import the new controller
  getLatestConversations,
  createComment,
} from "../controllers/user.controller.js";

const router = express.Router();

// 使用 multer 中间件处理文件上传
router.post("/posts", createPost);
router.post("/profile", profile);
router.post("/updateAvatar", updateAvatar);
router.post("/toggleFollow", toggleFollow);
router.get("/:userId/friends", getFriends);
router.post("/chat", getOrCreateChat);

// New routes for chat messages
router.get("/chat/:chatId/messages", getChatMessages);   // Fetch chat messages
router.post("/chat/:chatId/messages", postMessageToChat); // Post a message to chat
router.get('/latest-conversations/:userId', getLatestConversations);  // New route to get latest conversations

export default router;
