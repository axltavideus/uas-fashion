const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    name: String,
    description: String,
    location: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Shop', shopSchema);
