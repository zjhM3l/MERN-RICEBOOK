import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import mongoose from "mongoose";

export const getComments = async (req, res) => {
  const { postId } = req.params; // Extract postId from req.params

  try {
    // Find the post by postId
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Fetch all comments related to the post and populate the author and likes
    const comments = await Comment.find({ post: postId })
      .populate("author", "username profilePicture")
      .populate("likes", "username profilePicture");

    res.status(200).json({ comments: comments || [] });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRecentPosts = async (req, res) => {
  try {
    // Find recent posts with a cover image, sorted by creation time (descending)
    const posts = await Post.find({ cover: { $ne: null } }) // Ensure cover is not null
      .sort({ createdAt: -1 }) // Sort by creation time in descending order
      .limit(9); // Limit the number of returned posts to 9

    res.status(200).json(posts || []); // Return posts or an empty array
  } catch (error) {
    console.error("Error fetching recent posts with covers:", error);
    res.status(500).json({ message: "Failed to fetch recent posts with covers", error });
  }
};

// Fetch posts with optional search query and pagination
export const getPosts = async (req, res) => {
  try {
    const { search, limit = 10, page = 1 } = req.query; // Get search, limit, and page from query parameters

    // Build query
    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Pagination logic
    const skip = (page - 1) * limit;

    // Fetch posts with pagination
    const posts = await Post.find(query)
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Total count for pagination metadata
    const totalCount = await Post.countDocuments(query);

    res.status(200).json({ posts, totalCount });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to fetch posts", error });
  }
};

// Fetch liked posts for the current user with optional search query and pagination
export const getLikedPosts = async (req, res) => {
  try {
    const { userId, search, limit = 10, page = 1 } = req.query;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const skip = (page - 1) * limit;

    let query = { likes: userId }; // Match posts liked by the user

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } }, // Case-insensitive search on title
        { content: { $regex: search, $options: "i" } }, // Case-insensitive search on content
      ];
    }

    const likedPosts = await Post.find(query)
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Post.countDocuments(query);

    res.status(200).json({ posts: likedPosts, totalCount });
  } catch (error) {
    console.error("Failed to fetch liked posts:", error);
    res.status(500).json({ message: "Failed to fetch liked posts", error });
  }
};

// Fetch posts from users the current user follows with optional search query and pagination
export const getFollowedUsersPosts = async (req, res) => {
  try {
    const { userId, search, limit = 10, page = 1 } = req.query;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const currentUser = await User.findById(userId).select("following");
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const skip = (page - 1) * limit;

    let query = { author: { $in: currentUser.following } };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const followedPosts = await Post.find(query)
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Post.countDocuments(query);

    res.status(200).json({ posts: followedPosts, totalCount });
  } catch (error) {
    console.error("Failed to fetch followed users' posts:", error);
    res.status(500).json({ message: "Failed to fetch followed users' posts", error });
  }
};

// Fetch a single post by ID and increment its view count
export const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    // Find post by ID and increment view count by 1
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } }, // Increment view count
      { new: true } // Return the updated post
    ).populate("author", "username profilePicture");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the post", error });
  }
};

// Like or unlike a post
export const toggleLikePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body; // Assuming userId is passed through the body

  try {
    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has already liked the post
    const hasLiked = post.likes.includes(userId);
    if (hasLiked) {
      // If liked, remove the like
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // If not liked, add the like
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      message: hasLiked ? "Unliked the post" : "Liked the post",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to like/unlike the post", error });
  }
};
