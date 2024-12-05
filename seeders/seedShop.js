const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Shop = require('../models/shop'); // Adjust the path to your Shop model

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fashion-uas';

const seedShops = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const shops = [
            {
                name: 'Fashion Paradise',
                description: 'A one-stop shop for all your fashion needs.',
                location: 'New York, USA',
                image: 'fashion-paradise.jpg',
                link: 'https://fashionparadise.com',
            },
            {
                name: 'Style Hub',
                description: 'Exclusive styles and latest trends for everyone.',
                location: 'London, UK',
                image: 'style-hub.jpg',
                link: 'https://stylehub.co.uk',
            },
            {
                name: 'Chic Boutique',
                description: 'Where elegance meets affordability.',
                location: 'Paris, France',
                image: 'chic-boutique.jpg',
                link: 'https://chicboutique.fr',
            },
        ];

        // Clear existing shop data (optional, comment this line if not needed)
        await Shop.deleteMany({});
        console.log('Existing shop data cleared.');

        // Insert new shops
        await Shop.insertMany(shops);
        console.log('Shop data seeded successfully.');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding shop data:', error);
        mongoose.connection.close();
    }
};

seedShops();
