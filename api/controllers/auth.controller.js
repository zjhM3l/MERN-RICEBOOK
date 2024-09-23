import User from '../models/user.model.js'; 
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

// Helper function to validate password strength
const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

// Helper function to validate age
const validateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age >= 18;
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
        next(errorHandler(400, 'All fields are required'));
    }
     // Age validation
     if (!validateAge(dateOfBirth)) {
        return res.status(400).json({
            message: 'You must be at least 18 years old.',
        });
    }

    // Password strength validation
    if (!validatePassword(password)) {
        return res.status(400).json({
            message: 'Password must be strong (at least 8 characters, including upper/lowercase letters, numbers, and special characters).',
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
