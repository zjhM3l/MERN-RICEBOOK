import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import bcryptjs from "bcryptjs";
import Chat from "../models/chat.model.js";
import Comment from "../models/comment.model.js";

// 创建评论
export const createComment = async (req, res) => {
  const { postId, content, author } = req.body; // 从请求体中获取 author

  try {
    // 验证帖子是否存在
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 验证用户是否存在
    const user = await User.findById(author);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 创建并保存评论
    const newComment = new Comment({
      author, // 使用传递过来的 author ID
      post: postId,
      content,
    });
    await newComment.save();

    // 返回成功消息
    res.status(201).json({ message: "Comment created successfully", comment: newComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get the latest messages received by the current user where the user hasn't replied yet
export const getLatestConversations = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find chats where the user is a participant
    const chats = await Chat.find({
      participants: userId
    })
    .populate('messages.sender', 'username profilePicture')  // Populate sender details
    .sort({ lastMessageAt: -1 })  // Sort by most recent message
    .lean();  // Use lean() for better performance since we're not modifying the data

    const latestMessages = [];

    for (const chat of chats) {
      // Get the last message in the chat
      const lastMessage = chat.messages[chat.messages.length - 1];

      // Only process if the last message was sent by someone other than the current user
      if (lastMessage.sender._id.toString() !== userId) {
        // Check if the user has replied after the last message
        const userRepliedAfterLastMessage = chat.messages.slice(chat.messages.length - 1)
          .some(message => message.sender._id.toString() === userId);

        // If the user hasn't replied, include this conversation
        if (!userRepliedAfterLastMessage) {
          latestMessages.push({ ...lastMessage, chatId: chat._id });  // Include chatId with the message
        }

        // Stop if we already have 4 messages
        if (latestMessages.length >= 4) {
          break;
        }
      }
    }

    res.status(200).json(latestMessages);
  } catch (error) {
    console.error("Failed to fetch latest conversations:", error);
    res.status(500).json({ message: "Failed to fetch latest conversations" });
  }
};

// Get or create a chat between two users
export const getOrCreateChat = async (req, res) => {
  const { userId, targetId } = req.body;

  try {
    // Check if a chat already exists between the users
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetId] }
    });

    // If chat does not exist, create a new one
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetId],
        messages: []
      });
      await chat.save();
    }

    // Return the chat object
    res.status(200).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get or create chat" });
  }
};

// Get messages for a specific chat
export const getChatMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId).populate('messages.sender', 'username profilePicture'); // populate sender details

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.status(200).json(chat.messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get messages" });
  }
};

// Post a new message to a chat
export const postMessageToChat = async (req, res) => {
  const { chatId } = req.params;
  const { content, senderId } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const newMessage = {
      sender: senderId,
      content,
      timestamp: new Date(),
    };

    // Add the message to the chat
    chat.messages.push(newMessage);
    chat.lastMessageAt = new Date();
    await chat.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to post message" });
  }
};

// 获取用户的好友列表
export const getFriends = async (req, res) => {
  const { userId } = req.params; // 从请求的参数中获取用户ID

  try {
    // 查找当前用户
    const user = await User.findById(userId).populate("following followers");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followingSet = new Set(user.following.map((f) => f._id.toString()));
    const followersSet = new Set(user.followers.map((f) => f._id.toString()));

    // 单向关注（我关注了对方，但对方没有关注我）
    const oneWayFollowings = user.following.filter(
      (followedUser) => !followersSet.has(followedUser._id.toString())
    );

    // 双向关注（互相关注）
    const mutualFollowings = user.following.filter((followedUser) =>
      followersSet.has(followedUser._id.toString())
    );

    // 被关注但未关注（对方关注了我，但我没有关注对方）
    const followersNotFollowingBack = user.followers.filter(
      (followerUser) => !followingSet.has(followerUser._id.toString())
    );

    return res.status(200).json({
      oneWayFollowings,          // 我关注了但对方没关注的
      mutualFollowings,          // 互相关注的
      followersNotFollowingBack, // 对方关注了我但我没关注的
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 关注或取消关注用户
export const toggleFollow = async (req, res) => {
  try {
    const { userId, targetId } = req.body; // 从请求体中获取用户和目标用户的ID

    if (!userId || !targetId) {
      return res
        .status(400)
        .json({ message: "Both userId and targetId are required." });
    }

    // 查找用户和目标用户
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetId);

    if (!user || !targetUser) {
      return res
        .status(404)
        .json({ message: "User or target user not found." });
    }

    // 将 ObjectId 转换为字符串来进行比较
    const isFollowing = user.following.some(
      (followingId) => followingId.toString() === targetId
    );

    if (isFollowing) {
      // 如果已经关注了目标用户，则取消关注
      user.following = user.following.filter(
        (followingId) => followingId.toString() !== targetId
      );
      targetUser.followers = targetUser.followers.filter(
        (followerId) => followerId.toString() !== userId
      );
    } else {
      // 如果没有关注目标用户，则进行关注
      user.following.push(targetId);
      targetUser.followers.push(userId);
    }

    // 保存用户的更新
    await user.save();
    await targetUser.save();

    // 返回成功响应，确保 following 列表和 followers 列表包含最新的关注状态
    return res.status(200).json({
      message: isFollowing
        ? "Unfollowed the user successfully."
        : "Followed the user successfully.",
      following: user.following, // 更新后的 following 列表
      followers: targetUser.followers, // 更新后的目标用户的 followers 列表
      userId: user._id, // 当前用户的 ID
      targetId: targetUser._id, // 目标用户的 ID
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const updateAvatar = async (req, res) => {
  const { user, photoURL } = req.body;
  console.log("user", user);
  console.log("photoURL", photoURL);

  try {
    const existingUser = await User.findById(user._id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    existingUser.profilePicture = photoURL;
    await existingUser.save();

    res.json({ message: "Avatar updated successfully", user: existingUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to update avatar", error });
  }
};

export const createPost = async (req, res) => {
  const { title, content, author, cover } = req.body; // 从请求体中获取 title, content, author, 和 cover (URL)

  try {
    const newPost = new Post({
      title,
      content,
      cover: cover || null, // 将封面图片的 URL 存储到数据库，如果没有封面，设置为 null
      author,
    });

    await newPost.save();
    res.status(201).json(newPost); // 返回成功响应
  } catch (error) {
    if (error.type === "entity.too.large") {
      return res.status(413).json({ message: "File is too large" }); // 捕获 413 错误
    }
    res.status(500).json({ message: "Failed to create post", error });
  }
};

export const profile = async (req, res, next) => {
  const { email, username, phone, zipcode, password, confirm } = req.body;

  // Collect error messages
  let errorMessages = [];

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for changes and validate
    if (username !== undefined) {
      if (username === "") {
        errorMessages.push("Username cannot be empty.");
      } else if (username !== user.username) {
        // Check if the new username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
          errorMessages.push("Username already exists.");
        } else if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(username)) {
          errorMessages.push(
            "Username must start with a letter and contain only letters and numbers."
          );
        } else {
          user.username = username;
        }
      }
    }

    if (phone !== undefined) {
      if (phone === "") {
        errorMessages.push("Phone number cannot be empty.");
      } else if (phone !== user.phone) {
        if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone)) {
          errorMessages.push(
            "Phone number must be a valid US phone number in the format (123) 456-7890/123-456-7890/123.456.7890."
          );
        } else {
          user.phone = phone;
        }
      }
    }

    if (zipcode !== undefined) {
      if (zipcode === "") {
        errorMessages.push("Zipcode cannot be empty.");
      } else if (zipcode !== user.zipcode) {
        if (!/^[0-9]{5}$/.test(zipcode)) {
          errorMessages.push("Zipcode must be a 5-digit number e.g. 12345.");
        } else {
          user.zipcode = zipcode;
        }
      }
    }

    if (password !== undefined) {
      if (password === "") {
        errorMessages.push("Password cannot be empty.");
      } else {
        // Password strength validation
        const validatePassword = (password) => {
          const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          return regex.test(password);
        };

        if (!validatePassword(password)) {
          errorMessages.push(
            "Password must be strong (at least 8 characters including upper/lowercase letters, numbers, and special characters)."
          );
        } else {
          user.password = bcryptjs.hashSync(password, 10);
        }
      }
    }

    // If there are any error messages, return them
    if (errorMessages.length > 0) {
      return res.status(400).json({
        message: errorMessages.join(", "),
      });
    }

    // Save the updated user
    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    next(error);
  }
};
