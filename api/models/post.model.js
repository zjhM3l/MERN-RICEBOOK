import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // 标题是必填项
  },
  content: {
    type: String,
    required: true, // 内容是必填项
  },
  cover: {
    type: String, // 封面图片可选
    default: null,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  views: {
    type: Number, // 浏览量字段，默认0
    default: 0,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId, // 存储点赞的用户ID
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
