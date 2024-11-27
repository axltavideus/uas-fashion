const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// User signup
router.post('/signup', async (req, res) => {
    const { email, username, password, confirmPassword } = req.body;

    // Validate fields
    if (!email || !username || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }

    try {
        // Check if the email or username already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or username already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Assign role based on username
        const role = username.toLowerCase() === 'admin' ? 'admin' : 'user';

        // Create new user
        const newUser = new User({
            email,
            username,
            password: hashedPassword,
            role, // Assign role here
        });

        // Save to database
        await newUser.save();

        // Respond with success
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});



// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Fetch user from the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Determine redirect URL based on role
        const redirectUrl = user.role === 'admin' ? '/#!admin' : '/#!home';
        
        res.json({
            message: 'Login successful',
            role: user.role,
            username: user.username,
            redirect: redirectUrl,
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});


router.post('/logout', (req, res) => {
    // Invalidate session or token on the server if applicable
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
