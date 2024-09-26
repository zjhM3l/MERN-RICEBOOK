import User from '../models/user.model.js'; 
import Post from '../models/post.model.js';
import bcryptjs from 'bcryptjs';

export const updateAvatar = async (req, res) => {
  const { user, photoURL } = req.body;
  console.log('user', user);
  console.log('photoURL', photoURL);

  try {
    const existingUser = await User.findById(user._id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    existingUser.profilePicture = photoURL;
    await existingUser.save();

    res.json({ message: 'Avatar updated successfully', user: existingUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update avatar', error });
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
        res.status(500).json({ message: 'Failed to create post', error });
    }
};
  

export const profile = async (req, res, next) => {
    const { email, username, phone, zipcode, password, confirm } = req.body;

    // Collect error messages
    let errorMessages = [];

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check for changes and validate
        if (username !== undefined) {
            if (username === '') {
                errorMessages.push('Username cannot be empty.');
            } else if (username !== user.username) {
                // Check if the new username already exists
                const existingUsername = await User.findOne({ username });
                if (existingUsername) {
                    errorMessages.push('Username already exists.');
                } else if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(username)) {
                    errorMessages.push('Username must start with a letter and contain only letters and numbers.');
                } else {
                    user.username = username;
                }
            }
        }

        if (phone !== undefined) {
            if (phone === '') {
                errorMessages.push('Phone number cannot be empty.');
            } else if (phone !== user.phone) {
                if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone)) {
                    errorMessages.push('Phone number must be a valid US phone number in the format (123) 456-7890/123-456-7890/123.456.7890.');
                } else {
                    user.phone = phone;
                }
            }
        }

        if (zipcode !== undefined) {
            if (zipcode === '') {
                errorMessages.push('Zipcode cannot be empty.');
            } else if (zipcode !== user.zipcode) {
                if (!/^[0-9]{5}$/.test(zipcode)) {
                    errorMessages.push('Zipcode must be a 5-digit number e.g. 12345.');
                } else {
                    user.zipcode = zipcode;
                }
            }
        }

        if (password !== undefined) {
            if (password === '') {
                errorMessages.push('Password cannot be empty.');
            } else {
                // Password strength validation
                const validatePassword = (password) => {
                    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                    return regex.test(password);
                };

                if (!validatePassword(password)) {
                    errorMessages.push('Password must be strong (at least 8 characters including upper/lowercase letters, numbers, and special characters).');
                } else {
                    user.password = bcryptjs.hashSync(password, 10);
                }
            }
        }

        // If there are any error messages, return them
        if (errorMessages.length > 0) {
            return res.status(400).json({
                message: errorMessages.join(', '),
            });
        }

        // Save the updated user
        await user.save();
        res.json({ message: 'Profile updated successfully',
            user
         });
    } catch (error) {
        next(error);
    }
};