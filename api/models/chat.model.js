import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The user ID of the message sender, references the User collection
      required: true,
    },
    content: {
      type: String, // The content of the message
      required: true,
    },
    timestamp: {
      type: Date, // The time the message was sent
      default: Date.now, // Default to the current time
    },
  },
  { _id: false } // Disable generation of a unique _id for each message
);

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // The user ID of a chat participant, references the User collection
        required: true,
      },
    ],
    messages: [messageSchema], // Array to store messages in the chat
    createdAt: {
      type: Date,
      default: Date.now, // The time the chat was created
    },
    lastMessageAt: {
      type: Date, // The time of the last message sent in the chat
      default: Date.now,
    },
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt` timestamps
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
