import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // 发送者的用户ID，引用User表
      required: true,
    },
    content: {
      type: String,  // 消息内容
      required: true,
    },
    timestamp: {
      type: Date,  // 发送时间
      default: Date.now,  // 默认是当前时间
    },
  },
  { _id: false }  // 不为每条消息生成独立的_id
);

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // 聊天参与者的用户ID
        required: true,
      },
    ],
    messages: [messageSchema],  // 存储消息的数组
    createdAt: {
      type: Date,
      default: Date.now,  // 聊天创建时间
    },
    lastMessageAt: {
      type: Date,  // 最后发送消息的时间
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
