import Post from '../models/post.model.js';

// 获取所有帖子
export const getPosts = async (req, res) => {
  try {
    // 从数据库获取所有帖子并填充作者信息，按照 createdAt 升序排列
    const posts = await Post.find().populate('author', 'username profilePicture').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error });
  }
};