const mongoose = require('mongoose');

const ticketsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: null },
    users: [{ type: String }] // List of user emails who signed up
}, { timestamps: true });

module.exports = mongoose.model('Tickets', ticketsSchema);