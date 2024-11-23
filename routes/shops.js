const express = require('express');
const Shop = require('../models/shop');
const router = express.Router();

// Add a shop (Admin only)
router.post('/', async (req, res) => {
    const shop = new Shop(req.body);
    await shop.save();
    res.status(201).send(shop);
});

// Get all shops
router.get('/', async (req, res) => {
    const shops = await Shop.find();
    res.send(shops);
});

module.exports = router;
