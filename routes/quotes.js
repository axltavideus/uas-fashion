const express = require('express');
const Quotes = require('../models/quotes');
const router = express.Router();

// Submit a review
router.post('/', async (req, res) => {
    const { name, text, } = req.body; // Destructure from request body



    const quotes = new Quotes({
        name,
        text,
    });

    try {
        await quotes.save();
        res.status(201).send(quotes);
    } catch (error) {
        res.status(500).send({ error: "Failed to save quotes" });
    }
});


// Get all quotes
router.get('/', async (req, res) => {
    const quotes = await Quotes.find();
    res.send(quotes);
});

router.put('/:id', async (req, res) => {
    const quotes= await Quotes.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(quotes);
});

router.delete('/:id', async (req, res) => {
    const result = await Quotes.deleteOne({ _id: req.params.id });
    res.status(204).send();
});

module.exports = router;