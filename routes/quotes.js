const express = require('express');
const Quotes = require('../models/quotes'); // Import model quotes
const router = express.Router();

// Create a new quote
router.post('/', async (req, res) => {
    const { name, text, email } = req.body; // Tambahkan email di sini

    // Validasi input
    if (!name || !text || !email) {
        return res.status(400).send({ error: "Name, text, and email are required." });
    }

    // Buat instance baru dari model Quotes
    const quote = new Quotes({ name, text, email });

    try {
        await quote.save(); // Simpan ke database
        res.status(201).send(quote);
    } catch (error) {
        res.status(500).send({ error: "Failed to save quote." });
    }
});


// Get all quotes
router.get('/', async (req, res) => {
    try {
        const quotes = await Quotes.find();
        res.send(quotes);
    } catch (error) {
        res.status(500).send({ error: "Failed to fetch quotes" });
    }
});

// Update a quote
router.put('/:id', async (req, res) => {
    const { name, text, email } = req.body;

    if (!email) {
        return res.status(400).send({ error: "Email is required." });
    }

    try {
        const quote = await Quotes.findById(req.params.id);

        if (!quote) {
            return res.status(404).send({ error: "Quote not found." });
        }

        // Cek apakah email cocok dengan pembuat quote
        if (quote.email !== email) {
            return res.status(403).send({ error: "You are not authorized to update this quote." });
        }

        // Update hanya field name dan text
        quote.name = name || quote.name;
        quote.text = text || quote.text;

        await quote.save(); // Simpan perubahan
        res.status(200).send(quote);
    } catch (error) {
        res.status(500).send({ error: "Failed to update quote." });
    }
});


// Delete a quote
// Delete a quote
router.delete('/:id', async (req, res) => {
    try {
        const result = await Quotes.findByIdAndDelete(req.params.id);

        if (!result) {
            return res.status(404).send({ error: "Quote not found" });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).send({ error: "Failed to delete quote" });
    }
});


module.exports = router;
