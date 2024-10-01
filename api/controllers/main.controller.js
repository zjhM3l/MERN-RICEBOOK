import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";

// 获取与特定帖子相关的评论
export const getComments = async (req, res) => {
  const { postId } = req.query;

  try {
    // 验证是否存在该帖子
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 获取与该帖子相关的评论，并填充评论作者和喜欢的用户信息
    const comments = await Comment.find({ post: postId })
      .populate("author", "username profilePicture")
      .populate("likes", "username profilePicture");

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRecentPosts = async (req, res) => {
  try {
    // 查找最近发布且带有封面的帖子，按创建时间倒序排列
    const posts = await Post.find({ cover: { $ne: null } }) // 查询条件，确保 cover 不为 null
      .sort({ createdAt: -1 }) // 按创建时间倒序排序
      .limit(9); // 限制返回数量为 9 条

    res.status(200).json(posts || []); // 返回帖子对象，确保返回数组
  } catch (error) {
    console.error("Error fetching recent posts with covers:", error); // 打印详细错误
    res
      .status(500)
      .json({ message: "Failed to fetch recent posts with covers", error });
  }
};

// 获取所有帖子
export const getPosts = async (req, res) => {
  try {
    // 从数据库获取所有帖子并填充作者信息，按照 createdAt 升序排列
    const posts = await Post.find()
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error });
  }
};

// 获取单个帖子并增加浏览量
export const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    // 找到帖子并增加浏览量
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } }, // 每次访问时增加浏览量
      { new: true } // 返回更新后的帖子
    ).populate("author", "username profilePicture");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the post", error });
  }
};

// 点赞或取消点赞
export const toggleLikePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body; // 假设通过body传递用户ID

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 检查用户是否已经点赞
    const hasLiked = post.likes.includes(userId);
    if (hasLiked) {
      // 如果已经点赞，取消点赞
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // 如果未点赞，添加点赞
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
