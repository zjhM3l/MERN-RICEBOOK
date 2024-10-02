import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true, // The content of the comment is required
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Reference to the associated post
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The author of the comment
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Stores the user IDs of those who liked the comment
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now, // The creation time of the comment
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
