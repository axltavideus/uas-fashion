const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    name: String,
    description: String,
    location: String,
    image: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    link: String,
});

module.exports = mongoose.model('Shop', shopSchema);
