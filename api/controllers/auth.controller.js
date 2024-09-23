import User from '../models/user.model.js'; 
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

// Helper function to validate password strength
const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

export const signup = async (req, res, next) => {
    const {username, email, phone, dateOfBirth, zipcode, password} = req.body;

    // Basic field validation
    if (
        !username || 
        !email || 
        !phone || 
        !dateOfBirth || 
        !zipcode || 
        !password
    ) {
        return next(errorHandler(400, 'All fields are required'));
    }
  
    // Password strength validation
    if (!validatePassword(password)) {
        return res.status(400).json({
            message: 'Password must be strong (at least 8 characters including upper/lowercase letters numbers and special characters).',
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

    try {
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
