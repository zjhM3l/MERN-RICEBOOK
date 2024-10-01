import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true, // 评论内容是必填项
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // 关联的帖子
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 评论的作者
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // 存储点赞的用户ID
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now, // 创建时间
    },
  },
  { timestamps: true } // 添加 createdAt 和 updatedAt 字段
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
