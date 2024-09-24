import User from '../models/user.model.js'; 
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

// Helper function to validate password strength
const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

export const signup = async (req, res, next) => {
    const {username, email, phone, dateOfBirth, zipcode, password} = req.body;

    // Collect error messages
    let errorMessages = [];

    // Basic field validation
    if (
        !username || 
        !email || 
        !phone || 
        !dateOfBirth || 
        !zipcode || 
        !password
    ) {
        errorMessages.push('All fields are required');
    }
  
    // Password strength validation
    if (!validatePassword(password)) {
        errorMessages.push('Password must be strong (at least 8 characters including upper/lowercase letters, numbers, and special characters).');
    }

    try {
        // Check if username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            errorMessages.push('Username already exists.');
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            errorMessages.push('Email already exists.');
        }

        // If there are any error messages, return them
        if (errorMessages.length > 0) {
            return res.status(400).json({
                message: errorMessages.join(', '),
            });
        }

        // Hash the password
        const hashPassword = bcryptjs.hashSync(password, 10);

        // Create new user with hashed password
        const newUser = new User({
            username, 
            email, 
            phone,
            dateOfBirth,
            zipcode,
            password: hashPassword,
        });

        await newUser.save();
        res.json('Signup successful');
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Extract the first validation error message
            const message = Object.values(error.errors).map(err => err.message).join(', ');
            return res.status(400).json({ message });
        }
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const {email, password} = req.body;

    // Collect error messages
    let errorMessages = [];

    // Basic field validation
    if (!email || !password) {
        errorMessages.push('All fields are required');
    }

    try {
        // Check if email exists
        const user = await User.findOne({ email });
        if (!user) {
            errorMessages.push('Email does not exist.');
        } else {
            // Check if password matches
            const isMatch = bcryptjs.compareSync(password, user.password);
            if (!isMatch) {
                errorMessages.push('Password does not match.');
            }
        }

        // If there are any error messages, return them
        if (errorMessages.length > 0) {
            return res.status(400).json({
                message: errorMessages.join(', '),
            });
        }

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
        );
        
        // Remove password from user object
        const { password: pass, ...rest } = user._doc;

        // If no errors, signin successful
        res.status(200).cookie('access_token', token, {
            httpOnly: true
        }).json(rest);
    } catch (error) {
        next(error);
    }
};