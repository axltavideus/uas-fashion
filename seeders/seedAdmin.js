const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/user'); // Adjust the path to your User model

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fashion-uas';

const seedAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists:', existingAdmin);
        } else {
            const hashedPassword = await bcrypt.hash('admin123', 10); // Replace 'admin123' with your desired password
            const admin = new User({
                username: 'admin',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin',
            });

            await admin.save();
            console.log('Admin user created:', admin);
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding admin user:', error);
        mongoose.connection.close();
    }
};

seedAdmin();
