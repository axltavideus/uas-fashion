const express = require('express');
const multer = require('multer');
const Shop = require('../models/shop');

const router = express.Router();

const upload = multer({
    dest: './uploads/', // Directory for uploads
    limits: { fileSize: 1000000 }, // 1MB file size limit
});

// Add a shop
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const shop = new Shop({
            name: req.body.name,
            description: req.body.description,
            location: req.body.location,
            image: req.file ? `/uploads/${req.file.filename}` : null, // Save accessible path
        });
        await shop.save();
        res.status(201).send(shop);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Unable to add shop' });
    }
});

// Get all shops
router.get('/', async (req, res) => {
    try {
        const shops = await Shop.find();
        res.send(shops);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Unable to fetch shops' });
    }
});

module.exports = router;
