const express = require('express');
const multer = require('multer');
const Tickets = require('../models/tickets'); // Assuming you have a Tickets model

const router = express.Router();

const upload = multer({
    dest: './uploads/', // Directory for uploads
    limits: { fileSize: 1000000 }, // 1MB file size limit
});

// Add a ticket (event)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const ticket = new Tickets({
            name: req.body.name,
            location: req.body.location,
            time: req.body.time,
            description: req.body.description,
            image: req.file ? `/uploads/${req.file.filename}` : null, // Save accessible path
        });
        await ticket.save();
        res.status(201).send(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Unable to add event' });
    }
});

// Update a ticket (event)
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            location: req.body.location,
            time: req.body.time,
            description: req.body.description,
        };
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`; // Update image path if a new image is uploaded
        }

        const ticket = await Tickets.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.send(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Unable to update event' });
    }
});

// Get all tickets (events)
router.get('/', async (req, res) => {
    try {
        const tickets = await Tickets.find();
        res.send(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Unable to fetch events' });
    }
});

module.exports = router;