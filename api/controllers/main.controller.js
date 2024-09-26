import Post from '../models/post.model.js';

// 获取所有帖子
export const getPosts = async (req, res) => {
  try {
    // 从数据库获取所有帖子并填充作者信息
    const posts = await Post.find().populate('author', 'username profilePicture');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error });
  }
};
