import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import bcryptjs from "bcryptjs";
import Chat from "../models/chat.model.js";
import Comment from "../models/comment.model.js";

// Like or unlike a comment
export const likeComment = async (req, res) => {
  const { commentId, userId } = req.body;

  try {
    // Find the comment by ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user has already liked the comment
    const hasLiked = comment.likes.includes(userId);

    if (hasLiked) {
      // If already liked, remove the like
      comment.likes.pull(userId);
    } else {
      // If not liked, add the user's like
      comment.likes.push(userId);
    }

    // Save the updated comment
    await comment.save();

    res.status(200).json({
      message: hasLiked ? "Comment unliked" : "Comment liked",
      likes: comment.likes.length, // Return updated like count
    });
  } catch (error) {
    console.error("Error toggling like on comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a comment on a post
export const createComment = async (req, res) => {
  const { postId, content, author } = req.body; // Extract author from the request body

  try {
    // Verify that the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Verify that the user exists
    const user = await User.findById(author);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create and save the new comment
    const newComment = new Comment({
      author, // Use the passed author ID
      post: postId,
      content,
    });
    await newComment.save();

    // Return a success message
    res.status(201).json({ message: "Comment created successfully", comment: newComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get the latest conversations where the user hasn't replied yet
export const getLatestConversations = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find chats where the user is a participant
    const chats = await Chat.find({
      participants: userId
    })
    .populate('messages.sender', 'username profilePicture')  // Populate sender details
    .sort({ lastMessageAt: -1 })  // Sort by most recent message
    .lean();  // Use lean() for better performance since we aren't modifying the data

    const latestMessages = [];
    let unrepliedMessagesCount = 0; // Count of unreplied messages

    for (const chat of chats) {
      // Get the last message in the chat
      const lastMessage = chat.messages[chat.messages.length - 1];

      // Only process if the last message was sent by someone other than the current user
      if (lastMessage.sender._id.toString() !== userId) {
        // Check if the user has replied after the last message
        const userRepliedAfterLastMessage = chat.messages
          .slice(chat.messages.length - 1)
          .some(message => message.sender._id.toString() === userId);

        // If the user hasn't replied, count the conversation
        if (!userRepliedAfterLastMessage) {
          unrepliedMessagesCount++;

          // Only add to latestMessages if we have less than 4 messages
          if (latestMessages.length < 4) {
            latestMessages.push({ ...lastMessage, chatId: chat._id });  // Include chatId with the message
          }
        }
      }
    }

    res.status(200).json({
      latestMessages,
      unrepliedMessagesCount,
    });
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
    // Find the chat and populate the sender details in messages
    const chat = await Chat.findById(chatId).populate('messages.sender', 'username profilePicture');

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
    // Find the chat by ID
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Create a new message object
    const newMessage = {
      sender: senderId,
      content,
      timestamp: new Date(),
    };

    // Add the new message to the chat and update the last message timestamp
    chat.messages.push(newMessage);
    chat.lastMessageAt = new Date();
    await chat.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to post message" });
  }
};

// Get the list of friends (followers and followings) for a user
export const getFriends = async (req, res) => {
  const { userId } = req.params; // Extract userId from request parameters

  try {
    // Find the user and populate following and followers details
    const user = await User.findById(userId).populate("following followers");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followingSet = new Set(user.following.map((f) => f._id.toString()));
    const followersSet = new Set(user.followers.map((f) => f._id.toString()));

    // Users followed by me but not following me back
    const oneWayFollowings = user.following.filter(
      (followedUser) => !followersSet.has(followedUser._id.toString())
    );

    // Mutual followers (both follow each other)
    const mutualFollowings = user.following.filter((followedUser) =>
      followersSet.has(followedUser._id.toString())
    );

    // Users who follow me but I don't follow back
    const followersNotFollowingBack = user.followers.filter(
      (followerUser) => !followingSet.has(followerUser._id.toString())
    );

    return res.status(200).json({
      oneWayFollowings,          // Followed by me but not following back
      mutualFollowings,          // Mutual followings
      followersNotFollowingBack, // Followed by them but not following back
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Follow or unfollow a user
export const toggleFollow = async (req, res) => {
  try {
    const { userId, targetId } = req.body; // Extract userId and targetId from request body

    if (!userId || !targetId) {
      return res
        .status(400)
        .json({ message: "Both userId and targetId are required." });
    }

    // Find the user and the target user
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetId);

    if (!user || !targetUser) {
      return res
        .status(404)
        .json({ message: "User or target user not found." });
    }

    // Check if the user is already following the target user
    const isFollowing = user.following.some(
      (followingId) => followingId.toString() === targetId
    );

    if (isFollowing) {
      // If already following, remove the follow
      user.following = user.following.filter(
        (followingId) => followingId.toString() !== targetId
      );
      targetUser.followers = targetUser.followers.filter(
        (followerId) => followerId.toString() !== userId
      );
    } else {
      // If not following, add the follow
      user.following.push(targetId);
      targetUser.followers.push(userId);
    }

    // Save the updated user and target user
    await user.save();
    await targetUser.save();

    // Return the updated following and followers lists
    return res.status(200).json({
      message: isFollowing
        ? "Unfollowed the user successfully."
        : "Followed the user successfully.",
      following: user.following, // Updated following list
      followers: targetUser.followers, // Updated followers list
      userId: user._id, // Current user ID
      targetId: targetUser._id, // Target user ID
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Update user's profile picture (avatar)
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

// Create a new post
export const createPost = async (req, res) => {
  const { title, content, author, cover } = req.body; // Extract title, content, author, and cover (URL) from request body

  try {
    const newPost = new Post({
      title,
      content,
      cover: cover || null, // Store the cover URL, or null if no cover is provided
      author,
    });

    await newPost.save();
    res.status(201).json(newPost); // Return success response
  } catch (error) {
    if (error.type === "entity.too.large") {
      return res.status(413).json({ message: "File is too large" }); // Handle 413 error if file is too large
    }
    res.status(500).json({ message: "Failed to create post", error });
  }
};

// Update an existing post
export const updatePost = async (req, res) => {
  const { postId } = req.params; // Get post ID from the URL
  const { title, content } = req.body; // Get updated title and content

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content },
      { new: true } // Return the updated post
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost); // Return the updated post
  } catch (error) {
    res.status(500).json({ message: "Failed to update post", error });
  }
};

// Update user profile information
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
