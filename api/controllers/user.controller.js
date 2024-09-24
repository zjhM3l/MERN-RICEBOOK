import User from '../models/user.model.js'; 
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
    res.json({message: 'API is working'});
};

export const profile = async (req, res, next) => {
    const {username, email, phone, dateOfBirth, zipcode, password} = req.body;

    // Collect error messages
    let errorMessages = [];

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check for changes and validate
        if (username && username !== user.username) {
            if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(username)) {
                errorMessages.push('Username must start with a letter and contain only letters and numbers.');
            } else {
                user.username = username;
            }
        }

        if (phone && phone !== user.phone) {
            if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone)) {
                errorMessages.push('Phone number must be a valid US phone number in the format (123) 456-7890/123-456-7890/123.456.7890.');
            } else {
                user.phone = phone;
            }
        }

        if (dateOfBirth && new Date(dateOfBirth).toISOString() !== user.dateOfBirth.toISOString()) {
            const today = new Date();
            const dob = new Date(dateOfBirth);
            const age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            if (age < 18) {
                errorMessages.push('You must be at least 18 years old.');
            } else {
                user.dateOfBirth = dob;
            }
        }

        if (zipcode && zipcode !== user.zipcode) {
            if (!/^[0-9]{5}$/.test(zipcode)) {
                errorMessages.push('Zipcode must be a 5-digit number e.g. 12345.');
            } else {
                user.zipcode = zipcode;
            }
        }

        if (password) {
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

        // If there are any error messages, return them
        if (errorMessages.length > 0) {
            return res.status(400).json({
                message: errorMessages.join(', '),
            });
        }

        // Save the updated user
        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        next(error);
    }
};