import User from '../models/user.model.js'; 
import bcryptjs from 'bcryptjs';

// Helper function to validate password strength
const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

export const signup = async (req, res) => {
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
        return res.status(400).json({message: 'Please fill all fields'});
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
        res.status(500).json({message: error.message});
    }
};
