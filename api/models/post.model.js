import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // The title of the post is required
  },
  content: {
    type: String,
    required: true, // The content of the post is required
  },
  cover: {
    type: String, // Optional cover image for the post
    default: null,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the author of the post
    required: true,
  },
  views: {
    type: Number, // Field to store the number of views, default is 0
    default: 0,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId, // Stores the user IDs of those who liked the post
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // The date when the post was created
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
