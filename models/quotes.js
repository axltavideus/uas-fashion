const mongoose = require('mongoose');

const quotesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    text: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Quotes', quotesSchema);
