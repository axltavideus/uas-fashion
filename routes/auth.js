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

        // Create new user
        const newUser = new User({
            email,
            username,
            password: hashedPassword,
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
            console.log('User not found with email:', email); // Debugging log
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(req.body.password.trim(), user.password);
        if (!isMatch) {
            console.log('Password does not match for user:', email); // Debugging log
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Successful login
        console.log('Login successful for user:', email); // Debugging log
        res.json({ message: 'Login successful!', user });
    } catch (error) {
        console.error('Error during login:', error); // Debugging log
        res.status(500).json({ message: 'Server error.', error });
    }
});

module.exports = router;
