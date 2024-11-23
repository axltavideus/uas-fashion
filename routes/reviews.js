const express = require('express');
const Review = require('../models/review');
const router = express.Router();

// Submit a review
router.post('/', async (req, res) => {
    const review = new Review(req.body);
    await review.save();
    res.status(201).send(review);
});

// Get all reviews
router.get('/', async (req, res) => {
    const reviews = await Review.find();
    res.send(reviews);
});

module.exports = router;
