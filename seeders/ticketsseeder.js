const mongoose = require('mongoose');
const Tickets = require('../models/tickets'); // Corrected path to model Tickets
const MONGO_URI = 'mongodb://localhost:27017/fashion-uas'; // Sesuaikan URI

const seedTickets = async () => {
    try {
        // Koneksi ke MongoDB
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');

        const tickets = [
            {
                name: 'Fashion Expo 2024',
                location: 'Grand Fashion Hall, NYC',
                time: '2024-12-15T10:00:00',
                description: 'A grand event showcasing sustainable fashion trends.',
                image: 'https://example.com/images/fashion-expo.jpg',
                users: ['user1@example.com', 'user2@example.com'],
            },
            {
                name: 'Green Textile Workshop',
                location: 'Eco Center, LA',
                time: '2024-11-30T14:00:00',
                description: 'Learn about eco-friendly textile production techniques.',
                image: 'https://example.com/images/green-workshop.jpg',
                users: ['user3@example.com'],
            },
            {
                name: 'Sustainable Fashion Runway',
                location: 'Sustain Hall, SF',
                time: '2024-12-20T18:00:00',
                description: 'A fashion show presenting sustainable designs from renowned designers.',
                image: 'https://example.com/images/sustainable-runway.jpg',
                users: ['user4@example.com', 'user5@example.com', 'user6@example.com'],
            },
        ];

        // Tambahkan data ke koleksi Tickets
        await Tickets.insertMany(tickets);
        console.log('Tickets seeded successfully!');
    } catch (err) {
        console.error('Error seeding tickets:', err);
    } finally {
        // Tutup koneksi MongoDB
        mongoose.connection.close();
    }
};

seedTickets();
