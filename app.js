const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/user');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fashion-uas';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/shops', require('./routes/shop'));
app.use('/api/auth', require('./routes/auth'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use(async (req, res, next) => {
    if (req.user) {
        const user = await User.findById(req.user._id);
        req.user = user;
    }
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/home.html'));
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
