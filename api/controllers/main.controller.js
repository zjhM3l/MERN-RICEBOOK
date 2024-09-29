import Post from "../models/post.model.js";

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

    res
      .status(200)
      .json({
        message: hasLiked ? "Unliked the post" : "Liked the post",
        post,
      });
  } catch (error) {
    res.status(500).json({ message: "Failed to like/unlike the post", error });
  }
};
