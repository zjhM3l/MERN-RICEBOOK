import express from "express";
import {
  profile,
  createPost,
  updateAvatar,
  toggleFollow,
  getFriends,
  getOrCreateChat,
  getChatMessages,
  postMessageToChat,
  getLatestConversations,
  createComment,
  likeComment
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/posts", createPost);
router.post("/profile", profile);
router.post("/updateAvatar", updateAvatar);
router.post("/toggleFollow", toggleFollow);
router.post("/chat", getOrCreateChat);
router.post('/createcomment', createComment);
router.post('/likecomment', likeComment);
router.post("/chat/:chatId/messages", postMessageToChat);

router.get("/:userId/friends", getFriends);
router.get("/chat/:chatId/messages", getChatMessages);
router.get('/latest-conversations/:userId', getLatestConversations);

export default router;
