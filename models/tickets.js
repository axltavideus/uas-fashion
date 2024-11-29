const mongoose = require('mongoose');

const ticketsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    time: { type: String, required: true },
    email: { type: String, required: true },
});

module.exports = mongoose.model('Tickets', ticketsSchema);
