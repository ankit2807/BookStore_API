const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email.')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.includes('password')) {
                throw new Error('Cannot use this password')
            }
        }
    },
    confirmPassword: {
        type: String,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.includes('password')) {
                throw new Error('Cannot use this password')
            }
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);