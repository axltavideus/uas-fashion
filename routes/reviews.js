const express = require('express');
const Review = require('../models/reviews');
const router = express.Router();

// Submit a review
// Submit a review
router.post('/', async (req, res) => {
    const { name, text, email } = req.body; // Destructure from request body

    if (!email) {
        return res.status(400).send({ error: "Email is required" });
    }

    const review = new Review({
        name,
        text,
        email
    });

    try {
        await review.save();
        res.status(201).send(review);
    } catch (error) {
        res.status(500).send({ error: "Failed to save review" });
    }
});


// Get all reviews
router.get('/', async (req, res) => {
    const reviews = await Review.find();
    res.send(reviews);
});

router.put('/:id', async (req, res) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(review);
});

router.delete('/:id', async (req, res) => {
    const result = await Review.deleteOne({ _id: req.params.id });
    res.status(204).send();
});

module.exports = router;