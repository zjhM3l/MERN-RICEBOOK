import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z][a-zA-Z0-9]*$/, // Only letters and numbers, not starting with a number
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email address',
        },
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(v);
            },
            message: 'Invalid US phone number',
        },
    },
    dateOfBirth: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                const today = new Date();
                const age = today.getFullYear() - v.getFullYear();
                const m = today.getMonth() - v.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < v.getDate())) {
                    age--;
                }
                return age >= 18;
            },
            message: 'Must be 18 years or older',
        },
    },
    zipcode: {
        type: String,
        required: true,
        match: /^[0-9]{5}$/, // Valid 5 digits
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
            },
            message: 'Password must be strong (at least 8 characters, including upper/lowercase letters, numbers, and punctuation)',
        },
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;