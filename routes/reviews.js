const express = require('express');
const Review = require('../models/reviews');
const router = express.Router();

// Submit a review
router.post('/', async (req, res) => {
    const review = new Review({
        name: req.body.name,
        text: req.body.text,
    });
    await review.save();
    res.status(201).send(review);
});


// Get all reviews
router.get('/', async (req, res) => {
    const reviews = await Review.find().populate('userId', '_id');
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
