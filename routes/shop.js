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
            image: req.file ? `/uploads/${req.file.filename}` : null, // Save accessible path\
            link: req.body.link,
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

// Update a shop
    router.put('/:id', upload.single('image'), async (req, res) => {
        try {
            const updatedData = {
                name: req.body.name,
                description: req.body.description,
                location: req.body.location,
                image: req.file ? `/uploads/${req.file.filename}` : null, // Update image if a new one is uploaded
                link: req.body.link,
            };
            const shop = await Shop.findByIdAndUpdate(req.params.id, updatedData, { new: true });
            if (!shop) {
                return res.status(404).send('Shop not found');
            }
            res.send(shop);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Unable to update shop' });
        }
    });

// Delete a shop
router.delete('/:id', async (req, res) => {
    try {
        const shop = await Shop.findByIdAndDelete(req.params.id);
        if (!shop) {
            return res.status(404).send('Shop not found');
        }
        res.send({ message: 'Shop deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Unable to delete shop' });
    }
});

module.exports = router;
