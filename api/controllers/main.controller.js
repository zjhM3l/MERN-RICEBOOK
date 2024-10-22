import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";

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

// Fetch all posts
export const getPosts = async (req, res) => {
  try {
    // Fetch all posts and populate author details, sorted by creation time (descending)
    const posts = await Post.find()
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error });
  }
};

// Fetch posts from users the current user follows
export const getFollowedUsersPosts = async (req, res) => {
  try {
    const userId = req.query.userId; // Get userId from the query parameters

    // Find the current user to get the list of users they are following
    const currentUser = await User.findById(userId).select('following');

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch posts where the author is one of the users the current user is following
    const followedPosts = await Post.find({
      author: { $in: currentUser.following },
    })
      .populate("author", "username profilePicture") // Populate author details
      .sort({ createdAt: -1 }); // Sort posts by creation date (newest first)

    res.status(200).json(followedPosts); // Send the followed users' posts as response
  } catch (error) {
    console.error("Failed to fetch followed users' posts:", error);
    res.status(500).json({ message: "Failed to fetch followed users' posts", error });
  }
};

// Fetch liked posts for the current user
export const getLikedPosts = async (req, res) => {
  try {
    const userId = req.query.userId; // Get userId from the query parameters

    // Fetch posts that have the current user's ID in the `likes` array
    const likedPosts = await Post.find({ likes: userId })
      .populate("author", "username profilePicture") // Populate author details
      .sort({ createdAt: -1 }); // Sort posts by creation date (newest first)

    res.status(200).json(likedPosts); // Send the liked posts as response
  } catch (error) {
    console.error("Failed to fetch liked posts:", error);
    res.status(500).json({ message: "Failed to fetch liked posts", error });
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
