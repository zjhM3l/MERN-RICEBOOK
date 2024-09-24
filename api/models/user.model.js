import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        // Validation message for username
        validate: {
            validator: function(v) {
                return /^[a-zA-Z][a-zA-Z0-9]*$/.test(v);
            },
            message: 'Username must start with a letter and contain only letters and numbers.',
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail, 
            message: 'Email must be a valid email address such as example@example.com.',
        },
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(v);
            },
            message: 'Phone number must be a valid US phone number in the format (123) 456-7890/123-456-7890/123.456.7890.',
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
            message: 'You must be at least 18 years old.',
        },
    },
    zipcode: {
        type: String,
        required: true,
        // Validation message for zipcode
        validate: {
            validator: function(v) {
                return /^[0-9]{5}$/.test(v);
            },
            message: 'Zipcode must be a 5-digit number e.g. 12345.',
        },
    },
    password: {
        type: String,
        required: true,
        // Custom password validation here will casuse hashSync to fail
    },
    profilePicture: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
