const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['user', 'admin'], // Only "user" or "admin" are valid roles
        default: 'user', // Default role is "user"
    },
});

module.exports = mongoose.model('User', userSchema);
